import Link from "next/link";
import type { EventType, LeadStatus } from "@prisma/client";
import { CalendarDays, MapPin, Phone, Users } from "lucide-react";
import { EVENT_TYPE_LABELS, STATUS_META } from "@/lib/leads";
import { cn, formatDateRu } from "@/lib/utils";

export function StatusBadge({ status }: { status: LeadStatus }) {
  const m = STATUS_META[status];
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset", m.tone)}>{m.label}</span>;
}

export type LeadCardData = {
  id: string;
  clientName: string;
  phone: string;
  eventType: EventType;
  status: LeadStatus;
  eventDate: Date | null;
  approxPeriod: string | null;
  venueName: string | null;
  city: string | null;
  guests: number | null;
  createdAt: Date;
};

export function LeadCard({ lead }: { lead: LeadCardData }) {
  const place = [lead.venueName, lead.city].filter(Boolean).join(", ");
  return (
    <Link
      href={`/admin/leads/${lead.id}`}
      className={cn(
        "group block rounded-2xl border bg-white shadow-card p-5 transition hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-float",
        lead.status === "NEW" ? "border-gold/30" : "border-milk/10",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">{EVENT_TYPE_LABELS[lead.eventType]}</p>
          <p className="mt-1.5 truncate font-extrabold text-2xl text-milk">{lead.clientName}</p>
        </div>
        <StatusBadge status={lead.status} />
      </div>
      <div className="mt-4 grid gap-2 text-sm text-milk/60 sm:grid-cols-2">
        <span className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 shrink-0 text-milk/30" />
          {lead.eventDate ? formatDateRu(lead.eventDate) : lead.approxPeriod ?? "Дата не указана"}
        </span>
        <span className="flex items-center gap-2">
          <Phone className="h-4 w-4 shrink-0 text-milk/30" />
          {lead.phone}
        </span>
        {place && (
          <span className="flex items-center gap-2 truncate">
            <MapPin className="h-4 w-4 shrink-0 text-milk/30" />
            <span className="truncate">{place}</span>
          </span>
        )}
        {lead.guests && (
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4 shrink-0 text-milk/30" />
            {lead.guests} гостей
          </span>
        )}
      </div>
      <p className="mt-4 border-t border-milk/5 pt-3 text-xs text-milk/35">Заявка от {formatDateRu(lead.createdAt, true)}</p>
    </Link>
  );
}

export const LEAD_CARD_SELECT = {
  id: true,
  clientName: true,
  phone: true,
  eventType: true,
  status: true,
  eventDate: true,
  approxPeriod: true,
  venueName: true,
  city: true,
  guests: true,
  createdAt: true,
} as const;
