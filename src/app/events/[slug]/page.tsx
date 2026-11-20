import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { FloatingContact } from "@/components/site/FloatingContact";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Reveal } from "@/components/ui/Reveal";
import { EVENT_CATEGORIES, getCategory } from "@/content/events";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return EVENT_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) return {};
  return {
    title: `Ведущий: ${c.title.toLowerCase()}`,
    description: c.short,
    alternates: { canonical: `/events/${c.slug}` },
    openGraph: { images: [{ url: c.image }] },
  };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) notFound();
  const others = EVENT_CATEGORIES.filter((x) => x.slug !== c.slug).slice(0, 3);

  return (
    <>
      <Header />
      <main>
        {/* Шапка страницы — та же скруглённая тёмная панель, что и на главной */}
        <section className="px-3 pt-3 md:px-5 md:pt-4">
          <div className="grain relative isolate mx-auto flex min-h-[64svh] max-w-[1400px] items-end overflow-hidden rounded-[28px] rounded-b-panel bg-deep pb-14 pt-36 text-white">
            <Image src={c.image} alt={c.title} fill priority sizes="100vw" className="-z-10 object-cover opacity-55" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-deep via-deep/60 to-deep/10" />
            <div className="container">
              <Link href="/#events" className="btn-glass h-10 px-4 text-xs">
                <ArrowLeft className="h-4 w-4" /> Все мероприятия
              </Link>
              <h1 className="mt-6 text-5xl font-black uppercase italic leading-[0.95] tracking-tight text-white md:text-8xl">{c.title}</h1>
              <p className="mt-5 max-w-2xl text-lg text-white/75">{c.short}</p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container grid gap-5 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <div className="h-full rounded-panel border border-line bg-white p-7 shadow-card md:p-12">
                <span className="eyebrow">О формате</span>
                <p className="mt-5 text-2xl font-extrabold leading-snug text-milk md:text-3xl">{c.intro}</p>
                <div className="mt-8 rounded-card bg-blush-soft p-6">
                  <p className="font-bold italic text-gold">{c.approach}</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.08} className="lg:col-span-5">
              <div className="h-full rounded-panel bg-gold p-7 text-white shadow-gold md:p-10">
                <p className="text-[11px] font-extrabold uppercase tracking-luxe text-champagne-light">Что входит</p>
                <ul className="mt-6 space-y-4">
                  {c.includes.map((item) => (
                    <li key={item} className="flex gap-3 font-semibold text-white/90">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white text-gold">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href={`/booking?type=${c.bookingType}`} className="btn-light group mt-10 h-14 w-full">
                  Обсудить мероприятие
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section pt-0">
          <div className="container">
            <span className="eyebrow">Другие форматы</span>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {others.map((o) => (
                <Link
                  key={o.slug}
                  href={`/events/${o.slug}`}
                  className="group relative isolate flex aspect-[4/3] items-end overflow-hidden rounded-card p-6 text-white shadow-card transition duration-500 hover:-translate-y-1 hover:shadow-float"
                >
                  <Image src={o.image} alt={o.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="-z-10 object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-deep via-deep/30 to-transparent" />
                  <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white text-gold transition group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                  <p className="text-2xl font-black uppercase italic">{o.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
