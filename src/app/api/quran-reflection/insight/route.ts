import { NextResponse } from "next/server";
import { rateLimit, rejectOversizedRequest } from "@/lib/api-security";

export const dynamic = "force-dynamic";

type Insight = {
  simpleMeaning: string;
  mainMessage: string;
  context: string;
  importantWords: Array<{ word: string; meaning: string }>;
  themes: string[];
  practicalLesson: string;
  sourceNote: string;
};

function cleanText(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

async function fetchVerifiedAyah(surah: number, ayah: number) {
  const response = await fetch(
    `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/editions/quran-uthmani,en.sahih`,
    { next: { revalidate: 60 * 60 * 24 } },
  );
  if (!response.ok) throw new Error("Verified ayah fetch failed");
  const payload = await response.json();
  if (payload.code !== 200 || payload.data?.length !== 2) throw new Error("Verified ayah data is incomplete");
  return { arabic: payload.data[0].text, translation: payload.data[1].text };
}

async function fetchTafsir(surah: number, ayah: number) {
  try {
    const response = await fetch(
      `https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/en-tafisr-ibn-kathir/${surah}/${ayah}.json`,
      { next: { revalidate: 60 * 60 * 24 * 7 } },
    );
    if (!response.ok) return null;
    const payload = await response.json();
    return cleanText(payload.text || "").slice(0, 6000) || null;
  } catch {
    return null;
  }
}

function safeFallback(translation: string, hasTafsir: boolean): Insight {
  return {
    simpleMeaning: translation,
    mainMessage: "Read the verified translation carefully and consider the guidance, warning, promise, command, or description it contains.",
    context: hasTafsir
      ? "Recognised tafsir material is available through the linked Ibn Kathir resource below. Review it for established context."
      : "No historical context is shown without a verified tafsir source. Consult recognised tafsir works for established context.",
    importantWords: [],
    themes: ["Qur'anic guidance", "Faith and character"],
    practicalLesson: "Choose one sincere, realistic action that reflects the ayah without treating this general reflection as a legal ruling.",
    sourceNote: "General reflection based on the Saheeh International translation; not a fatwa or formal tafsir.",
  };
}

function validInsight(value: unknown): value is Insight {
  if (!value || typeof value !== "object") return false;
  const item = value as Insight;
  return [item.simpleMeaning, item.mainMessage, item.context, item.practicalLesson, item.sourceNote].every(
    text => typeof text === "string" && text.length > 10,
  ) && Array.isArray(item.importantWords) && Array.isArray(item.themes);
}

export async function POST(request: Request) {
  const blocked = rejectOversizedRequest(request, 8_000) || rateLimit(request, "reflection-insight", 12, 60_000);
  if (blocked) return blocked;

  let body: { surah?: number; ayah?: number };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const surah = Number(body.surah);
  const ayah = Number(body.ayah);
  if (!Number.isInteger(surah) || surah < 1 || surah > 114 || !Number.isInteger(ayah) || ayah < 1 || ayah > 286) {
    return NextResponse.json({ error: "A valid surah and ayah are required." }, { status: 400 });
  }

  try {
    const [{ arabic, translation }, tafsir] = await Promise.all([
      fetchVerifiedAyah(surah, ayah),
      fetchTafsir(surah, ayah),
    ]);
    const fallback = safeFallback(translation, Boolean(tafsir));
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ insight: fallback, source: "safe-general-reflection" });

    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: "You are a careful Islamic educational editor. Produce general reflection, not a fatwa. Never alter or reproduce the Arabic. Never invent history, hadith, rulings, spiritual diagnoses, guaranteed results, or claims made on behalf of Allah. Use supplied tafsir only for context and explicitly distinguish established tafsir from general reflection. Avoid sectarian or political arguments. Return JSON only." }] },
          contents: [{ role: "user", parts: [{ text: `Quran ${surah}:${ayah}\nVerified translation (Saheeh International): ${translation}\nVerified Arabic is supplied only to identify words; do not output or alter it: ${arabic}\nRecognised tafsir excerpt (Ibn Kathir; may be unavailable): ${tafsir || "Not available"}\n\nReturn JSON with simpleMeaning, mainMessage, context, importantWords (maximum 4 objects with word and meaning), themes (maximum 4 strings), practicalLesson, sourceNote. Keep each section concise. If context is not explicit in the excerpt, say that established historical context was not identified. sourceNote must state which content is general reflection and whether Ibn Kathir was consulted.` }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 1000, responseMimeType: "application/json" },
        }),
      },
    );
    if (!response.ok) return NextResponse.json({ insight: fallback, source: "safe-general-reflection" });
    const payload = await response.json();
    const text = payload.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || "").join("") || "";
    const parsed = JSON.parse(text);
    return NextResponse.json({ insight: validInsight(parsed) ? parsed : fallback, source: validInsight(parsed) ? "grounded-study-notes" : "safe-general-reflection" });
  } catch (error) {
    console.error("Reflection insight error:", error);
    return NextResponse.json({ error: "Educational notes are temporarily unavailable." }, { status: 502 });
  }
}
