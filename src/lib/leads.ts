import type { EventType, LeadStatus } from "@prisma/client";
import type { EventTypeId } from "./questionnaire/types";

export const STATUS_META: Record<LeadStatus, { label: string; tone: string }> = {
  NEW: { label: "Новая", tone: "bg-gold/15 text-gold-light ring-gold/40" },
  IN_PROGRESS: { label: "В обработке", tone: "bg-sky-500/10 text-sky-300 ring-sky-400/30" },
  AWAITING_REPLY: { label: "Ожидает ответа", tone: "bg-amber-500/10 text-amber-300 ring-amber-400/30" },
  CONFIRMED: { label: "Подтверждена", tone: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/30" },
  COMPLETED: { label: "Завершена", tone: "bg-milk/10 text-milk/80 ring-milk/20" },
  CANCELLED: { label: "Отменена", tone: "bg-rose-500/10 text-rose-300 ring-rose-400/30" },
};

export const STATUS_ORDER: LeadStatus[] = ["NEW", "IN_PROGRESS", "AWAITING_REPLY", "CONFIRMED", "COMPLETED", "CANCELLED"];

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  WEDDING: "Свадьба",
  BIRTHDAY: "День рождения",
  ANNIVERSARY: "Юбилей",
  CORPORATE: "Корпоратив",
  GRADUATION: "Выпускной",
  CONCERT: "Концерт",
  OTHER: "Другое",
};

export const EVENT_TYPE_ORDER: EventType[] = ["WEDDING", "BIRTHDAY", "ANNIVERSARY", "CORPORATE", "GRADUATION", "CONCERT", "OTHER"];

export function toDbEventType(id: EventTypeId): EventType {
  return id.toUpperCase() as EventType;
}

export function isLeadStatus(v: unknown): v is LeadStatus {
  return typeof v === "string" && (STATUS_ORDER as string[]).includes(v);
}

export function isEventType(v: unknown): v is EventType {
  return typeof v === "string" && (EVENT_TYPE_ORDER as string[]).includes(v);
}

