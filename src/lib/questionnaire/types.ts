// Типы движка динамической анкеты.
// Чтобы добавить вопрос — достаточно описать поле в config.ts, интерфейс и
// серверная валидация подхватят его автоматически.

export type EventTypeId = "wedding" | "birthday" | "anniversary" | "corporate" | "graduation" | "concert" | "other";

export type AnswerValue = string | number | boolean | string[] | null | undefined;
export type Answers = Record<string, AnswerValue>;

export type Condition =
  | { field: string; in: string[] }
  | { field: string; notIn: string[] }
  | { field: string; filled: true }
  | { field: string; equals: boolean }
  | { all: Condition[] }
  | { any: Condition[] }
  | { not: Condition };

export type FieldType =
  | "choice" // один вариант (карточки)
  | "multichoice" // несколько вариантов
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "time"
  | "tel"
  | "checkbox";

export interface FieldOption {
  value: string;
  label: string;
  description?: string;
  icon?: string; // имя иконки Lucide из components/booking/icons.ts
}

export interface Field {
  id: string;
  type: FieldType;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  options?: FieldOption[];
  showIf?: Condition;
  min?: number;
  max?: number;
  maxLength?: number;
  /** Колонок для карточек выбора на десктопе */
  columns?: 1 | 2 | 3 | 4;
  /** Поле занимает половину ширины на десктопе */
  half?: boolean;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
}

export interface Step {
  id: string;
  title: string;
  subtitle?: string;
  fields: Field[];
  showIf?: Condition;
  /** Автоматический переход после выбора (для шагов с одним вопросом-выбором) */
  autoAdvance?: boolean;
}
