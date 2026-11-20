import { About } from "@/components/site/About";
import { Contacts } from "@/components/site/Contacts";
import { Events } from "@/components/site/Events";
import { FloatingContact } from "@/components/site/FloatingContact";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Portfolio } from "@/components/site/Portfolio";
import { Reviews, type PublicReview } from "@/components/site/Reviews";
import { WhyMe } from "@/components/site/WhyMe";
import { site } from "@/content/site";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/utils";

// Страница статическая, отзывы обновляются раз в 5 минут (ISR)
export const revalidate = 300;

async function getPublishedReviews(): Promise<PublicReview[]> {
  try {
    return await prisma.review.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: { id: true, authorName: true, eventLabel: true, text: true, rating: true, photoUrl: true },
    });
  } catch (e) {
    // База недоступна (например, во время сборки) — показываем блок без отзывов
    console.warn("[home] reviews unavailable:", (e as Error).message);
    return [];
  }
}

export default async function HomePage() {
  const reviews = await getPublishedReviews();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.brand,
    description: site.seo.description,
    url: siteUrl(),
    telephone: site.contacts.phone,
    areaServed: site.city,
    image: `${siteUrl()}/og.jpg`,
  };

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Events />
        <Portfolio />
        <WhyMe />
        <Reviews reviews={reviews} />
        <Contacts />
      </main>
      <Footer />
      <FloatingContact />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
