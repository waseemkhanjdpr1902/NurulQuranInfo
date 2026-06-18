export type ToolCategory =
  | "Quran"
  | "Worship"
  | "Daily"
  | "Finance"
  | "Learning"
  | "Support";

export interface ToolItem {
  name: string;
  href: string;
  icon: string;
  category: ToolCategory;
  description: string;
}

export const tools: ToolItem[] = [
  {
    name: "Quran Reading",
    href: "/quran",
    icon: "BookOpen",
    category: "Quran",
    description: "Read Surahs with Arabic text, translation, tafsir study tools, and a clean mobile layout.",
  },
  {
    name: "Quran Recitation",
    href: "/quran",
    icon: "Volume2",
    category: "Quran",
    description: "Open the Quran reader and listen with the existing working recitation experience.",
  },
  {
    name: "Asmaul Husna",
    href: "/names-of-allah",
    icon: "Sparkles",
    category: "Worship",
    description: "Study the 99 Names of Allah with Arabic, meanings, search, audio, and favorites.",
  },
  {
    name: "Duas",
    href: "/dua",
    icon: "Heart",
    category: "Worship",
    description: "Browse daily duas and adhkar with Arabic, transliteration, translation, audio, and favorites.",
  },
  {
    name: "Tasbih Counter",
    href: "/tasbih",
    icon: "RotateCcw",
    category: "Worship",
    description: "Count dhikr with saved history, lifetime totals, and a focused tap-friendly interface.",
  },
  {
    name: "Prayer Times",
    href: "/prayer-times",
    icon: "Clock",
    category: "Daily",
    description: "Check daily prayer times, next-prayer countdown, and location-based timings.",
  },
  {
    name: "Qibla Finder",
    href: "/prayer-times#qibla",
    icon: "Compass",
    category: "Daily",
    description: "Use the Qibla direction tool with location and compass support on compatible devices.",
  },
  {
    name: "Islamic Calendar",
    href: "/islamic-calendar",
    icon: "CalendarDays",
    category: "Daily",
    description: "View today’s Gregorian and approximate Hijri date with important Islamic events.",
  },
  {
    name: "Zakat Calculator",
    href: "/zakat",
    icon: "Calculator",
    category: "Finance",
    description: "Estimate zakat on cash, gold, silver, investments, business assets, and liabilities.",
  },
  {
    name: "Islamic Finance",
    href: "/islamic-finance",
    icon: "Landmark",
    category: "Finance",
    description: "Learn riba, halal income, investing principles, zakat, debt, and Islamic banking concepts.",
  },
  {
    name: "Halal Stock Finder",
    href: "/halal-stocks",
    icon: "ShieldCheck",
    category: "Finance",
    description: "Search multi-country demo Shariah screening data with filters, explanations, and watchlist.",
  },
  {
    name: "Islamic Science",
    href: "/islamic-science",
    icon: "Atom",
    category: "Learning",
    description: "Explore Muslim scholarly contributions and ethical knowledge without unsupported miracle claims.",
  },
  {
    name: "Daily Verse",
    href: "/daily-verse",
    icon: "Sun",
    category: "Daily",
    description: "Reflect on a rotating Quran verse with translation, short reflection, and sharing.",
  },
  {
    name: "Daily Hadith",
    href: "/daily-hadith",
    icon: "Quote",
    category: "Daily",
    description: "Read a daily hadith with source, reflection prompt, refresh, and favorite support.",
  },
  {
    name: "Buy Me a Coffee",
    href: "/support",
    icon: "Coffee",
    category: "Support",
    description: "Support NurulQuran.info with a small contribution to maintain Islamic tools for everyone.",
  },
];

export function getRelatedTools(currentHref: string, limit = 3) {
  const current = tools.find((tool) => tool.href === currentHref || currentHref.startsWith(tool.href));
  const sameCategory = tools.filter(
    (tool) => tool.href !== currentHref && current && tool.category === current.category
  );
  const fallback = tools.filter((tool) => tool.href !== currentHref && !sameCategory.includes(tool));
  return [...sameCategory, ...fallback].slice(0, limit);
}
