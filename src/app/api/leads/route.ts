import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getClientIp, isSameOrigin, rateLimit } from "@/lib/http";
import { toDbEventType, EVENT_TYPE_LABELS } from "@/lib/leads";
import { isEventTypeId } from "@/lib/questionnaire/config";
import { addDaysIso, todayIso, sanitizeAnswers } from "@/lib/questionnaire/logic";
import { buildSummary } from "@/lib/questionnaire/summary";
import type { Answers } from "@/lib/questionnaire/types";
import { notifyNewLead } from "@/lib/telegram";
import { siteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

const answerValue = z.union([z.string().max(5000), z.number(), z.boolean(), z.array(z.string().max(200)).max(30), z.null()]);

const bodySchema = z.object({
  answers: z.record(z.string().max(64), answerValue).refine((o) => Object.keys(o).length <= 120, "Слишком много полей"),
  website: z.string().max(200).optional(), // honeypot
});

const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);

export async function POST(req: Request) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: "Недопустимый источник запроса" }, { status: 403 });

  const ip = getClientIp(req);
  const rl = rateLimit(`lead:${ip}`, 8, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json({ error: "Слишком много заявок. Попробуйте позже или позвоните нам." }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный формат данных" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Некорректные данные заявки" }, { status: 400 });

  // Бот заполнил скрытое поле — делаем вид, что всё прошло успешно
  if (parsed.data.website) return NextResponse.json({ ok: true });

  const raw = parsed.data.answers as Answers;
  const eventTypeId = raw.eventType;
  if (!isEventTypeId(eventTypeId)) {
    return NextResponse.json({ error: "Выберите тип мероприятия", errors: { eventType: "Выберите тип мероприятия" } }, { status: 422 });
  }

  // Допускаем «вчера» по серверному часовому поясу — у клиента может быть другой пояс
  const today = todayIso(process.env.APP_TIMEZONE ?? "Asia/Dushanbe");
  const { answers, errors } = sanitizeAnswers(raw, { minDate: addDaysIso(today, -1), maxDate: addDaysIso(today, 365 * 5 + 1) });
  if (Object.keys(errors).length) {
    return NextResponse.json({ error: "Проверьте заполнение полей", errors }, { status: 422 });
  }

  const summary = buildSummary(answers);
  const phone = str(answers.phone)!;
  const languageOption = str(answers.language);
  const language = languageOption === "other" ? str(answers.languageOther) : summary.find((s) => s.stepId === "language")?.items[0]?.value ?? null;
  const durationLabel = summary.flatMap((s) => s.items).find((i) => i.fieldId === "duration")?.value ?? null;
  const preferredLabel = summary.flatMap((s) => s.items).find((i) => i.fieldId === "preferredContact")?.value ?? null;
  const eventDate = str(answers.eventDate);

  try {
    const host = await prisma.host.findUnique({ where: { slug: "main" }, select: { id: true } });
    const lead = await prisma.lead.create({
      data: {
        eventType: toDbEventType(eventTypeId),
        clientName: str(answers.clientName)!,
        phone,
        whatsapp: answers.whatsappSame === true ? phone : str(answers.whatsapp),
        telegram: str(answers.telegram),
        preferredContact: preferredLabel,
        eventDate: eventDate ? new Date(`${eventDate}T00:00:00.000Z`) : null,
        approxPeriod: str(answers.approxPeriod),
        startTime: str(answers.startTime),
        duration: durationLabel,
        guests: num(answers.guests),
        language,
        city: str(answers.city),
        venueName: answers.venueUndecided === true ? "Место не определено" : str(answers.venueName),
        address: str(answers.address),
        answers: answers as Prisma.InputJsonValue,
        summary: summary as unknown as Prisma.InputJsonValue,
        source: req.headers.get("referer")?.slice(0, 300) ?? null,
        userAgent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
        hostId: host?.id ?? null,
      },
      select: { id: true },
    });

    // Уведомление не должно ломать отправку заявки
    await notifyNewLead({
      id: lead.id,
      eventLabel: EVENT_TYPE_LABELS[toDbEventType(eventTypeId)],
      clientName: str(answers.clientName)!,
      phone,
      summary,
      adminUrl: `${siteUrl()}/admin/leads/${lead.id}`,
    });

    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
  } catch (e) {
    console.error("[api/leads] create failed:", e);
    return NextResponse.json({ error: "Не удалось сохранить заявку. Пожалуйста, попробуйте позже или позвоните нам." }, { status: 500 });
  }
}
