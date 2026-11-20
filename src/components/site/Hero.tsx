"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Languages, MapPin, Play, Sparkles } from "lucide-react";
import { Marquee } from "@/components/ui/Marquee";
import { site } from "@/content/site";
import { VideoModal } from "./VideoModal";

const ease = [0.22, 1, 0.36, 1] as const;

const STRIP = ["Свадьбы", "Юбилеи", "Корпоративы", "Дни рождения", "Выпускные", "Концерты", "Помолвки", "Презентации"];

export function Hero() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section className="px-3 pt-3 md:px-5 md:pt-4">
      {/* Тёмная скруглённая панель первого экрана */}
      <div className="grain relative isolate mx-auto flex min-h-[92svh] max-w-[1400px] items-end overflow-hidden rounded-b-panel rounded-t-[28px] bg-deep-gradient pb-24 pt-32 text-white md:min-h-[88svh] md:items-center md:pb-28">
        <Image src={site.hero.image} alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-40 mix-blend-luminosity" />
        {site.hero.video && (
          <video
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-50"
            src={site.hero.video}
            poster={site.hero.image}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-deep via-deep/70 to-gold/30" />
        <div className="absolute -right-32 -top-32 -z-10 h-[460px] w-[460px] rounded-full bg-gold/40 blur-[120px]" />

        <div className="container grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur-md"
            >
              <span className="h-2 w-2 rounded-full bg-champagne" />
              {site.role} · {site.city}
            </motion.span>

            <h1 className="mt-6 text-[2.55rem] font-black uppercase italic leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-[5.2rem]">
              {site.hero.titleLines.map((line, i) => (
                <span key={line} className="block overflow-hidden pb-1">
                  <motion.span
                    className={i === site.hero.titleLines.length - 1 ? "block text-champagne-gradient" : "block"}
                    initial={{ y: "105%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease }}
              className="mt-7 max-w-xl text-base leading-relaxed text-white/75 md:text-lg"
            >
              {site.hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease }}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Link href="/booking" className="btn-light group h-14 px-8">
                Забронировать дату
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <button type="button" onClick={() => setVideoOpen(true)} className="btn-glass group h-14 px-7">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-gold transition group-hover:scale-110">
                  <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
                </span>
                Смотреть видео
              </button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-8 flex items-center gap-2 text-sm text-white/60"
            >
              <MapPin className="h-4 w-4" /> {site.city} и выезд по Таджикистану
            </motion.p>
          </div>

          {/* Стеклянная карточка, как у плашки «призовой фонд» */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8, ease }}
            className="hidden rounded-card border border-white/15 bg-white/10 p-6 backdrop-blur-md lg:col-span-4 lg:block"
          >
            <p className="text-[11px] font-extrabold uppercase tracking-luxe text-champagne-light">Ведение на языках</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Таджикский", "Русский", "English"].map((l) => (
                <span key={l} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
                  <Languages className="h-4 w-4 text-champagne-light" />
                  {l}
                </span>
              ))}
            </div>
            <div className="mt-6 border-t border-white/15 pt-5">
              <p className="flex items-center gap-2 text-sm font-bold">
                <Sparkles className="h-4 w-4 text-champagne-light" /> Индивидуальный сценарий
              </p>
              <p className="mt-1 text-sm text-white/60">под вашу историю, гостей и формат</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Бегущая строка с форматами */}
      <div className="mx-auto -mt-8 max-w-[1360px] px-2 md:-mt-10">
        <div className="relative z-10 -rotate-1 rounded-full bg-gold py-4 shadow-gold">
          <Marquee items={STRIP} className="mask-fade-x" itemClassName="text-lg font-black uppercase italic tracking-tight text-white md:text-2xl" />
        </div>
      </div>

      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} videos={site.portfolio.videos} />
    </section>
  );
}
