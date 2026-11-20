import { Clock, Handshake, Languages, ScrollText, ShieldCheck, Sparkles, Users, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = { Clock, Handshake, Languages, ScrollText, ShieldCheck, Users };

// Цвета плиток бенто — как разноцветные панели у референса
const TILE = [
  "bg-gold text-white shadow-gold",
  "border border-line bg-white shadow-card",
  "bg-deep text-white",
  "border border-line bg-white shadow-card",
  "bg-champagne-soft",
  "bg-blush",
];

export function WhyMe() {
  return (
    <section id="why" className="section scroll-mt-24">
      <div className="container">
        <SectionHeading
          eyebrow="Почему я"
          align="center"
          title={<>Спокойствие для вас. <span className="text-gold-gradient">Праздник для гостей.</span></>}
          text="Вы доверяете мне самый важный вечер. Поэтому всё, что можно предусмотреть, предусмотрено заранее."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {site.whyMe.map((item, i) => {
            const Icon = ICONS[item.icon] ?? Sparkles;
            const dark = i === 0 || i === 2;
            return (
              <Reveal key={item.title} delay={0.05 * i}>
                <div className={cn("group h-full rounded-card p-7 transition duration-500 ease-out hover:-translate-y-1 md:p-8", TILE[i % TILE.length])}>
                  <span
                    className={cn(
                      "grid h-12 w-12 place-items-center rounded-2xl transition duration-300 ease-spring group-hover:rotate-6 group-hover:scale-110",
                      dark ? "bg-white/15 text-champagne-light" : "bg-white text-gold shadow-card",
                    )}
                  >
                    <Icon className="h-6 w-6" strokeWidth={1.8} />
                  </span>
                  <h3 className={cn("mt-8 text-xl font-extrabold md:text-2xl", dark && "text-white")}>{item.title}</h3>
                  <p className={cn("mt-2 leading-relaxed", dark ? "text-white/70" : "text-milk/60")}>{item.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
