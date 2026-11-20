"use client";

import Image from "next/image";
import { useState } from "react";
import { Expand, Play } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Lightbox } from "./Lightbox";
import { VideoModal } from "./VideoModal";

type Tab = "photo" | "video";

export function Portfolio() {
  const [tab, setTab] = useState<Tab>("photo");
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);
  const [videoIndex, setVideoIndex] = useState<number | null>(null);
  const { photos, videos } = site.portfolio;

  return (
    <section id="portfolio" className="section">
      <div className="container">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading eyebrow="Портфолио" title="Моменты, ради которых всё и затевается" />
          <Reveal>
            <div className="inline-flex rounded-full border border-milk/15 p-1" role="tablist">
              {(["photo", "video"] as const).map((t) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={cn("rounded-full px-6 py-2.5 text-sm font-semibold transition", tab === t ? "bg-gold text-ink" : "text-milk/70 hover:text-milk")}
                >
                  {t === "photo" ? `Фото · ${photos.length}` : `Видео · ${videos.length}`}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        {tab === "photo" ? (
          <div className="mt-14 grid auto-rows-[180px] grid-cols-2 gap-3 md:auto-rows-[240px] md:grid-cols-4 md:gap-4">
            {photos.map((p, i) => (
              <Reveal
                key={p.src}
                delay={0.04 * (i % 4)}
                className={cn(p.span === "tall" && "row-span-2", p.span === "wide" && "col-span-2")}
              >
                <button
                  type="button"
                  onClick={() => setPhotoIndex(i)}
                  className="group relative block h-full w-full overflow-hidden rounded-2xl"
                  aria-label={`Открыть фото: ${p.alt}`}
                >
                  <Image src={p.src} alt={p.alt} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition duration-700 group-hover:scale-105" />
                  <span className="absolute inset-0 bg-ink/0 transition group-hover:bg-ink/40" />
                  <span className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-left text-xs text-milk opacity-0 transition group-hover:opacity-100 md:text-sm">
                    {p.alt}
                    <Expand className="h-4 w-4 text-gold" />
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {videos.map((v, i) => (
              <Reveal key={v.title} delay={0.05 * i}>
                <button type="button" onClick={() => setVideoIndex(i)} className="group relative block aspect-video w-full overflow-hidden rounded-3xl border border-milk/10 text-left">
                  <Image src={v.poster} alt={v.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition duration-700 group-hover:scale-105" />
                  <span className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
                  <span className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gold/90 text-ink shadow-gold transition group-hover:scale-110">
                    <Play className="ml-1 h-7 w-7 fill-current" />
                  </span>
                  <span className="absolute bottom-6 left-6 font-serif text-2xl text-milk md:text-3xl">{v.title}</span>
                </button>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      <Lightbox images={photos} index={photoIndex} onClose={() => setPhotoIndex(null)} onChange={setPhotoIndex} />
      <VideoModal open={videoIndex !== null} onClose={() => setVideoIndex(null)} videos={videos} startIndex={videoIndex ?? 0} />
    </section>
  );
}
