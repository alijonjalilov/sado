"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { site, phoneLink } from "@/content/site";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/#about", label: "Обо мне" },
  { href: "/#events", label: "Мероприятия" },
  { href: "/#portfolio", label: "Портфолио" },
  { href: "/#why", label: "Почему я" },
  { href: "/#reviews", label: "Отзывы" },
  { href: "/#contacts", label: "Контакты" },
];

export function Header({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
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

  const filled = solid || scrolled;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          filled ? "border-b border-milk/5 bg-ink/80 py-3 backdrop-blur-xl" : "py-6",
        )}
      >
        <div className="container flex items-center justify-between gap-6">
          <Logo />
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Основное меню">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="text-sm text-milk/70 transition hover:text-gold-light">
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/booking" className="btn-gold hidden px-6 py-3 sm:inline-flex">
              Забронировать дату
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="grid h-11 w-11 place-items-center rounded-full border border-milk/15 text-milk transition hover:border-gold lg:hidden"
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
            className="fixed inset-0 z-[60] flex flex-col bg-ink/95 backdrop-blur-2xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container flex items-center justify-between py-6">
              <Logo />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-full border border-milk/15"
                aria-label="Закрыть меню"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="container flex flex-1 flex-col justify-center gap-2" aria-label="Мобильное меню">
              {NAV.map((n, i) => (
                <motion.div key={n.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i + 0.1 }}>
                  <Link href={n.href} onClick={() => setOpen(false)} className="block py-2 font-serif text-4xl text-milk transition hover:text-gold-light">
                    {n.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="container safe-bottom flex flex-col gap-3 pb-8">
              <Link href="/booking" onClick={() => setOpen(false)} className="btn-gold w-full">
                Забронировать дату
              </Link>
              <a href={phoneLink()} className="btn-outline w-full">
                {site.contacts.phone}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
