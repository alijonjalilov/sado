import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/utils";
import "./globals.css";

// Один шрифт на весь сайт: Montserrat (кириллица, курсив для акцентных заголовков)
const sans = Montserrat({
  subsets: ["latin", "cyrillic"],
  style: ["normal", "italic"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: site.seo.title, template: `%s — ${site.brand}` },
  description: site.seo.description,
  keywords: site.seo.keywords,
  applicationName: site.brand,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: site.brand,
    title: site.seo.title,
    description: site.seo.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: site.brand }],
  },
  twitter: { card: "summary_large_image", title: site.seo.title, description: site.seo.description, images: ["/og.jpg"] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F6F2EC",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={sans.variable}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
