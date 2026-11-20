import Image from "next/image";
import { Quote } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";

export function About() {
  const a = site.about;
  return (
    <section id="about" className="section overflow-hidden">
      <div className="container grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
        <Reveal className="relative lg:col-span-5">
          <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem]">
            <Image src={a.image} alt={`${site.hostName} — ${site.role}`} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="font-serif text-3xl text-milk">{site.hostName}</p>
              <p className="mt-1 text-sm uppercase tracking-luxe text-gold">{site.role}</p>
            </div>
          </div>
          <div className="absolute -right-4 -top-4 -z-10 h-full w-full rounded-[2rem] border border-gold/30 md:-right-6 md:-top-6" />
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal>
            <span className="eyebrow">{a.eyebrow}</span>
            <h2 className="mt-5 text-4xl font-medium leading-[1.05] sm:text-5xl md:text-6xl">{a.title}</h2>
          </Reveal>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-milk/70 md:text-lg">
            {a.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.08 * i}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="mt-10 grid grid-cols-3 gap-4 border-y border-milk/10 py-8">
            {a.stats.map((s) => (
              <div key={s.label}>
                <p className="font-serif text-4xl text-gold-gradient md:text-5xl">{s.value}</p>
                <p className="mt-1 text-xs text-milk/50 md:text-sm">{s.label}</p>
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.25} className="mt-8 flex flex-wrap gap-2">
            {a.qualities.map((q) => (
              <span key={q} className="rounded-full border border-milk/15 px-4 py-2 text-sm text-milk/80">
                {q}
              </span>
            ))}
          </Reveal>

          <Reveal delay={0.3} className="mt-10 flex gap-4">
            <Quote className="h-8 w-8 shrink-0 text-gold" />
            <p className="font-serif text-2xl italic leading-snug text-beige md:text-3xl">{a.philosophy}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
