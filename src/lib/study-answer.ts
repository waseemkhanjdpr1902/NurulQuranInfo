import { QURAN_TOPICS } from "@/data/quran-topics";
export function normalizeDigits(text: string) {
  return text.replace(/[\u0660-\u0669\u06f0-\u06f9]/g, (char) =>
    String(
      char.charCodeAt(0) - (char.charCodeAt(0) >= 0x06f0 ? 0x06f0 : 0x0660),
    ),
  );
}
export function studyContext(question: string) {
  const topics = [
    {
      pattern: /\b(?:sabr|patience|hardship)\b|صبر|सब्र|धैर्य/i,
      slug: "patience-during-hardship",
    },
    {
      pattern: /\b(?:tawbah|repentance|forgiveness)\b|توبہ|استغفار|माफ़ी|तौबा/i,
      slug: "tawbah-and-forgiveness",
    },
    {
      pattern: /\b(?:mercy|hope)\b|رحمت|امید|उम्मीद|रहमत/i,
      slug: "hope-and-mercy",
    },
  ];
  const topic = QURAN_TOPICS.find(
    (t) => t.slug === topics.find((t) => t.pattern.test(question))?.slug,
  );
  return {
    references: topic?.ayahs.map((a) => `${a.surah}:${a.ayah}`) || [],
    summary: topic?.introduction || "",
  };
}
/** This filters known failure patterns, not every possible theological error. */
export function acceptableStudyAnswer(
  text: unknown,
  references: string[],
): text is string {
  if (typeof text !== "string" || text.trim().length < 5 || text.length > 4000)
    return false;
  const normalized = normalizeDigits(text);
  const allowed = new Set(references);
  for (const match of normalized.matchAll(
    /(\d{1,3})\s*[:：]\s*(\d{1,3})(?:\s*[\-–‑]\s*(\d{1,3}))?/g,
  )) {
    const start = Number(match[2]);
    const end = Number(match[3] || match[2]);
    if (end < start || end - start > 10) return false;
    for (let ayah = start; ayah <= end; ayah++)
      if (!allowed.has(`${Number(match[1])}:${ayah}`)) return false;
  }
  // Arabic vowel-marked passages can be generated scripture: never publish them from the model.
  if ((text.match(/[\u064b-\u065f\u0670]/g) || []).length > 12) return false;
  const words = normalized.toLowerCase().split(/\s+/);
  const phrases = new Map<string, number>();
  for (let i = 0; i + 5 <= words.length; i++) {
    const phrase = words.slice(i, i + 5).join(" ");
    const count = (phrases.get(phrase) || 0) + 1;
    if (count >= 4) return false;
    phrases.set(phrase, count);
  }
  return true;
}
export function studyInstructions(summary: string, _references: string[]) {
  return `Reply in the user's language. Keep the answer under 120 words and avoid repeating phrases. Use plain text. Explain only general educational guidance, not a fatwa. Never quote Arabic Quran or hadith text, or purported verbatim translations, from memory. Do not supply any numeric Quran or hadith citations or chapter names from memory. Do not attribute your paraphrases to a specific verse or say a particular verse states them. The website separately supplies reviewed related-verse links; do not generate those links or references yourself. ${summary ? `Reviewed general topic context: ${summary}` : "Give only a general explanation and suggest checking the Quran reader or a qualified scholar."}`;
}
