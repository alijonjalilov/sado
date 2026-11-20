// Условная логика и валидация анкеты. Используется и в браузере, и на сервере,
// поэтому правила проверки всегда совпадают.

import { getSteps, isEventTypeId } from "./config";
import type { AnswerValue, Answers, Condition, EventTypeId, Field, Step } from "./types";

export function isFilled(v: AnswerValue): boolean {
  if (v === null || v === undefined) return false;
  if (typeof v === "string") return v.trim().length > 0;
  if (typeof v === "number") return Number.isFinite(v);
  if (typeof v === "boolean") return v;
  if (Array.isArray(v)) return v.length > 0;
  return false;
}

export function evalCondition(c: Condition | undefined, a: Answers): boolean {
  if (!c) return true;
  if ("all" in c) return c.all.every((x) => evalCondition(x, a));
  if ("any" in c) return c.any.some((x) => evalCondition(x, a));
  if ("not" in c) return !evalCondition(c.not, a);
  const v = a[c.field];
  if ("in" in c) {
    if (Array.isArray(v)) return v.some((x) => c.in.includes(x));
    return typeof v === "string" && c.in.includes(v);
  }
  if ("notIn" in c) {
    if (Array.isArray(v)) return !v.some((x) => c.notIn.includes(x));
    return !(typeof v === "string" && c.notIn.includes(v));
  }
  if ("filled" in c) return isFilled(v);
  if ("equals" in c) return (v === true) === c.equals;
  return true;
}

export function eventTypeOf(a: Answers): EventTypeId | undefined {
  return isEventTypeId(a.eventType) ? a.eventType : undefined;
}

export function visibleSteps(a: Answers): Step[] {
  return getSteps(eventTypeOf(a)).filter((s) => evalCondition(s.showIf, a));
}

export function visibleFields(step: Step, a: Answers): Field[] {
  return step.fields.filter((f) => evalCondition(f.showIf, a));
}

const PHONE_RE = /^\+?[\d\s()\-]{7,22}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export function todayIso(timeZone?: string): string {
  // en-CA даёт формат YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

export function addDaysIso(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export type ValidationContext = { minDate: string; maxDate: string };

export function defaultValidationContext(timeZone?: string): ValidationContext {
  const today = todayIso(timeZone);
  return { minDate: today, maxDate: addDaysIso(today, 365 * 5) };
}

/** Возвращает текст ошибки или null. */
export function validateField(field: Field, value: AnswerValue, ctx: ValidationContext): string | null {
  if (!isFilled(value)) {
    if (!field.required) return null;
    if (field.type === "choice" || field.type === "multichoice") return "Пожалуйста, выберите вариант";
    if (field.type === "checkbox") return "Необходимо отметить";
    return "Пожалуйста, заполните это поле";
  }

  switch (field.type) {
    case "choice": {
      if (typeof value !== "string" || !field.options?.some((o) => o.value === value)) return "Недопустимый вариант";
      return null;
    }
    case "multichoice": {
      if (!Array.isArray(value) || value.some((x) => !field.options?.some((o) => o.value === x))) return "Недопустимый вариант";
      return null;
    }
    case "checkbox":
      return typeof value === "boolean" ? null : "Недопустимое значение";
    case "text":
    case "textarea": {
      if (typeof value !== "string") return "Недопустимое значение";
      const max = field.maxLength ?? (field.type === "textarea" ? 2000 : 200);
      if (value.trim().length > max) return `Не более ${max} символов`;
      return null;
    }
    case "number": {
      const n = typeof value === "number" ? value : Number(String(value).replace(",", ".").trim());
      if (!Number.isFinite(n) || !Number.isInteger(n)) return "Введите целое число";
      if (field.min !== undefined && n < field.min) return `Минимум — ${field.min}`;
      if (field.max !== undefined && n > field.max) return `Максимум — ${field.max}`;
      return null;
    }
    case "date": {
      if (typeof value !== "string" || !DATE_RE.test(value) || Number.isNaN(new Date(`${value}T00:00:00Z`).getTime())) return "Укажите корректную дату";
      if (value < ctx.minDate) return "Нельзя выбрать прошедшую дату";
      if (value > ctx.maxDate) return "Слишком далёкая дата";
      return null;
    }
    case "time":
      return typeof value === "string" && TIME_RE.test(value) ? null : "Укажите время в формате ЧЧ:ММ";
    case "tel": {
      if (typeof value !== "string" || !PHONE_RE.test(value.trim())) return "Укажите корректный номер";
      const digits = value.replace(/\D/g, "");
      if (digits.length < 7 || digits.length > 15) return "Укажите корректный номер";
      return null;
    }
  }
  return null;
}

export function validateStep(step: Step, a: Answers, ctx: ValidationContext): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const f of visibleFields(step, a)) {
    const err = validateField(f, a[f.id], ctx);
    if (err) errors[f.id] = err;
  }
  return errors;
}

function normalize(field: Field, value: AnswerValue): AnswerValue {
  if (!isFilled(value)) return undefined;
  switch (field.type) {
    case "number":
      return typeof value === "number" ? value : Number(String(value).replace(",", ".").trim());
    case "text":
    case "textarea":
    case "tel":
      return typeof value === "string" ? value.trim() : value;
    default:
      return value;
  }
}

/**
 * Полная проверка анкеты: оставляет только видимые поля, нормализует значения.
 * Используется на сервере перед сохранением заявки.
 */
export function sanitizeAnswers(raw: Answers, ctx: ValidationContext): { answers: Answers; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const answers: Answers = {};
  for (const step of visibleSteps(raw)) {
    for (const f of visibleFields(step, raw)) {
      const err = validateField(f, raw[f.id], ctx);
      if (err) {
        errors[f.id] = err;
        continue;
      }
      const v = normalize(f, raw[f.id]);
      if (v !== undefined) answers[f.id] = v;
    }
  }
  return { answers, errors };
}

/** Индекс шага, на котором находится поле (для перехода к ошибке). */
export function stepIndexOfField(a: Answers, fieldId: string): number {
  return visibleSteps(a).findIndex((s) => s.fields.some((f) => f.id === fieldId));
}
