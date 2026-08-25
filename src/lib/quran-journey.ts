export const JOURNEY_STORAGE_KEY = "nurulquran.journey.v1";
export const JOURNEY_EVENT = "nurulquran:journey-updated";
export const TOTAL_QURAN_AYAHS = 6236;

export type LastRead = {
  surahNumber: number;
  surahName: string;
  surahSlug: string;
  ayahNumber: number;
  globalAyahNumber: number;
  reciterId?: string;
  updatedAt: string;
};

export type Bookmark = {
  id: string;
  surahNumber: number;
  surahName: string;
  surahSlug: string;
  ayahNumber: number;
  globalAyahNumber: number;
  arabic: string;
  english: string;
  hindi?: string;
  note: string;
  collection: string;
  createdAt: string;
  updatedAt: string;
};

export type RecentSurah = {
  number: number;
  name: string;
  slug: string;
  openedAt: string;
};

export type ReadingPlan = {
  id: string;
  name: string;
  durationDays: number;
  startDate: string;
  trackingMode: "pages" | "juz" | "surah";
  completedDays: string[];
  paused: boolean;
  createdAt: string;
};

export type JourneyData = {
  version: 1;
  lastRead: LastRead | null;
  recentSurahs: RecentSurah[];
  bookmarks: Bookmark[];
  completedAyahs: number[];
  completedSurahs: number[];
  plan: ReadingPlan | null;
  updatedAt: string;
};

export const EMPTY_JOURNEY: JourneyData = {
  version: 1,
  lastRead: null,
  recentSurahs: [],
  bookmarks: [],
  completedAyahs: [],
  completedSurahs: [],
  plan: null,
  updatedAt: new Date(0).toISOString(),
};

export function readJourney(): JourneyData {
  if (typeof window === "undefined") return EMPTY_JOURNEY;
  try {
    const parsed = JSON.parse(localStorage.getItem(JOURNEY_STORAGE_KEY) || "null") as Partial<JourneyData> | null;
    if (!parsed || parsed.version !== 1) return EMPTY_JOURNEY;
    return {
      ...EMPTY_JOURNEY,
      ...parsed,
      recentSurahs: Array.isArray(parsed.recentSurahs) ? parsed.recentSurahs : [],
      bookmarks: Array.isArray(parsed.bookmarks) ? parsed.bookmarks : [],
      completedAyahs: Array.isArray(parsed.completedAyahs) ? parsed.completedAyahs : [],
      completedSurahs: Array.isArray(parsed.completedSurahs) ? parsed.completedSurahs : [],
    };
  } catch {
    return EMPTY_JOURNEY;
  }
}

export function writeJourney(data: JourneyData) {
  if (typeof window === "undefined") return;
  const next = { ...data, version: 1 as const, updatedAt: new Date().toISOString() };
  localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(JOURNEY_EVENT, { detail: next }));
}

export function mergeJourney(local: JourneyData, cloud: JourneyData): JourneyData {
  const bookmarkMap = new Map<string, Bookmark>();
  [...cloud.bookmarks, ...local.bookmarks].forEach(item => {
    const existing = bookmarkMap.get(item.id);
    if (!existing || new Date(item.updatedAt) >= new Date(existing.updatedAt)) bookmarkMap.set(item.id, item);
  });
  const recentMap = new Map<number, RecentSurah>();
  [...cloud.recentSurahs, ...local.recentSurahs].forEach(item => {
    const existing = recentMap.get(item.number);
    if (!existing || new Date(item.openedAt) >= new Date(existing.openedAt)) recentMap.set(item.number, item);
  });
  const latest = new Date(local.updatedAt) >= new Date(cloud.updatedAt) ? local : cloud;
  return {
    version: 1,
    lastRead: latest.lastRead || local.lastRead || cloud.lastRead,
    recentSurahs: [...recentMap.values()].sort((a, b) => b.openedAt.localeCompare(a.openedAt)).slice(0, 8),
    bookmarks: [...bookmarkMap.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    completedAyahs: [...new Set([...cloud.completedAyahs, ...local.completedAyahs])],
    completedSurahs: [...new Set([...cloud.completedSurahs, ...local.completedSurahs])],
    plan: latest.plan,
    updatedAt: new Date().toISOString(),
  };
}

export function surahSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

