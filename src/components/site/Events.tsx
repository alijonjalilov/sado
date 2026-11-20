import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EVENT_CATEGORIES } from "@/content/events";
import { cn } from "@/lib/utils";

export function Events() {
  return (
    <section id="events" className="section bg-ink-800">
      <div className="container">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading eyebrow="Мероприятия" title={<>Каждое событие — <em className="text-gold-gradient">своя история</em></>} />
          <Reveal>
            <Link href="/booking" className="btn-outline">
              Подобрать формат
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EVENT_CATEGORIES.map((c, i) => (
            <Reveal key={c.slug} delay={0.05 * (i % 3)} className={cn(i === 0 && "sm:col-span-2 lg:col-span-2 lg:row-span-2", i === EVENT_CATEGORIES.length - 1 && "lg:col-span-3")}>
              <Link
                href={`/events/${c.slug}`}
                className={cn(
                  "group relative isolate flex h-full min-h-[380px] flex-col justify-end overflow-hidden rounded-3xl border border-milk/10 p-7",
                  i === 0 && "lg:min-h-[640px]",
                  i === EVENT_CATEGORIES.length - 1 && "lg:min-h-[320px]",
                )}
              >
                <Image
                  src={c.image}
                  alt={c.title}
                  fill
                  sizes={i === 0 ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
                  className="-z-10 object-cover transition duration-[1.2s] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/50 to-ink/0" />
                <span className="absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-full border border-milk/20 text-milk backdrop-blur transition group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
                <h3 className={cn("font-serif text-milk", i === 0 ? "text-5xl md:text-6xl" : "text-4xl")}>{c.title}</h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-milk/70">{c.short}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                  Подробнее <span className="h-px w-8 bg-gold transition-all group-hover:w-14" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
