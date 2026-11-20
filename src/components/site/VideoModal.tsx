"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, X } from "lucide-react";
import type { SiteVideo } from "@/content/site";
import { cn } from "@/lib/utils";

/** Полноэкранная видеогалерея: плеер + список роликов. */
export function VideoModal({
  open,
  onClose,
  videos,
  startIndex = 0,
}: {
  open: boolean;
  onClose: () => void;
  videos: SiteVideo[];
  startIndex?: number;
}) {
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    if (open) setIndex(startIndex);
  }, [open, startIndex]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const current = videos[index];

  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          className="fixed inset-0 z-[80] flex flex-col bg-[#160b11]/95 text-white backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Видеогалерея"
        >
          <div className="container flex items-center justify-between py-5">
            <p className="text-[11px] font-extrabold uppercase tracking-luxe text-champagne-light">Видео</p>
            <button onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 transition hover:bg-white hover:text-gold" aria-label="Закрыть">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="container flex flex-1 flex-col gap-6 overflow-y-auto pb-8">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative mx-auto aspect-video w-full max-w-5xl overflow-hidden rounded-card bg-black"
            >
              {current.youtubeId ? (
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${current.youtubeId}?autoplay=1&rel=0`}
                  title={current.title}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              ) : current.src ? (
                <video className="absolute inset-0 h-full w-full" src={current.src} poster={current.poster} controls autoPlay playsInline />
              ) : (
                <>
                  <Image src={current.poster} alt={current.title} fill sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover opacity-60" />
                  <div className="absolute inset-0 grid place-items-center p-6 text-center">
                    <div>
                      <p className="text-2xl font-black italic md:text-3xl">{current.title}</p>
                      <p className="mt-2 text-sm text-white/60">Видео скоро появится здесь</p>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
            <p className="mx-auto w-full max-w-5xl text-xl font-black italic">{current.title}</p>

            {videos.length > 1 && (
              <div className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-3 md:grid-cols-4">
                {videos.map((v, i) => (
                  <button
                    key={v.title + i}
                    onClick={() => setIndex(i)}
                    className={cn(
                      "group relative aspect-video overflow-hidden rounded-2xl text-left ring-2 transition",
                      i === index ? "ring-champagne" : "ring-transparent hover:ring-white/30",
                    )}
                  >
                    <Image src={v.poster} alt="" fill sizes="25vw" className="object-cover transition duration-500 group-hover:scale-105" />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <Play className="absolute left-3 top-3 h-4 w-4 fill-white text-white" />
                    <span className="absolute bottom-2 left-3 right-3 line-clamp-2 text-xs font-bold text-white">{v.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
