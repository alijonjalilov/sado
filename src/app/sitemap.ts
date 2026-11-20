import type { MetadataRoute } from "next";
import { EVENT_CATEGORIES } from "@/content/events";
import { siteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/booking`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...EVENT_CATEGORIES.map((c) => ({
      url: `${base}/events/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
