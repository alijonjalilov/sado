import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { ChevronLeft, ChevronRight, Filter, Search, X } from "lucide-react";
import { LEAD_CARD_SELECT, LeadCard } from "@/components/admin/LeadCard";
import { EVENT_TYPE_LABELS, EVENT_TYPE_ORDER, STATUS_META, STATUS_ORDER, isEventType, isLeadStatus } from "@/lib/leads";
import { prisma } from "@/lib/prisma";
import { todayIso } from "@/lib/questionnaire/logic";
import { pluralRu } from "@/lib/utils";

const PAGE_SIZE = 24;

type SP = { status?: string; type?: string; from?: string; to?: string; q?: string; page?: string; upcoming?: string; sort?: string };
type Props = { searchParams: Promise<SP> };

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export default async function LeadsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);

  const where: Prisma.LeadWhereInput = {};
  if (isLeadStatus(sp.status)) where.status = sp.status;
  if (isEventType(sp.type)) where.eventType = sp.type;

  const dateFilter: Prisma.DateTimeNullableFilter = {};
  if (sp.from && DATE_RE.test(sp.from)) dateFilter.gte = new Date(`${sp.from}T00:00:00.000Z`);
  if (sp.to && DATE_RE.test(sp.to)) dateFilter.lte = new Date(`${sp.to}T00:00:00.000Z`);
  if (sp.upcoming === "1") dateFilter.gte = new Date(`${todayIso(process.env.APP_TIMEZONE ?? "Asia/Dushanbe")}T00:00:00.000Z`);
  if (Object.keys(dateFilter).length) where.eventDate = dateFilter;

  const q = sp.q?.trim();
  if (q) {
    where.OR = [
      { clientName: { contains: q, mode: "insensitive" } },
      { phone: { contains: q } },
      { venueName: { contains: q, mode: "insensitive" } },
      { telegram: { contains: q, mode: "insensitive" } },
    ];
  }

  const orderBy: Prisma.LeadOrderByWithRelationInput =
    sp.sort === "event" ? { eventDate: { sort: "asc", nulls: "last" } } : { createdAt: "desc" };

  const [count, leads] = await Promise.all([
    prisma.lead.count({ where }),
    prisma.lead.findMany({ where, orderBy, take: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE, select: LEAD_CARD_SELECT }),
  ]);
  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const hasFilters = Boolean(sp.status || sp.type || sp.from || sp.to || q || sp.upcoming);

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(sp)) if (v && k !== "page") params.set(k, v);
    params.set("page", String(p));
    return `/admin/leads?${params.toString()}`;
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Заявки</p>
          <h1 className="mt-3 text-4xl md:text-5xl">Все заявки</h1>
        </div>
        <p className="text-sm text-milk/50">
          Найдено {count} {pluralRu(count, ["заявка", "заявки", "заявок"])}
        </p>
      </header>

      {/* Быстрые фильтры по статусу */}
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
        <Link href="/admin/leads" className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${!sp.status ? "border-gold bg-gold/10 text-gold" : "border-milk/10 text-milk/60 hover:text-milk"}`}>
          Все
        </Link>
        {STATUS_ORDER.map((s) => (
          <Link
            key={s}
            href={`/admin/leads?status=${s}`}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${sp.status === s ? "border-gold bg-gold/10 text-gold" : "border-milk/10 text-milk/60 hover:text-milk"}`}
          >
            {STATUS_META[s].label}
          </Link>
        ))}
      </div>

      {/* Расширенные фильтры (GET-форма — работает без JavaScript) */}
      <form method="get" className="grid gap-3 rounded-2xl border border-milk/10 bg-white shadow-card p-4 sm:grid-cols-2 lg:grid-cols-6">
        <label className="relative lg:col-span-2">
          <span className="sr-only">Поиск</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-milk/30" />
          <input name="q" defaultValue={q} placeholder="Имя, телефон, площадка" className="input py-3 pl-11 text-sm" />
        </label>
        <select name="type" defaultValue={sp.type ?? ""} className="input py-3 text-sm" aria-label="Тип мероприятия">
          <option value="">Все типы</option>
          {EVENT_TYPE_ORDER.map((t) => (
            <option key={t} value={t}>
              {EVENT_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={sp.status ?? ""} className="input py-3 text-sm" aria-label="Статус">
          <option value="">Все статусы</option>
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>
              {STATUS_META[s].label}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-xs text-milk/50">
          с
          <input type="date" name="from" defaultValue={sp.from} className="input py-3 text-sm [color-scheme:light]" aria-label="Дата мероприятия с" />
        </label>
        <label className="flex items-center gap-2 text-xs text-milk/50">
          по
          <input type="date" name="to" defaultValue={sp.to} className="input py-3 text-sm [color-scheme:light]" aria-label="Дата мероприятия по" />
        </label>
        <select name="sort" defaultValue={sp.sort ?? ""} className="input py-3 text-sm lg:col-span-2" aria-label="Сортировка">
          <option value="">Сначала новые заявки</option>
          <option value="event">По дате мероприятия</option>
        </select>
        <div className="flex gap-2 sm:col-span-2 lg:col-span-4 lg:justify-end">
          {hasFilters && (
            <Link href="/admin/leads" className="btn-outline px-5 py-3 text-sm">
              <X className="h-4 w-4" /> Сбросить
            </Link>
          )}
          <button type="submit" className="btn-gold px-6 py-3 text-sm">
            <Filter className="h-4 w-4" /> Применить
          </button>
        </div>
      </form>

      {leads.length ? (
        <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
          {leads.map((l) => (
            <LeadCard key={l.id} lead={l} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-milk/10 px-5 py-16 text-center text-milk/40">
          {hasFilters ? "По выбранным фильтрам заявок нет." : "Заявок пока нет. Они появятся здесь, как только клиенты заполнят форму на сайте."}
        </p>
      )}

      {pages > 1 && (
        <nav className="flex items-center justify-center gap-3" aria-label="Страницы">
          {page > 1 && (
            <Link href={pageHref(page - 1)} className="btn-outline px-4 py-2.5" aria-label="Предыдущая страница">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          )}
          <span className="text-sm text-milk/60">
            {page} / {pages}
          </span>
          {page < pages && (
            <Link href={pageHref(page + 1)} className="btn-outline px-4 py-2.5" aria-label="Следующая страница">
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
