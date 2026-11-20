import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, Globe, MapPin, Phone, Send, Users } from "lucide-react";
import { Comments, DeleteLeadButton, StatusControl } from "@/components/admin/LeadActions";
import { StatusBadge } from "@/components/admin/LeadCard";
import { TelegramIcon, WhatsAppIcon } from "@/components/ui/SocialIcons";
import { EVENT_TYPE_LABELS } from "@/lib/leads";
import { prisma } from "@/lib/prisma";
import type { SummarySection } from "@/lib/questionnaire/summary";
import { digitsOnly, formatDateRu } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export default async function LeadDetailPage({ params }: Props) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { comments: { orderBy: { createdAt: "desc" }, include: { author: { select: { name: true, login: true } } } } },
  });
  if (!lead) notFound();

  const summary = (Array.isArray(lead.summary) ? lead.summary : []) as unknown as SummarySection[];
  const tg = lead.telegram?.replace(/^@/, "");
  const tgHref = tg ? (/^\+?\d[\d\s-]+$/.test(tg) ? `https://t.me/+${digitsOnly(tg)}` : `https://t.me/${tg}`) : null;
  const waHref = lead.whatsapp ? `https://wa.me/${digitsOnly(lead.whatsapp)}` : null;

  const facts = [
    { icon: CalendarDays, label: "Дата", value: lead.eventDate ? formatDateRu(lead.eventDate) : lead.approxPeriod ? `Примерно: ${lead.approxPeriod}` : "Не указана" },
    { icon: Clock, label: "Начало / длительность", value: [lead.startTime, lead.duration].filter(Boolean).join(" · ") || "—" },
    { icon: MapPin, label: "Место", value: [lead.venueName, lead.city, lead.address].filter(Boolean).join(", ") || "—" },
    { icon: Users, label: "Гостей", value: lead.guests ? String(lead.guests) : "—" },
    { icon: Globe, label: "Язык", value: lead.language ?? "—" },
  ];

  return (
    <div className="space-y-8">
      <Link href="/admin/leads" className="inline-flex items-center gap-2 text-sm text-milk/50 hover:text-gold">
        <ArrowLeft className="h-4 w-4" /> Все заявки
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-luxe text-gold">{EVENT_TYPE_LABELS[lead.eventType]}</p>
          <h1 className="mt-3 text-4xl md:text-5xl">{lead.clientName}</h1>
          <p className="mt-2 text-sm text-milk/40">
            Заявка от {formatDateRu(lead.createdAt, true)}
            {lead.statusChangedAt && <> · статус изменён {formatDateRu(lead.statusChangedAt, true)}</>}
          </p>
        </div>
        <StatusBadge status={lead.status} />
      </header>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="grid gap-px overflow-hidden rounded-2xl border border-milk/10 bg-milk/10 sm:grid-cols-2 lg:grid-cols-3">
            {facts.map((f) => (
              <div key={f.label} className="bg-ink-800 p-5">
                <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-milk/40">
                  <f.icon className="h-3.5 w-3.5" /> {f.label}
                </p>
                <p className="mt-2 text-milk">{f.value}</p>
              </div>
            ))}
          </section>

          <section className="rounded-2xl border border-milk/10 bg-white shadow-card p-6">
            <h2 className="text-2xl">Ответы клиента</h2>
            <div className="mt-6 space-y-7">
              {summary.map((s) => (
                <div key={s.stepId}>
                  <p className="text-sm font-semibold text-gold">{s.title}</p>
                  <dl className="mt-3 divide-y divide-milk/5 rounded-xl border border-milk/5">
                    {s.items.map((it) => (
                      <div key={it.fieldId} className="grid gap-1 px-4 py-3 text-sm sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-4">
                        <dt className="text-milk/45">{it.label}</dt>
                        <dd className="whitespace-pre-line break-words text-milk/90">{it.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
              {!summary.length && <p className="text-sm text-milk/40">Нет данных.</p>}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-gold/25 bg-gold/5 p-6">
            <h2 className="text-2xl">Связаться</h2>
            <p className="mt-1 text-sm text-milk/50">Предпочтительно: {lead.preferredContact ?? "не указано"}</p>
            <div className="mt-5 grid gap-2">
              <a href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`} className="btn-gold justify-start py-3 text-sm">
                <Phone className="h-4 w-4" /> {lead.phone}
              </a>
              {waHref && (
                <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn-outline justify-start py-3 text-sm">
                  <WhatsAppIcon className="h-4 w-4" /> WhatsApp {lead.whatsapp !== lead.phone && lead.whatsapp}
                </a>
              )}
              {tgHref && (
                <a href={tgHref} target="_blank" rel="noopener noreferrer" className="btn-outline justify-start py-3 text-sm">
                  <TelegramIcon className="h-4 w-4" /> {lead.telegram}
                </a>
              )}
              {!tgHref && !waHref && (
                <p className="flex items-center gap-2 text-xs text-milk/40">
                  <Send className="h-3.5 w-3.5" /> Мессенджеры не указаны
                </p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-milk/10 bg-white shadow-card p-6">
            <h2 className="text-xl">Статус заявки</h2>
            <div className="mt-4">
              <StatusControl leadId={lead.id} status={lead.status} />
            </div>
          </section>

          <section className="rounded-2xl border border-milk/10 bg-white shadow-card p-6">
            <h2 className="text-xl">Внутренние комментарии</h2>
            <div className="mt-4">
              <Comments
                leadId={lead.id}
                comments={lead.comments.map((c) => ({
                  id: c.id,
                  text: c.text,
                  createdAt: formatDateRu(c.createdAt, true),
                  author: c.author?.name ?? c.author?.login ?? null,
                }))}
              />
            </div>
          </section>

          <DeleteLeadButton leadId={lead.id} />
        </aside>
      </div>
    </div>
  );
}
