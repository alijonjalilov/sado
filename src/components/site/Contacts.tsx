import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { InstagramIcon, TelegramIcon, WhatsAppIcon } from "@/components/ui/SocialIcons";
import { instagramLink, phoneLink, site, telegramLink, whatsappLink } from "@/content/site";

export function Contacts() {
  const items = [
    { label: "Телефон", value: site.contacts.phone, href: phoneLink(), icon: <Phone className="h-5 w-5" strokeWidth={2} /> },
    { label: "WhatsApp", value: "Написать", href: whatsappLink("Здравствуйте! Хочу узнать о свободных датах."), icon: <WhatsAppIcon className="h-5 w-5" /> },
    { label: "Telegram", value: `@${site.contacts.telegram}`, href: telegramLink(), icon: <TelegramIcon className="h-5 w-5" /> },
    { label: "Instagram", value: `@${site.contacts.instagram}`, href: instagramLink(), icon: <InstagramIcon className="h-5 w-5" /> },
  ];

  return (
    <section id="contacts" className="section scroll-mt-24">
      <div className="container">
        <Reveal>
          <div className="grain relative isolate grid gap-10 overflow-hidden rounded-panel bg-gold px-6 py-14 text-white shadow-gold md:px-14 md:py-16 lg:grid-cols-2 lg:items-center">
            <div className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-champagne/40 blur-[100px]" />
            <div className="absolute -bottom-32 -left-20 -z-10 h-80 w-80 rounded-full bg-deep/50 blur-[100px]" />
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-luxe text-champagne-light">Контакты</p>
              <h2 className="mt-4 text-4xl font-black uppercase italic leading-[0.95] text-white sm:text-6xl">
                Давайте создадим
                <br />
                ваше мероприятие
              </h2>
              <p className="mt-6 max-w-lg text-white/80 md:text-lg">
                Пройдите короткий опрос — это займёт 2–3 минуты. Ведущий получит всю информацию и свяжется с вами с готовыми идеями.
              </p>
              <Link href="/booking" className="btn-light group mt-9 h-14 px-8">
                Оставить заявку
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {items.map((it) => (
                <a
                  key={it.label}
                  href={it.href}
                  target={it.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group rounded-card bg-white p-6 text-milk transition duration-300 ease-spring hover:-translate-y-1 hover:shadow-float"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-blush-soft text-gold transition group-hover:bg-gold group-hover:text-white">{it.icon}</span>
                  <p className="mt-6 text-[11px] font-extrabold uppercase tracking-luxe text-milk/40">{it.label}</p>
                  <p className="mt-1 break-words text-lg font-extrabold">{it.value}</p>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
