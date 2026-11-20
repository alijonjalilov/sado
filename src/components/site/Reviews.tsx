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
    <section id="reviews" className="section scroll-mt-24">
      <div className="container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Отзывы" title="Что говорят после праздника" />
          <Reveal>
            <button type="button" onClick={() => setFormOpen(true)} className="btn-outline">
              <MessageSquareQuote className="h-4 w-4" /> Оставить отзыв
            </button>
          </Reveal>
        </div>

        {reviews.length > 0 ? (
          <div className="mt-12 columns-1 gap-4 md:columns-2 lg:columns-3 [&>*]:mb-4">
            {reviews.map((r, i) => (
              <Reveal key={r.id} delay={0.04 * (i % 3)} className="break-inside-avoid">
                <article className="rounded-card border border-line bg-white p-7 shadow-card">
                  <div className="flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-blush-soft text-gold">
                      <Quote className="h-5 w-5" />
                    </span>
                    <div className="flex gap-0.5" aria-label={`Оценка ${r.rating} из 5`}>
                      {Array.from({ length: 5 }).map((_, k) => (
                        <Star key={k} className={cn("h-4 w-4", k < r.rating ? "fill-champagne text-champagne" : "text-line-strong")} />
                      ))}
                    </div>
                  </div>
                  <p className="mt-5 whitespace-pre-line leading-relaxed text-milk/75">{r.text}</p>
                  <footer className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                    {r.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.photoUrl} alt={r.authorName} className="h-11 w-11 rounded-full object-cover" loading="lazy" />
                    ) : (
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-gold text-lg font-black text-white">{r.authorName.charAt(0).toUpperCase()}</span>
                    )}
                    <div>
                      <p className="font-extrabold text-milk">{r.authorName}</p>
                      {r.eventLabel && <p className="text-sm text-milk/50">{r.eventLabel}</p>}
                    </div>
                  </footer>
                </article>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal className="mt-12">
            <div className="flex flex-col items-center gap-6 rounded-panel bg-blush px-6 py-16 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-gold shadow-card">
                <Quote className="h-6 w-6" />
              </span>
              <p className="max-w-2xl text-2xl font-extrabold leading-snug text-milk md:text-3xl">
                Были на моём мероприятии? Поделитесь впечатлениями — ваш отзыв появится здесь первым.
              </p>
              <button type="button" onClick={() => setFormOpen(true)} className="btn-gold h-12 px-8">
                Написать отзыв
              </button>
            </div>
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
        <motion.div className="fixed inset-0 z-[80] grid place-items-center bg-deep/50 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}>
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Оставить отзыв"
            className="relative max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-panel bg-white p-7 shadow-float md:p-9"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={close} className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-ink text-milk/60 hover:text-milk" aria-label="Закрыть">
              <X className="h-4 w-4" />
            </button>
            {state === "done" ? (
              <div className="py-8 text-center">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold text-white shadow-gold">
                  <Check className="h-8 w-8" />
                </span>
                <p className="mt-6 text-3xl font-black italic">Спасибо!</p>
                <p className="mt-2 text-milk/60">Отзыв появится на сайте после модерации.</p>
                <button onClick={close} className="btn-outline mt-8">
                  Закрыть
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <p className="text-2xl font-black italic">Ваш отзыв</p>
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
                        <Star className={cn("h-7 w-7 transition", n <= rating ? "fill-champagne text-champagne" : "text-line-strong")} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="rv-text">Отзыв</label>
                  <textarea id="rv-text" name="text" required minLength={10} maxLength={2000} rows={5} className="input resize-none" />
                </div>
                {state === "error" && <p className="text-sm font-semibold text-rose-600">{error}</p>}
                <button type="submit" disabled={state === "sending"} className="btn-gold h-12 w-full">
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
