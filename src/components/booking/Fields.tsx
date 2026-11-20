"use client";

import { Controller, type Control, type FieldValues, type UseFormRegister } from "react-hook-form";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import type { ValidationContext } from "@/lib/questionnaire/logic";
import type { Field } from "@/lib/questionnaire/types";
import { cn } from "@/lib/utils";
import { OPTION_ICONS } from "./icons";

const COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

type Props = {
  field: Field;
  control: Control<FieldValues>;
  register: UseFormRegister<FieldValues>;
  error?: string;
  ctx: ValidationContext;
  onPicked?: (value: string) => void;
};

export function FieldRenderer({ field, control, register, error, ctx, onPicked }: Props) {
  const id = `f-${field.id}`;
  const errorId = `${id}-error`;
  const describedBy = error ? errorId : undefined;

  const label = field.type !== "checkbox" && (
    <label htmlFor={field.type === "choice" || field.type === "multichoice" ? undefined : id} className="label flex items-baseline gap-1.5" id={`${id}-label`}>
      {field.label}
      {field.required && <span className="text-gold">*</span>}
    </label>
  );

  let control_: React.ReactNode = null;

  switch (field.type) {
    case "choice":
      control_ = (
        <Controller
          name={field.id}
          control={control}
          render={({ field: f }) => (
            <div role="radiogroup" aria-labelledby={`${id}-label`} aria-describedby={describedBy} className={cn("grid gap-3", COLS[field.columns ?? 2])}>
              {field.options?.map((o) => {
                const selected = f.value === o.value;
                const Icon = o.icon ? OPTION_ICONS[o.icon] ?? Sparkles : null;
                return (
                  <button
                    key={o.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => {
                      const next = selected && !field.required ? undefined : o.value;
                      f.onChange(next);
                      if (next) onPicked?.(next);
                    }}
                    className={cn(
                      "group relative flex min-h-[64px] items-center gap-4 rounded-[20px] border p-4 text-left transition duration-300 ease-out md:p-5",
                      Icon && field.columns === 4 && "flex-col items-start justify-between gap-6 md:min-h-[150px]",
                      selected ? "border-gold bg-blush-soft ring-4 ring-gold/10" : "border-line bg-white shadow-card hover:-translate-y-0.5 hover:border-gold/40",
                      error && !selected && "border-rose-300",
                    )}
                  >
                    {Icon && (
                      <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl border transition", selected ? "border-gold bg-gold text-white" : "border-transparent bg-blush-soft text-gold group-hover:bg-blush")}>
                        <Icon className="h-5 w-5" strokeWidth={1.6} />
                      </span>
                    )}
                    <span className="flex-1">
                      <span className="block font-semibold leading-snug text-milk">{o.label}</span>
                      {o.description && <span className="mt-1 block text-xs leading-snug text-milk/50">{o.description}</span>}
                    </span>
                    <span className={cn("absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full border transition", selected ? "border-gold bg-gold text-white" : "border-milk/20 opacity-0 group-hover:opacity-100")}>
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        />
      );
      break;

    case "multichoice":
      control_ = (
        <Controller
          name={field.id}
          control={control}
          render={({ field: f }) => {
            const value: string[] = Array.isArray(f.value) ? f.value : [];
            return (
              <div role="group" aria-labelledby={`${id}-label`} aria-describedby={describedBy} className={cn("grid gap-3", COLS[field.columns ?? 2])}>
                {field.options?.map((o) => {
                  const checked = value.includes(o.value);
                  return (
                    <button
                      key={o.value}
                      type="button"
                      role="checkbox"
                      aria-checked={checked}
                      onClick={() => f.onChange(checked ? value.filter((v) => v !== o.value) : [...value, o.value])}
                      className={cn(
                        "flex min-h-[56px] items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition",
                        checked ? "border-gold bg-blush-soft font-semibold text-milk" : "border-line bg-white text-milk/80 shadow-card hover:border-gold/40",
                      )}
                    >
                      <span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-md border transition", checked ? "border-gold bg-gold text-white" : "border-milk/30")}>
                        {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                      </span>
                      {o.label}
                    </button>
                  );
                })}
              </div>
            );
          }}
        />
      );
      break;

    case "checkbox":
      control_ = (
        <Controller
          name={field.id}
          control={control}
          render={({ field: f }) => (
            <button
              type="button"
              role="checkbox"
              aria-checked={f.value === true}
              onClick={() => f.onChange(!(f.value === true))}
              className="flex items-center gap-3 py-1 text-left text-sm text-milk/80 transition hover:text-milk"
            >
              <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-lg border transition", f.value === true ? "border-gold bg-gold text-white" : "border-milk/30")}>
                {f.value === true && <Check className="h-4 w-4" strokeWidth={3} />}
              </span>
              {field.label}
            </button>
          )}
        />
      );
      break;

    case "textarea":
      control_ = (
        <textarea
          id={id}
          rows={4}
          maxLength={field.maxLength}
          placeholder={field.placeholder}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn("input resize-y", error && "border-rose-400/60")}
          {...register(field.id)}
        />
      );
      break;

    default: {
      const type = field.type === "date" ? "date" : field.type === "time" ? "time" : field.type === "tel" ? "tel" : "text";
      control_ = (
        <input
          id={id}
          type={type}
          inputMode={field.inputMode ?? (field.type === "number" ? "numeric" : undefined)}
          autoComplete={field.autoComplete}
          maxLength={field.maxLength}
          placeholder={field.placeholder}
          min={field.type === "date" ? ctx.minDate : undefined}
          max={field.type === "date" ? ctx.maxDate : undefined}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn("input", (field.type === "date" || field.type === "time") && "min-h-[58px] [color-scheme:light]", error && "border-rose-400/60")}
          {...register(field.id)}
        />
      );
    }
  }

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className={cn(field.half ? "sm:col-span-1" : "sm:col-span-2")}
    >
      {label}
      {field.description && <p className="-mt-1 mb-3 text-xs text-milk/50">{field.description}</p>}
      {control_}
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-sm text-rose-600">
          {error}
        </p>
      )}
    </motion.div>
  );
}
