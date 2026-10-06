import { NextResponse } from "next/server";
import { decodeHTML } from "entities";
import { isTafsirLanguage, TAFSIR_EDITIONS } from "@/lib/tafsir-editions";

export const dynamic = "force-dynamic";

// Render provider markup as plain text; React never inserts upstream HTML.
function readableText(text: string) {
  return decodeHTML(text
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<br\s*\/?\s*>|<\/(?:p|div|h[1-6]|li)>/gi, "\n\n")
    .replace(/<[^>]*>/g, ""))
    .replace(/\n[\t ]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const verseKey = searchParams.get("verse_key");
  const language = searchParams.get("language") || "en";
  if (!isTafsirLanguage(language)) {
    return NextResponse.json({ error: "Supported tafsir languages are en, ur, and hi." }, { status: 400 });
  }
  if (!verseKey || !/^\d{1,3}:\d{1,3}$/.test(verseKey)) {
    return NextResponse.json({ error: "A valid verse_key is required." }, { status: 400 });
  }
  const [chapter, verse] = verseKey.split(":").map(Number);
  if (chapter < 1 || chapter > 114 || verse < 1 || verse > 286) {
    return NextResponse.json({ error: "A valid verse_key is required." }, { status: 400 });
  }
  const canonicalKey = `${chapter}:${verse}`;
  const edition = TAFSIR_EDITIONS[language];
  const sourceUrl = language === "hi"
    ? `https://quranenc.com/en/browse/${edition.slug}/${chapter}/${verse}`
    : `https://quran.com/${chapter}:${verse}/tafsirs/${edition.resourceId}`;
  const endpoints = language === "hi" ? [
    `https://quranenc.com/api/v1/translation/aya/${edition.slug}/${chapter}/${verse}`,
  ] : [
    `https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@${language === "ur" ? "v1.2.1" : "main"}/tafsir/${edition.slug}/${chapter}/${verse}.json`,
    `https://api.quran.com/api/v4/tafsirs/${edition.resourceId}/by_ayah/${encodeURIComponent(canonicalKey)}`,
    `https://api.quran.com/api/v4/verses/by_key/${encodeURIComponent(canonicalKey)}?tafsirs=${edition.resourceId}`,
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        headers: { Accept: "application/json", "User-Agent": "NurulQuranInfo/1.0" },
        next: { revalidate: 60 * 60 * 24 },
        signal: AbortSignal.timeout(language === "hi" ? 15000 : 8000),
      });
      if (!response.ok) continue;
      const data = await response.json();
      let text: unknown;
      if (language === "hi") {
        const result = data?.result;
        if (Number(result?.sura) !== chapter || Number(result?.aya) !== verse) continue;
        text = [result?.translation, result?.footnotes].filter(value => typeof value === "string" && value.trim()).join("\n\n");
      } else if (data?.text) {
        if (Number(data.surah) !== chapter || Number(data.ayah) !== verse) continue;
        text = data.text;
      } else {
        const tafsir = data?.tafsir || data?.verse?.tafsirs?.find((item: { resource_id?: number }) => item.resource_id === edition.resourceId);
        // Some old API endpoints ignore the requested edition. Refuse a mismatch.
        if (tafsir?.resource_id !== edition.resourceId) continue;
        text = tafsir.text;
      }
      if (typeof text !== "string" || !text.trim()) continue;
      const normalized = readableText(text);
      if (!normalized) continue;
      return NextResponse.json({ text: normalized, language, resourceName: edition.name, author: edition.author, sourceUrl });
    } catch (error) {
      console.error("Tafsir fetch failed:", error);
    }
  }
  return NextResponse.json({ error: `${edition.name} is unavailable for this ayah. Please try again or choose another language.` }, { status: 404 });
}
