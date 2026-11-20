import type { EventType, LeadStatus } from "@prisma/client";
import type { EventTypeId } from "./questionnaire/types";

export const STATUS_META: Record<LeadStatus, { label: string; tone: string }> = {
  NEW: { label: "Новая", tone: "bg-gold-pale text-gold ring-gold/30" },
  IN_PROGRESS: { label: "В обработке", tone: "bg-sky-50 text-sky-700 ring-sky-600/20" },
  AWAITING_REPLY: { label: "Ожидает ответа", tone: "bg-amber-50 text-amber-700 ring-amber-600/20" },
  CONFIRMED: { label: "Подтверждена", tone: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
  COMPLETED: { label: "Завершена", tone: "bg-milk/5 text-milk/70 ring-milk/15" },
  CANCELLED: { label: "Отменена", tone: "bg-rose-50 text-rose-700 ring-rose-600/20" },
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

