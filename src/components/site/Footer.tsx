import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { InstagramIcon, TelegramIcon, WhatsAppIcon } from "@/components/ui/SocialIcons";
import { EVENT_CATEGORIES } from "@/content/events";
import { instagramLink, phoneLink, site, telegramLink, whatsappLink } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-milk/10 bg-ink-800 pb-28 pt-16 md:pb-12">
      <div className="container grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-milk/50">{site.seo.description}</p>
          <div className="mt-6 flex gap-3">
            {[
              { href: whatsappLink(), icon: <WhatsAppIcon className="h-5 w-5" />, label: "WhatsApp" },
              { href: telegramLink(), icon: <TelegramIcon className="h-5 w-5" />, label: "Telegram" },
              { href: instagramLink(), icon: <InstagramIcon className="h-5 w-5" />, label: "Instagram" },
            ].map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="grid h-11 w-11 place-items-center rounded-full border border-milk/15 text-milk/70 transition hover:border-gold hover:text-gold">
                {s.icon}
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-luxe text-gold">Мероприятия</p>
          <ul className="mt-5 space-y-2.5 text-sm">
            {EVENT_CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/events/${c.slug}`} className="text-milk/60 transition hover:text-milk">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-luxe text-gold">Связаться</p>
          <ul className="mt-5 space-y-2.5 text-sm">
            <li>
              <a href={phoneLink()} className="text-milk/60 transition hover:text-milk">
                {site.contacts.phone}
              </a>
            </li>
            <li>
              <Link href="/booking" className="text-milk/60 transition hover:text-milk">
                Онлайн-заявка
              </Link>
            </li>
            <li className="text-milk/60">{site.city}</li>
          </ul>
        </div>
      </div>
      <div className="container mt-14 flex flex-col justify-between gap-3 border-t border-milk/5 pt-6 text-xs text-milk/30 md:flex-row">
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
