import type { MetadataRoute } from "next";

const routes = [
  "",
  "/quran",
  "/tafseer",
  "/hadith",
  "/dua",
  "/prayer-times",
  "/tasbih",
  "/zakat",
  "/names-of-allah",
  "/spiritual-guide",
  "/islamic-science",
  "/dawah",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nurrulquran.info";

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/quran" ? 0.9 : 0.7,
  }));
}
