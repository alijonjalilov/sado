"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Phone, X } from "lucide-react";
import { TelegramIcon, WhatsAppIcon } from "@/components/ui/SocialIcons";
import { phoneLink, telegramLink, whatsappLink } from "@/content/site";

/** Кнопка быстрой связи (справа внизу) + липкая кнопка заявки на мобильных. */
export function FloatingContact() {
  const [open, setOpen] = useState(false);
  const actions = [
    { label: "WhatsApp", href: whatsappLink("Здравствуйте! Хочу узнать о свободных датах."), icon: <WhatsAppIcon className="h-5 w-5" />, color: "bg-[#25D366] text-white" },
    { label: "Telegram", href: telegramLink(), icon: <TelegramIcon className="h-5 w-5" />, color: "bg-[#2AABEE] text-white" },
    { label: "Позвонить", href: phoneLink(), icon: <Phone className="h-5 w-5" />, color: "bg-white text-gold" },
  ];

  return (
    <>
      <div className="fixed bottom-24 right-4 z-40 flex flex-col items-end gap-3 md:bottom-8 md:right-8">
        <AnimatePresence>
          {open &&
            actions.map((a, i) => (
              <motion.a
                key={a.label}
                href={a.href}
                target={a.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: 0.04 * (actions.length - i) } }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="flex items-center gap-3"
              >
                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-milk shadow-card">{a.label}</span>
                <span className={`grid h-12 w-12 place-items-center rounded-full shadow-float ${a.color}`}>{a.icon}</span>
              </motion.a>
            ))}
        </AnimatePresence>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Закрыть быстрые контакты" : "Быстро связаться"}
          aria-expanded={open}
          className="grid h-14 w-14 place-items-center rounded-full bg-gold text-white shadow-gold transition duration-300 ease-spring hover:scale-105"
        >
          {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </button>
      </div>

      <div className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/90 px-4 pt-3 backdrop-blur-xl md:hidden">
        <Link href="/booking" className="btn-gold h-12 w-full">
          Забронировать дату
        </Link>
      </div>
    </>
  );
}
