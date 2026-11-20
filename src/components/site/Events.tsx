import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EVENT_CATEGORIES } from "@/content/events";
import { cn } from "@/lib/utils";

export function Events() {
  return (
    <section id="events" className="section scroll-mt-24">
      <div className="container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Мероприятия" title={<>Каждое событие — <span className="text-gold-gradient">своя история</span></>} />
          <Reveal>
            <Link href="/booking" className="btn-outline">
              Подобрать формат <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EVENT_CATEGORIES.map((c, i) => {
            const featured = i === 0;
            const wide = i === EVENT_CATEGORIES.length - 1;
            return (
              <Reveal
                key={c.slug}
                delay={0.04 * (i % 3)}
                className={cn(featured && "sm:col-span-2 lg:row-span-2", wide && "lg:col-span-3")}
              >
                <Link
                  href={`/events/${c.slug}`}
                  className={cn(
                    "group relative isolate flex h-full min-h-[320px] flex-col justify-end overflow-hidden rounded-card p-6 text-white shadow-card transition duration-500 ease-out hover:-translate-y-1 hover:shadow-float md:p-7",
                    featured && "lg:min-h-[660px] lg:rounded-panel",
                    wide && "lg:min-h-[280px]",
                  )}
                >
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    sizes={featured ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 640px) 100vw, 33vw"}
                    className="-z-10 object-cover transition duration-[1.2s] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-deep via-deep/45 to-transparent" />
                  <span className="absolute right-5 top-5 grid h-12 w-12 place-items-center rounded-full bg-white text-gold shadow-card transition duration-300 ease-spring group-hover:rotate-45 group-hover:bg-gold group-hover:text-white">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                  <span className="mb-3 inline-flex w-fit rounded-full bg-white/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-luxe backdrop-blur">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className={cn("font-black uppercase italic tracking-tight text-white", featured ? "text-5xl md:text-6xl" : "text-3xl")}>{c.title}</h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-white/75">{c.short}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-champagne-light">
                    Подробнее <span className="h-px w-8 bg-champagne-light transition-all duration-300 group-hover:w-14" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
