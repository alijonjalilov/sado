import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Marquee } from "@/components/ui/Marquee";
import { InstagramIcon, TelegramIcon, WhatsAppIcon } from "@/components/ui/SocialIcons";
import { EVENT_CATEGORIES } from "@/content/events";
import { instagramLink, phoneLink, site, telegramLink, whatsappLink } from "@/content/site";

export function Footer() {
  return (
    <footer className="mt-10 overflow-hidden rounded-t-panel bg-deep pb-28 text-white md:pb-10">
      <div className="border-b border-white/10 py-6">
        <Marquee
          items={[site.brand, "Создаю атмосферу", "Объединяю людей", "Делаю события незабываемыми"]}
          itemClassName="text-2xl font-black uppercase italic tracking-tight text-white/90 md:text-4xl"
        />
      </div>
      <div className="container grid gap-10 pt-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">{site.seo.description}</p>
          <div className="mt-6 flex gap-2">
            {[
              { href: whatsappLink(), icon: <WhatsAppIcon className="h-5 w-5" />, label: "WhatsApp" },
              { href: telegramLink(), icon: <TelegramIcon className="h-5 w-5" />, label: "Telegram" },
              { href: instagramLink(), icon: <InstagramIcon className="h-5 w-5" />, label: "Instagram" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white/80 transition duration-300 ease-spring hover:-translate-y-0.5 hover:bg-white hover:text-gold"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-luxe text-champagne-light">Мероприятия</p>
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm md:grid-cols-1">
            {EVENT_CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/events/${c.slug}`} className="text-white/65 transition hover:text-white">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-luxe text-champagne-light">Связаться</p>
          <ul className="mt-5 space-y-2.5 text-sm">
            <li>
              <a href={phoneLink()} className="text-white/65 transition hover:text-white">
                {site.contacts.phone}
              </a>
            </li>
            <li>
              <Link href="/booking" className="text-white/65 transition hover:text-white">
                Онлайн-заявка
              </Link>
            </li>
            <li className="text-white/65">{site.city}</li>
          </ul>
        </div>
      </div>
      <div className="container mt-14 flex flex-col justify-between gap-2 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row">
        <p>
          © {new Date().getFullYear()} {site.brand}. Все права защищены.
        </p>
        <p>
          {site.hostName} · {site.role}
        </p>
      </div>
    </footer>
  );
}
