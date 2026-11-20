import { Clock, Handshake, Languages, ScrollText, ShieldCheck, Sparkles, Users, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";

const ICONS: Record<string, LucideIcon> = { Clock, Handshake, Languages, ScrollText, ShieldCheck, Users };

export function WhyMe() {
  return (
    <section id="why" className="section bg-ink-800">
      <div className="container">
        <SectionHeading
          eyebrow="Почему я"
          align="center"
          title={<>Спокойствие для вас. <em className="text-gold-gradient">Праздник для гостей.</em></>}
          text="Вы доверяете мне самый важный вечер. Поэтому всё, что можно предусмотреть, предусмотрено заранее."
        />
        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-milk/10 bg-milk/10 sm:grid-cols-2 lg:grid-cols-3">
          {site.whyMe.map((item, i) => {
            const Icon = ICONS[item.icon] ?? Sparkles;
            return (
              <Reveal key={item.title} delay={0.06 * i} className="group bg-ink-800 p-8 transition hover:bg-graphite/60 md:p-10">
                <span className="grid h-14 w-14 place-items-center rounded-2xl border border-gold/30 text-gold transition group-hover:bg-gold group-hover:text-ink">
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <h3 className="mt-6 text-2xl text-milk md:text-3xl">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-milk/60">{item.text}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
