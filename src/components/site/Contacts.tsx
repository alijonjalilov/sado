import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { InstagramIcon, TelegramIcon, WhatsAppIcon } from "@/components/ui/SocialIcons";
import { instagramLink, phoneLink, site, telegramLink, whatsappLink } from "@/content/site";

export function Contacts() {
  const items = [
    { label: "Телефон", value: site.contacts.phone, href: phoneLink(), icon: <Phone className="h-6 w-6" strokeWidth={1.5} /> },
    { label: "WhatsApp", value: "Написать в WhatsApp", href: whatsappLink("Здравствуйте! Хочу узнать о свободных датах."), icon: <WhatsAppIcon className="h-6 w-6" /> },
    { label: "Telegram", value: `@${site.contacts.telegram}`, href: telegramLink(), icon: <TelegramIcon className="h-6 w-6" /> },
    { label: "Instagram", value: `@${site.contacts.instagram}`, href: instagramLink(), icon: <InstagramIcon className="h-6 w-6" /> },
  ];

  return (
    <section id="contacts" className="section">
      <div className="container">
        <Reveal className="relative isolate overflow-hidden rounded-[2.5rem] border border-gold/20 bg-graphite/40 px-6 py-16 md:px-16 md:py-24">
          <div className="absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-gold/20 blur-[120px]" />
          <div className="absolute -bottom-40 -left-20 -z-10 h-96 w-96 rounded-full bg-gold-dark/20 blur-[120px]" />
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="eyebrow">Контакты</span>
              <h2 className="mt-5 text-4xl font-medium leading-[1.05] sm:text-5xl md:text-6xl">
                Давайте создадим <em className="text-gold-gradient">ваше мероприятие</em>
              </h2>
              <p className="mt-6 max-w-lg text-milk/60 md:text-lg">
                Пройдите короткий опрос — это займёт 2–3 минуты. Ведущий получит всю информацию и свяжется с вами с готовыми идеями.
              </p>
              <Link href="/booking" className="btn-gold group mt-10 px-8 py-4">
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
                  className="group rounded-2xl border border-milk/10 bg-ink/50 p-6 transition hover:-translate-y-1 hover:border-gold/60"
                >
                  <span className="text-gold transition group-hover:text-gold-light">{it.icon}</span>
                  <p className="mt-6 text-xs uppercase tracking-luxe text-milk/40">{it.label}</p>
                  <p className="mt-1 break-words text-lg text-milk">{it.value}</p>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
