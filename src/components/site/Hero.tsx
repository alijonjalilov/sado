"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, Play } from "lucide-react";
import { site } from "@/content/site";
import { VideoModal } from "./VideoModal";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const [videoOpen, setVideoOpen] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 160]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0.2]);

  return (
    <section className="grain relative isolate flex min-h-[100svh] items-end overflow-hidden pb-20 pt-32 md:items-center md:pb-0">
      <motion.div style={{ y }} className="absolute inset-0 -z-10">
        <Image src={site.hero.image} alt="" fill priority sizes="100vw" className="object-cover" />
        {site.hero.video && (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={site.hero.video}
            poster={site.hero.image}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        )}
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/60 via-ink/40 to-ink" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_left,rgba(11,11,12,0.85),transparent_60%)]" />

      <motion.div style={{ opacity }} className="container">
        <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} className="eyebrow">
          {site.role} · {site.city}
        </motion.span>

        <h1 className="mt-6 max-w-5xl font-serif text-[2.6rem] font-medium leading-[1.02] text-milk sm:text-6xl md:text-7xl lg:text-[5.5rem]">
          {site.hero.titleLines.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-1">
              <motion.span
                className={i === site.hero.titleLines.length - 1 ? "block italic text-gold-gradient" : "block"}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.15 + i * 0.15, ease }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease }}
          className="mt-8 max-w-2xl text-base leading-relaxed text-milk/70 md:text-lg"
        >
          {site.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9, ease }}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Link href="/booking" className="btn-gold group px-8 py-4">
            Забронировать дату
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
          <button type="button" onClick={() => setVideoOpen(true)} className="btn-outline group px-8 py-4">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-gold/15 text-gold transition group-hover:bg-gold group-hover:text-ink">
              <Play className="h-3.5 w-3.5 fill-current" />
            </span>
            Смотреть видео
          </button>
        </motion.div>
      </motion.div>

      <a href="#about" aria-label="Листать вниз" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-milk/40 transition hover:text-gold md:block">
        <ChevronDown className="h-6 w-6 animate-float" />
      </a>

      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} videos={site.portfolio.videos} />
    </section>
  );
}
