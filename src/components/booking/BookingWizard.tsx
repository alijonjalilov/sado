"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch, type FieldValues } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, ChevronDown, LoaderCircle, PencilLine, RotateCcw, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { site } from "@/content/site";
import {
  addDaysIso,
  stepIndexOfField,
  todayIso,
  validateStep,
  visibleFields,
  visibleSteps,
  type ValidationContext,
} from "@/lib/questionnaire/logic";
import { buildSummary } from "@/lib/questionnaire/summary";
import type { Answers, EventTypeId } from "@/lib/questionnaire/types";
import { cn } from "@/lib/utils";
import { FieldRenderer } from "./Fields";

const DRAFT_KEY = "vedushiy:booking-draft:v1";
const DRAFT_TTL = 1000 * 60 * 60 * 24 * 14; // 14 дней

type Draft = { answers: Answers; stepIndex: number; maxReached: number; savedAt: number };
type Status = "idle" | "sending" | "success" | "error";

export function BookingWizard({ initialType, serverToday }: { initialType?: EventTypeId; serverToday: string }) {
  const form = useForm<FieldValues>({
    defaultValues: initialType ? { eventType: initialType } : {},
    shouldUnregister: false,
  });
  const { control, register, getValues, reset } = form;
  const answers = useWatch({ control }) as Answers;

  const [stepIndex, setStepIndex] = useState(initialType ? 1 : 0);
  const [maxReached, setMaxReached] = useState(initialType ? 1 : 0);
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState("");
  const [restored, setRestored] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const hydrated = useRef(false);
  const honeypot = useRef<HTMLInputElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  // Минимальная дата — сегодня по часам пользователя (но не раньше «вчера» по серверу)
  const ctx = useMemo<ValidationContext>(() => {
    const local = todayIso();
    const min = local < addDaysIso(serverToday, -1) ? serverToday : local;
    return { minDate: min, maxDate: addDaysIso(min, 365 * 5) };
  }, [serverToday]);

  const steps = useMemo(() => visibleSteps(answers), [answers]);
  const idx = Math.min(stepIndex, steps.length - 1);
  const step = steps[idx]!;
  const isLast = idx === steps.length - 1;
  const progress = Math.round(((idx + 1) / steps.length) * 100);

  // ── Восстановление черновика ──
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw) as Draft;
        const fresh = d && d.answers && Date.now() - d.savedAt < DRAFT_TTL;
        const sameType = !initialType || d.answers.eventType === initialType;
        if (fresh && sameType && Object.keys(d.answers).length > 1) {
          reset(d.answers);
          setStepIndex(d.stepIndex);
          setMaxReached(Math.max(d.maxReached, d.stepIndex));
          setRestored(true);
        }
      }
    } catch {
      /* повреждённый черновик игнорируем */
    }
    hydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Автосохранение черновика ──
  useEffect(() => {
    if (!hydrated.current || status === "success") return;
    try {
      const draft: Draft = { answers: getValues() as Answers, stepIndex: idx, maxReached, savedAt: Date.now() };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      /* приватный режим — без черновика */
    }
  }, [answers, idx, maxReached, status, getValues]);

  function scrollTop() {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function goTo(i: number) {
    if (i < 0 || i > maxReached || i >= steps.length) return;
    setDirection(i > idx ? 1 : -1);
    setErrors({});
    setStepIndex(i);
    scrollTop();
  }

  function goBack() {
    if (idx === 0) return;
    setDirection(-1);
    setErrors({});
    setStepIndex(idx - 1);
    scrollTop();
  }

  function goNext() {
    const values = getValues() as Answers;
    const current = visibleSteps(values)[Math.min(stepIndex, visibleSteps(values).length - 1)]!;
    const errs = validateStep(current, values, ctx);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      requestAnimationFrame(() => document.getElementById(`f-${first}`)?.focus());
      return;
    }
    if (isLast) {
      void submit();
      return;
    }
    const next = idx + 1;
    setDirection(1);
    setStepIndex(next);
    setMaxReached((m) => Math.max(m, next));
    scrollTop();
  }

  const goNextRef = useRef(goNext);
  goNextRef.current = goNext;

  function onPicked(fieldId: string, value: string) {
    if (fieldId === "eventType" && value !== answers.eventType) setMaxReached(0);
    if (step.autoAdvance) setTimeout(() => goNextRef.current(), 280);
  }

  async function submit() {
    setStatus("sending");
    setSubmitError("");
    const values = getValues() as Answers;
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: values, website: honeypot.current?.value ?? "" }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; errors?: Record<string, string> };
      if (res.status === 422 && data.errors && Object.keys(data.errors).length) {
        const first = Object.keys(data.errors)[0]!;
        const si = stepIndexOfField(values, first);
        setErrors(data.errors);
        if (si >= 0) {
          setDirection(-1);
          setStepIndex(si);
        }
        setSubmitError("Проверьте, пожалуйста, отмеченные поля.");
        setStatus("error");
        return;
      }
      if (!res.ok) throw new Error(data.error ?? "Не удалось отправить заявку. Попробуйте ещё раз.");
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {}
      setStatus("success");
      scrollTop();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Ошибка сети. Проверьте подключение и попробуйте снова.");
      setStatus("error");
    }
  }

  function restart() {
    reset({});
    setErrors({});
    setStepIndex(0);
    setMaxReached(0);
    setRestored(false);
    setStatus("idle");
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}
  }

  const fields = visibleFields(step, answers);
  const summary = useMemo(() => (isLast ? buildSummary(answers).filter((s) => s.stepId !== "contacts") : []), [isLast, answers]);

  return (
    <div className="relative min-h-dvh bg-ink lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {/* ── Левая панель (десктоп) ── */}
      <aside className="relative isolate hidden overflow-hidden lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:justify-between lg:p-12">
        <Image src={site.hero.image} alt="" fill priority sizes="40vw" className="-z-10 object-cover opacity-70" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-ink/80 via-ink/50 to-ink" />
        <Logo />
        <div>
          <span className="eyebrow">Конструктор заявки</span>
          <h1 className="mt-6 font-serif text-6xl font-medium leading-[1.02] xl:text-7xl">
            Давайте создадим <em className="text-gold-gradient">ваше мероприятие</em>
          </h1>
          <p className="mt-6 max-w-md text-lg text-milk/60">Ответьте на несколько вопросов, чтобы мы могли предложить вам подходящий формат проведения.</p>
        </div>
        <ol className="space-y-1.5" aria-label="Шаги">
          {steps.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => goTo(i)}
                disabled={i > maxReached || status === "success"}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg py-1 text-left text-sm transition disabled:cursor-default",
                  i === idx ? "text-gold-light" : i <= maxReached ? "text-milk/70 hover:text-milk" : "text-milk/25",
                )}
              >
                <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[11px] tabular-nums", i === idx ? "border-gold bg-gold text-ink" : i < idx || i <= maxReached ? "border-gold/50" : "border-milk/15")}>
                  {i < idx ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                <span className="truncate">{s.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </aside>

      {/* ── Форма ── */}
      <main className="flex min-h-dvh flex-col">
        <div ref={topRef} className="sticky top-0 z-20 border-b border-milk/5 bg-ink/85 backdrop-blur-xl">
          <div className="flex items-center justify-between px-5 py-4 md:px-10">
            <div className="lg:hidden">
              <Logo />
            </div>
            <p className="hidden text-sm text-milk/50 lg:block">{status === "success" ? "Заявка отправлена" : `Шаг ${idx + 1} из ${steps.length}`}</p>
            <div className="flex items-center gap-2">
              {status !== "success" && maxReached > 0 && (
                <button type="button" onClick={restart} className="btn-ghost hidden text-xs sm:inline-flex" title="Начать заново">
                  <RotateCcw className="h-3.5 w-3.5" /> Заново
                </button>
              )}
              <Link href="/" className="grid h-10 w-10 place-items-center rounded-full border border-milk/15 text-milk/70 transition hover:border-gold hover:text-milk" aria-label="Закрыть и вернуться на сайт">
                <X className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="h-[3px] w-full bg-milk/5">
            <motion.div className="h-full bg-gold-gradient" initial={false} animate={{ width: status === "success" ? "100%" : `${progress}%` }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} />
          </div>
        </div>

        <div className="flex flex-1 flex-col px-5 pb-36 pt-8 md:px-10 md:pt-14 lg:pb-16 xl:px-20">
          {status === "success" ? (
            <SuccessScreen />
          ) : (
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                goNext();
              }}
              className="mx-auto flex w-full max-w-3xl flex-1 flex-col"
            >
              <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

              {idx === 0 && (
                <div className="mb-10 lg:hidden">
                  <span className="eyebrow">Конструктор заявки</span>
                  <p className="mt-4 font-serif text-4xl leading-tight">
                    Давайте создадим <em className="text-gold-gradient">ваше мероприятие</em>
                  </p>
                  <p className="mt-3 text-milk/60">Ответьте на несколько вопросов, чтобы мы могли предложить вам подходящий формат проведения.</p>
                </div>
              )}

              {restored && idx > 0 && (
                <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold/25 bg-gold/5 px-5 py-3 text-sm text-milk/80">
                  Мы сохранили ваши ответы с прошлого визита.
                  <button type="button" onClick={restart} className="font-semibold text-gold hover:text-gold-light">
                    Начать заново
                  </button>
                </div>
              )}

              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.section
                  key={step.id}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -40 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  aria-labelledby="step-title"
                >
                  <p className="text-xs font-semibold uppercase tracking-luxe text-gold lg:hidden">
                    Шаг {idx + 1} из {steps.length}
                  </p>
                  <h2 id="step-title" className="mt-3 text-3xl font-medium leading-tight text-milk sm:text-4xl md:text-5xl lg:mt-0">
                    {step.title}
                  </h2>
                  {step.subtitle && <p className="mt-4 text-milk/60 md:text-lg">{step.subtitle}</p>}

                  <div className="mt-10 grid gap-x-5 gap-y-7 sm:grid-cols-2">
                    <AnimatePresence initial={false}>
                      {fields.map((f) => (
                        <FieldRenderer
                          key={f.id}
                          field={f}
                          control={control}
                          register={register}
                          error={errors[f.id]}
                          ctx={ctx}
                          onPicked={(v) => onPicked(f.id, v)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>

                  {isLast && summary.length > 0 && (
                    <div className="mt-12 rounded-2xl border border-milk/10">
                      <button type="button" onClick={() => setSummaryOpen((v) => !v)} className="flex w-full items-center justify-between px-5 py-4 text-left" aria-expanded={summaryOpen}>
                        <span className="font-semibold text-milk">Проверьте ваши ответы</span>
                        <ChevronDown className={cn("h-5 w-5 text-gold transition", summaryOpen && "rotate-180")} />
                      </button>
                      <AnimatePresence initial={false}>
                        {summaryOpen && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="space-y-5 border-t border-milk/10 px-5 py-5">
                              {summary.map((s) => (
                                <div key={s.stepId}>
                                  <div className="flex items-start justify-between gap-4">
                                    <p className="text-sm font-semibold text-gold-light">{s.title}</p>
                                    <button type="button" onClick={() => goTo(steps.findIndex((x) => x.id === s.stepId))} className="inline-flex shrink-0 items-center gap-1 text-xs text-milk/50 hover:text-gold">
                                      <PencilLine className="h-3.5 w-3.5" /> Изменить
                                    </button>
                                  </div>
                                  <dl className="mt-2 space-y-1 text-sm">
                                    {s.items.map((it) => (
                                      <div key={it.fieldId} className="flex flex-col sm:flex-row sm:gap-2">
                                        <dt className="text-milk/45">{it.label}:</dt>
                                        <dd className="text-milk/85">{it.value}</dd>
                                      </div>
                                    ))}
                                  </dl>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.section>
              </AnimatePresence>

              {submitError && (
                <p role="alert" className="mt-8 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
                  {submitError}
                </p>
              )}

              {/* ── Навигация ── */}
              <div className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-milk/10 bg-ink/90 px-5 pt-3 backdrop-blur-xl lg:static lg:mt-14 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
                <div className="mx-auto flex max-w-3xl items-center gap-3">
                  <button type="button" onClick={goBack} disabled={idx === 0 || status === "sending"} className="btn-outline px-5 disabled:opacity-30" aria-label="Назад">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Назад</span>
                  </button>
                  {!(step.autoAdvance && idx === 0 && !answers.eventType) && (
                    <button type="submit" disabled={status === "sending"} className="btn-gold flex-1 py-4 sm:flex-none sm:px-10">
                      {status === "sending" ? (
                        <>
                          <LoaderCircle className="h-4 w-4 animate-spin" /> Отправляем…
                        </>
                      ) : isLast ? (
                        <>
                          Отправить заявку <Check className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Продолжить <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
                {isLast && <p className="mx-auto mt-3 hidden max-w-3xl text-xs text-milk/40 lg:block">Нажимая «Отправить заявку», вы соглашаетесь на обработку контактных данных для связи по вашему мероприятию.</p>}
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

function SuccessScreen() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center py-10 text-center">
      <motion.span
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.15 }}
        className="grid h-24 w-24 place-items-center rounded-full bg-gold-gradient text-ink shadow-gold"
      >
        <Check className="h-11 w-11" strokeWidth={2.5} />
      </motion.span>
      <h2 className="mt-10 text-5xl font-medium md:text-6xl">Спасибо за доверие!</h2>
      <p className="mt-6 text-lg leading-relaxed text-milk/70">
        Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время, чтобы обсудить детали вашего мероприятия.
      </p>
      <Link href="/" className="btn-gold mt-12 px-10 py-4">
        Вернуться на главную
      </Link>
    </motion.div>
  );
}
