"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, LoaderCircle, MessageSquareQuote, Quote, Star, X } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

export type PublicReview = {
  id: string;
  authorName: string;
  eventLabel: string | null;
  text: string;
  rating: number;
  photoUrl: string | null;
};

export function Reviews({ reviews }: { reviews: PublicReview[] }) {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <section id="reviews" className="section overflow-hidden">
      <div className="container">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading eyebrow="Отзывы" title="Что говорят после праздника" />
          <Reveal>
            <button type="button" onClick={() => setFormOpen(true)} className="btn-outline">
              <MessageSquareQuote className="h-4 w-4" /> Оставить отзыв
            </button>
          </Reveal>
        </div>

        {reviews.length > 0 ? (
          <div className="mt-14 columns-1 gap-5 md:columns-2 lg:columns-3 [&>*]:mb-5">
            {reviews.map((r, i) => (
              <Reveal key={r.id} delay={0.05 * (i % 3)} className="break-inside-avoid">
                <article className="card-glass p-7 md:p-8">
                  <div className="flex items-center justify-between">
                    <Quote className="h-8 w-8 text-gold/70" />
                    <div className="flex gap-0.5" aria-label={`Оценка ${r.rating} из 5`}>
                      {Array.from({ length: 5 }).map((_, k) => (
                        <Star key={k} className={cn("h-4 w-4", k < r.rating ? "fill-gold text-gold" : "text-milk/20")} />
                      ))}
                    </div>
                  </div>
                  <p className="mt-5 whitespace-pre-line leading-relaxed text-milk/80">{r.text}</p>
                  <footer className="mt-6 flex items-center gap-4 border-t border-milk/10 pt-5">
                    {r.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.photoUrl} alt={r.authorName} className="h-12 w-12 rounded-full object-cover" loading="lazy" />
                    ) : (
                      <span className="grid h-12 w-12 place-items-center rounded-full bg-gold/15 font-serif text-xl text-gold">{r.authorName.charAt(0).toUpperCase()}</span>
                    )}
                    <div>
                      <p className="font-semibold text-milk">{r.authorName}</p>
                      {r.eventLabel && <p className="text-sm text-milk/50">{r.eventLabel}</p>}
                    </div>
                  </footer>
                </article>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal className="card-glass mt-14 flex flex-col items-center gap-6 px-6 py-16 text-center">
            <Quote className="h-10 w-10 text-gold" />
            <p className="max-w-xl font-serif text-3xl leading-snug text-milk md:text-4xl">Были на моём мероприятии? Поделитесь впечатлениями — ваш отзыв появится здесь первым.</p>
            <button type="button" onClick={() => setFormOpen(true)} className="btn-gold">
              Написать отзыв
            </button>
          </Reveal>
        )}
      </div>

      <ReviewFormModal open={formOpen} onClose={() => setFormOpen(false)} />
    </section>
  );
}

function ReviewFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [rating, setRating] = useState(5);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: fd.get("authorName"),
          eventLabel: fd.get("eventLabel"),
          text: fd.get("text"),
          rating,
          website: fd.get("website"),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Не удалось отправить отзыв");
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка отправки");
      setState("error");
    }
  }

  function close() {
    onClose();
    setTimeout(() => setState("idle"), 300);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[80] grid place-items-center bg-ink/80 p-4 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}>
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Оставить отзыв"
            className="card-glass relative max-h-[90dvh] w-full max-w-lg overflow-y-auto bg-ink-800/95 p-7 md:p-9"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={close} className="absolute right-5 top-5 text-milk/50 hover:text-milk" aria-label="Закрыть">
              <X className="h-5 w-5" />
            </button>
            {state === "done" ? (
              <div className="py-8 text-center">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold text-ink">
                  <Check className="h-8 w-8" />
                </span>
                <p className="mt-6 font-serif text-3xl">Спасибо!</p>
                <p className="mt-2 text-milk/60">Отзыв появится на сайте после модерации.</p>
                <button onClick={close} className="btn-outline mt-8">
                  Закрыть
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <p className="font-serif text-3xl">Ваш отзыв</p>
                <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
                <div>
                  <label className="label" htmlFor="rv-name">Ваше имя</label>
                  <input id="rv-name" name="authorName" required maxLength={80} className="input" />
                </div>
                <div>
                  <label className="label" htmlFor="rv-event">Мероприятие</label>
                  <input id="rv-event" name="eventLabel" maxLength={80} placeholder="Например: свадьба, август 2026" className="input" />
                </div>
                <div>
                  <span className="label">Оценка</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button type="button" key={n} onClick={() => setRating(n)} aria-label={`${n} из 5`} className="p-1">
                        <Star className={cn("h-7 w-7 transition", n <= rating ? "fill-gold text-gold" : "text-milk/25")} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="rv-text">Отзыв</label>
                  <textarea id="rv-text" name="text" required minLength={10} maxLength={2000} rows={5} className="input resize-none" />
                </div>
                {state === "error" && <p className="text-sm text-rose-300">{error}</p>}
                <button type="submit" disabled={state === "sending"} className="btn-gold w-full">
                  {state === "sending" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                  Отправить отзыв
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
