"use client";

import Image from "next/image";
import { useState } from "react";
import { Camera, Expand, Play, Video } from "lucide-react";
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
    <section id="portfolio" className="section scroll-mt-24">
      <div className="container">
        <div className="rounded-panel border border-line bg-white p-5 shadow-card md:p-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="Портфолио" title="Моменты, ради которых всё и затевается" />
            <Reveal>
              <div className="inline-flex rounded-full bg-ink p-1" role="tablist">
                {(["photo", "video"] as const).map((t) => (
                  <button
                    key={t}
                    role="tab"
                    aria-selected={tab === t}
                    onClick={() => setTab(t)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-extrabold transition-all duration-300 ease-spring",
                      tab === t ? "bg-gold text-white shadow-gold" : "text-milk/60 hover:text-milk",
                    )}
                  >
                    {t === "photo" ? <Camera className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                    {t === "photo" ? `Фото · ${photos.length}` : `Видео · ${videos.length}`}
                  </button>
                ))}
              </div>
            </Reveal>
          </div>

          {tab === "photo" ? (
            <div className="mt-10 grid auto-rows-[170px] grid-cols-2 gap-3 md:auto-rows-[220px] md:grid-cols-4">
              {photos.map((p, i) => (
                <Reveal key={p.src} delay={0.03 * (i % 4)} className={cn(p.span === "tall" && "row-span-2", p.span === "wide" && "col-span-2")}>
                  <button
                    type="button"
                    onClick={() => setPhotoIndex(i)}
                    className="group relative block h-full w-full overflow-hidden rounded-2xl bg-ink"
                    aria-label={`Открыть фото: ${p.alt}`}
                  >
                    <Image src={p.src} alt={p.alt} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition duration-700 group-hover:scale-105" />
                    <span className="absolute inset-0 bg-deep/0 transition group-hover:bg-deep/35" />
                    <span className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-full bg-white/90 px-3 py-1.5 text-left text-xs font-bold text-milk opacity-0 backdrop-blur transition group-hover:opacity-100">
                      <span className="truncate">{p.alt}</span>
                      <Expand className="h-3.5 w-3.5 shrink-0 text-gold" />
                    </span>
                  </button>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {videos.map((v, i) => (
                <Reveal key={v.title} delay={0.05 * i}>
                  <button type="button" onClick={() => setVideoIndex(i)} className="group relative block aspect-video w-full overflow-hidden rounded-card bg-deep text-left">
                    <Image src={v.poster} alt={v.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition duration-700 group-hover:scale-105" />
                    <span className="absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/10 to-transparent" />
                    <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-gold shadow-float transition duration-300 ease-spring group-hover:scale-110">
                      <Play className="ml-1 h-6 w-6 fill-current" />
                    </span>
                    <span className="absolute bottom-5 left-5 right-5 text-xl font-black italic text-white md:text-2xl">{v.title}</span>
                  </button>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>

      <Lightbox images={photos} index={photoIndex} onClose={() => setPhotoIndex(null)} onChange={setPhotoIndex} />
      <VideoModal open={videoIndex !== null} onClose={() => setVideoIndex(null)} videos={videos} startIndex={videoIndex ?? 0} />
    </section>
  );
}
