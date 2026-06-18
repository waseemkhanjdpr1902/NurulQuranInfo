import type { MetadataRoute } from "next";

const routes = [
  "",
  "/tools",
  "/quran",
  "/hadith",
  "/dua",
  "/prayer-times",
  "/tasbih",
  "/tafseer",
  "/names-of-allah",
  "/zakat",
  "/islamic-finance",
  "/halal-stocks",
  "/islamic-calendar",
  "/daily-verse",
  "/daily-hadith",
  "/dawah",
  "/islamic-science",
  "/spiritual-guide",
  "/hajj",
  "/privacy",
  "/terms",
  "/support",
  "/feedback",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://nurulquran.info${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
