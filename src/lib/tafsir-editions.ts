export type TafsirLanguage = "en" | "ur" | "hi";

export const TAFSIR_EDITIONS = {
  en: { label: "English", name: "Ibn Kathir (Abridged)", author: "Hafiz Ibn Kathir", resourceId: 169, slug: "en-tafisr-ibn-kathir" },
  ur: { label: "اردو — Urdu", name: "Tafsir Ibn Kathir — Urdu", author: "Hafiz Ibn Kathir", resourceId: 160, slug: "ur-tafseer-ibn-e-kaseer" },
  hi: { label: "हिन्दी — Hindi", name: "Al-Mukhtasar — Hindi", author: "Tafsir Center for Quranic Studies", resourceId: null, slug: "hindi_mokhtasar" },
} as const;

export function isTafsirLanguage(value: unknown): value is TafsirLanguage {
  return value === "en" || value === "ur" || value === "hi";
}
