"use client";

import Image from "next/image";
import { useCallback, useEffect } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type LightboxImage = { src: string; alt: string };

export function Lightbox({
  images,
  index,
  onClose,
  onChange,
}: {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onChange: (i: number) => void;
}) {
  const open = index !== null;
  const prev = useCallback(() => index !== null && onChange((index - 1 + images.length) % images.length), [index, images.length, onChange]);
  const next = useCallback(() => index !== null && onChange((index + 1) % images.length), [index, images.length, onChange]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, prev, next]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 80) prev();
    else if (info.offset.x < -80) next();
  };

  const img = index !== null ? images[index] : undefined;

  return (
    <AnimatePresence>
      {open && img && (
        <motion.div
          className="fixed inset-0 z-[90] flex flex-col bg-[#160b11]/95 text-white backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр фотографии"
        >
          <div className="flex items-center justify-between px-5 py-4 md:px-8">
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold tabular-nums">
              {(index ?? 0) + 1} / {images.length}
            </span>
            <button onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 transition hover:bg-white hover:text-gold" aria-label="Закрыть">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative flex-1">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={img.src}
                className="absolute inset-0 cursor-grab px-4 active:cursor-grabbing md:px-24"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={onDragEnd}
              >
                <div className="relative h-full w-full">
                  <Image src={img.src} alt={img.alt} fill sizes="100vw" className="pointer-events-none select-none object-contain" priority />
                </div>
              </motion.div>
            </AnimatePresence>

            <button onClick={prev} className="absolute left-3 top-1/2 hidden h-14 w-14 -translate-y-1/2 place-items-center rounded-full bg-white/10 transition hover:bg-white hover:text-gold md:grid" aria-label="Предыдущее фото">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 hidden h-14 w-14 -translate-y-1/2 place-items-center rounded-full bg-white/10 transition hover:bg-white hover:text-gold md:grid" aria-label="Следующее фото">
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          <p className="px-5 py-5 text-center text-sm text-white/60">{img.alt}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
