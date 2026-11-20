import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getClientIp, isSameOrigin, rateLimit } from "@/lib/http";

export const dynamic = "force-dynamic";

const schema = z.object({
  authorName: z.string().trim().min(2, "Укажите имя").max(80),
  eventLabel: z.string().trim().max(80).optional().nullable(),
  text: z.string().trim().min(10, "Отзыв слишком короткий").max(2000),
  rating: z.number().int().min(1).max(5),
  website: z.string().max(200).optional().nullable(),
});

/** Публичная отправка отзыва — попадает на модерацию (статус PENDING). */
export async function POST(req: Request) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: "Недопустимый источник запроса" }, { status: 403 });
  const rl = rateLimit(`review:${getClientIp(req)}`, 3, 60 * 60 * 1000);
  if (!rl.ok) return NextResponse.json({ error: "Слишком много отзывов. Попробуйте позже." }, { status: 429 });

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Проверьте поля формы" }, { status: 400 });
  }
  if (parsed.data.website) return NextResponse.json({ ok: true });

  try {
    const host = await prisma.host.findUnique({ where: { slug: "main" }, select: { id: true } });
    await prisma.review.create({
      data: {
        authorName: parsed.data.authorName,
        eventLabel: parsed.data.eventLabel || null,
        text: parsed.data.text,
        rating: parsed.data.rating,
        status: "PENDING",
        hostId: host?.id ?? null,
      },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error("[api/reviews] failed:", e);
    return NextResponse.json({ error: "Не удалось сохранить отзыв" }, { status: 500 });
  }
}
