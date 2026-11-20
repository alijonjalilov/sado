"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { phoneLink, site } from "@/content/site";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/#about", label: "Обо мне" },
  { href: "/#events", label: "Мероприятия" },
  { href: "/#portfolio", label: "Портфолио" },
  { href: "/#why", label: "Почему я" },
  { href: "/#reviews", label: "Отзывы" },
  { href: "/#contacts", label: "Контакты" },
];

/** Плавающая белая шапка-«пилюля». */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-4">
        <div
          className={cn(
            "mx-auto flex max-w-[1320px] items-center justify-between gap-4 rounded-full border bg-white/90 py-2 pl-3 pr-2 backdrop-blur-xl transition-all duration-500 md:pl-4",
            scrolled ? "border-line shadow-float" : "border-white/60 shadow-card",
          )}
        >
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Основное меню">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-full px-4 py-2 text-sm font-bold text-milk/75 transition-all duration-300 ease-spring hover:bg-ink hover:text-gold"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/booking" className="btn-gold hidden h-11 px-5 sm:inline-flex">
              <CalendarCheck className="h-4 w-4" />
              Забронировать дату
            </Link>
            <Link href="/booking" className="btn-gold h-10 w-10 p-0 sm:hidden" aria-label="Забронировать дату">
              <CalendarCheck className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full bg-ink text-milk transition hover:text-gold lg:hidden"
              aria-label="Открыть меню"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-ink lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center justify-between px-5 py-5">
              <Logo />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-full bg-white shadow-card"
                aria-label="Закрыть меню"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-1 px-5" aria-label="Мобильное меню">
              {NAV.map((n, i) => (
                <motion.div key={n.href} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i + 0.05 }}>
                  <Link href={n.href} onClick={() => setOpen(false)} className="block py-2 text-4xl font-black italic uppercase tracking-tight text-milk transition hover:text-gold">
                    {n.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="safe-bottom flex flex-col gap-3 px-5 pb-6">
              <Link href="/booking" onClick={() => setOpen(false)} className="btn-gold w-full py-4">
                Забронировать дату
              </Link>
              <a href={phoneLink()} className="btn-outline w-full py-4">
                <Phone className="h-4 w-4" /> {site.contacts.phone}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
