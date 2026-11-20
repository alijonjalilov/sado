import { visibleFields, visibleSteps, isFilled } from "./logic";
import type { AnswerValue, Answers, Field } from "./types";

export type SummarySection = { stepId: string; title: string; items: { fieldId: string; label: string; value: string }[] };

function isoToRu(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : iso;
}

export function formatAnswer(field: Field, value: AnswerValue): string {
  if (!isFilled(value)) return "";
  const optionLabel = (v: string) => field.options?.find((o) => o.value === v)?.label ?? v;
  switch (field.type) {
    case "choice":
      return optionLabel(String(value));
    case "multichoice":
      return Array.isArray(value) ? value.map(optionLabel).join(", ") : String(value);
    case "checkbox":
      return value === true ? "Да" : "Нет";
    case "date":
      return isoToRu(String(value));
    default:
      return String(value);
  }
}

/** Читаемый снимок ответов: заголовок шага → пары «вопрос — ответ». */
export function buildSummary(answers: Answers): SummarySection[] {
  const sections: SummarySection[] = [];
  for (const step of visibleSteps(answers)) {
    const items = visibleFields(step, answers)
      .map((f) => ({ fieldId: f.id, label: f.label, value: formatAnswer(f, answers[f.id]) }))
      .filter((i) => i.value !== "" && !(i.value === "Нет" && step.fields.find((f) => f.id === i.fieldId)?.type === "checkbox"));
    if (items.length) sections.push({ stepId: step.id, title: step.title, items });
  }
  return sections;
}
