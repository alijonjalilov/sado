import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
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
        <section className="relative isolate flex min-h-[70svh] items-end overflow-hidden pb-16 pt-36">
          <Image src={c.image} alt={c.title} fill priority sizes="100vw" className="-z-10 object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
          <div className="container">
            <Link href="/#events" className="inline-flex items-center gap-2 text-sm text-milk/60 transition hover:text-gold">
              <ArrowLeft className="h-4 w-4" /> Все мероприятия
            </Link>
            <h1 className="mt-6 text-6xl font-medium md:text-8xl">{c.title}</h1>
            <p className="mt-5 max-w-2xl text-lg text-milk/70">{c.short}</p>
          </div>
        </section>

        <section className="section pt-12">
          <div className="container grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="font-serif text-3xl leading-snug text-milk md:text-4xl">{c.intro}</p>
              </Reveal>
              <Reveal delay={0.1} className="mt-10 border-l-2 border-gold pl-6">
                <p className="text-lg italic text-beige">{c.approach}</p>
              </Reveal>
            </div>
            <Reveal delay={0.1} className="lg:col-span-5">
              <div className="card-glass p-8 md:p-10">
                <p className="eyebrow">Что входит</p>
                <ul className="mt-6 space-y-4">
                  {c.includes.map((item) => (
                    <li key={item} className="flex gap-3 text-milk/80">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href={`/booking?type=${c.bookingType}`} className="btn-gold group mt-10 w-full py-4">
                  Обсудить мероприятие
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section bg-ink-800 pt-20">
          <div className="container">
            <p className="eyebrow">Другие форматы</p>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {others.map((o) => (
                <Link key={o.slug} href={`/events/${o.slug}`} className="group relative isolate flex aspect-[4/3] items-end overflow-hidden rounded-3xl border border-milk/10 p-6">
                  <Image src={o.image} alt={o.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="-z-10 object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink to-transparent" />
                  <p className="font-serif text-3xl">{o.title}</p>
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
