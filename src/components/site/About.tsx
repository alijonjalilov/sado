import Image from "next/image";
import { Quote } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";

export function About() {
  const a = site.about;
  return (
    <section id="about" className="section scroll-mt-24">
      <div className="container">
        <div className="grid gap-5 lg:grid-cols-12">
          {/* Фото */}
          <Reveal className="relative lg:col-span-5">
            <div className="relative h-full min-h-[440px] overflow-hidden rounded-panel bg-deep shadow-float">
              <Image src={a.image} alt={`${site.hostName} — ${site.role}`} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/10 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/15 bg-white/10 p-5 text-white backdrop-blur-md">
                <p className="text-2xl font-black italic">{site.hostName}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-luxe text-champagne-light">{site.role}</p>
              </div>
            </div>
          </Reveal>

          {/* Текст */}
          <Reveal delay={0.08} className="lg:col-span-7">
            <div className="h-full rounded-panel border border-line bg-white p-7 shadow-card md:p-12">
              <span className="eyebrow">{a.eyebrow}</span>
              <h2 className="mt-4 text-[2rem] font-extrabold leading-[1.05] sm:text-5xl">{a.title}</h2>
              <div className="mt-7 space-y-4 text-base leading-relaxed text-milk/70 md:text-[17px]">
                {a.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {a.qualities.map((q) => (
                  <span key={q} className="rounded-full bg-blush-soft px-4 py-2 text-sm font-bold text-gold">
                    {q}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Бенто: цифры и философия */}
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {a.stats.map((s, i) => (
            <Reveal key={s.label} delay={0.05 * i}>
              <div className={`flex h-full flex-col justify-between rounded-card p-7 ${i === 0 ? "bg-gold text-white shadow-gold" : "border border-line bg-white shadow-card"}`}>
                <p className={`text-5xl font-black italic tracking-tight md:text-6xl ${i === 0 ? "text-white" : "text-gold"}`}>{s.value}</p>
                <p className={`mt-6 text-sm font-bold ${i === 0 ? "text-white/80" : "text-milk/55"}`}>{s.label}</p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.15}>
            <div className="flex h-full flex-col justify-between rounded-card bg-deep p-7 text-white">
              <Quote className="h-7 w-7 text-champagne" />
              <p className="mt-6 text-base font-bold italic leading-snug">{a.philosophy}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
