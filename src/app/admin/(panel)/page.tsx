import Link from "next/link";
import { ArrowRight, CalendarCheck, CalendarClock, CircleX, Inbox, Sparkles } from "lucide-react";
import { LEAD_CARD_SELECT, LeadCard } from "@/components/admin/LeadCard";
import { EVENT_TYPE_LABELS, EVENT_TYPE_ORDER } from "@/lib/leads";
import { prisma } from "@/lib/prisma";
import { todayIso } from "@/lib/questionnaire/logic";

export default async function DashboardPage() {
  const today = new Date(`${todayIso(process.env.APP_TIMEZONE ?? "Asia/Dushanbe")}T00:00:00.000Z`);
  const upcomingWhere = { status: "CONFIRMED" as const, eventDate: { gte: today } };

  const [total, fresh, confirmed, upcoming, cancelled, latest, nextEvents, byType] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.lead.count({ where: { status: "CONFIRMED" } }),
    prisma.lead.count({ where: upcomingWhere }),
    prisma.lead.count({ where: { status: "CANCELLED" } }),
    prisma.lead.findMany({ where: { status: "NEW" }, orderBy: { createdAt: "desc" }, take: 6, select: LEAD_CARD_SELECT }),
    prisma.lead.findMany({ where: upcomingWhere, orderBy: { eventDate: "asc" }, take: 6, select: LEAD_CARD_SELECT }),
    prisma.lead.groupBy({ by: ["eventType"], _count: { _all: true } }),
  ]);

  const stats = [
    { label: "Всего заявок", value: total, icon: Inbox, href: "/admin/leads" },
    { label: "Новые", value: fresh, icon: Sparkles, href: "/admin/leads?status=NEW", accent: true },
    { label: "Подтверждённые", value: confirmed, icon: CalendarCheck, href: "/admin/leads?status=CONFIRMED" },
    { label: "Предстоящие", value: upcoming, icon: CalendarClock, href: "/admin/leads?status=CONFIRMED&upcoming=1" },
    { label: "Отменённые", value: cancelled, icon: CircleX, href: "/admin/leads?status=CANCELLED" },
  ];
  const typeCounts = new Map(byType.map((b) => [b.eventType, b._count._all]));
  const maxType = Math.max(1, ...byType.map((b) => b._count._all));

  return (
    <div className="space-y-12">
      <header>
        <p className="eyebrow">Обзор</p>
        <h1 className="mt-3 text-4xl md:text-5xl">Дашборд</h1>
      </header>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className={`group rounded-2xl border p-5 transition hover:border-gold/50 ${s.accent ? "border-gold/40 bg-gold/5" : "border-milk/10 bg-white shadow-card"}`}>
            <s.icon className={`h-5 w-5 ${s.accent ? "text-gold" : "text-milk/40"}`} />
            <p className="mt-6 font-black italic text-5xl text-milk">{s.value}</p>
            <p className="mt-1 text-sm text-milk/50">{s.label}</p>
          </Link>
        ))}
      </section>

      <div className="grid gap-10 xl:grid-cols-2">
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl">Новые заявки</h2>
            <Link href="/admin/leads?status=NEW" className="inline-flex items-center gap-1 text-sm text-gold hover:text-gold">
              Все <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {latest.length ? latest.map((l) => <LeadCard key={l.id} lead={l} />) : <Empty text="Новых заявок нет — все обработаны." />}
          </div>
        </section>
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl">Ближайшие мероприятия</h2>
            <Link href="/admin/leads?status=CONFIRMED&upcoming=1" className="inline-flex items-center gap-1 text-sm text-gold hover:text-gold">
              Все <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {nextEvents.length ? nextEvents.map((l) => <LeadCard key={l.id} lead={l} />) : <Empty text="Подтверждённых предстоящих мероприятий пока нет." />}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-milk/10 bg-white shadow-card p-6">
        <h2 className="text-2xl">Заявки по типам мероприятий</h2>
        <div className="mt-6 space-y-3">
          {EVENT_TYPE_ORDER.map((t) => {
            const c = typeCounts.get(t) ?? 0;
            return (
              <Link key={t} href={`/admin/leads?type=${t}`} className="grid grid-cols-[120px_1fr_40px] items-center gap-4 text-sm hover:text-gold">
                <span className="text-milk/70">{EVENT_TYPE_LABELS[t]}</span>
                <span className="h-2 overflow-hidden rounded-full bg-milk/5">
                  <span className="block h-full rounded-full bg-gold-gradient" style={{ width: `${(c / maxType) * 100}%` }} />
                </span>
                <span className="text-right tabular-nums text-milk/60">{c}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-2xl border border-dashed border-milk/10 px-5 py-10 text-center text-sm text-milk/40">{text}</p>;
}
