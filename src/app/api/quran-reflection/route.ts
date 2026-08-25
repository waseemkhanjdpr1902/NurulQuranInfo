import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_BASE = "https://api.alquran.cloud/v1";
const EDITIONS = "quran-uthmani,en.sahih,hi.hindi,ur.jalandhry,en.transliteration,ar.alafasy";

async function quranFetch(path: string) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json", "User-Agent": "NurulQuranInfo/1.0" },
    next: { revalidate: 60 * 60 * 24 },
  });
  if (!response.ok) throw new Error(`Quran source returned ${response.status}`);
  const payload = await response.json();
  if (payload.code !== 200) throw new Error(payload.status || "Quran source request failed");
  return payload.data;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") || "surahs";

  try {
    if (mode === "surahs") {
      const data = await quranFetch("/surah");
      return NextResponse.json({
        source: "AlQuran Cloud",
        surahs: data.map((surah: Record<string, unknown>) => ({
          number: surah.number,
          name: surah.name,
          englishName: surah.englishName,
          englishNameTranslation: surah.englishNameTranslation,
          numberOfAyahs: surah.numberOfAyahs,
        })),
      });
    }

    if (mode === "search") {
      const keyword = (searchParams.get("q") || "").trim();
      if (keyword.length < 2 || keyword.length > 80) {
        return NextResponse.json({ error: "Enter 2 to 80 characters to search." }, { status: 400 });
      }
      const data = await quranFetch(`/search/${encodeURIComponent(keyword)}/all/en.sahih`);
      return NextResponse.json({
        source: "Saheeh International via AlQuran Cloud",
        results: data.matches.slice(0, 30).map((match: Record<string, any>) => ({
          surahNumber: match.surah.number,
          surahName: match.surah.englishName,
          ayahNumber: match.numberInSurah,
          translation: match.text,
        })),
      });
    }

    const surah = Number(searchParams.get("surah"));
    const ayah = Number(searchParams.get("ayah"));
    if (!Number.isInteger(surah) || surah < 1 || surah > 114 || !Number.isInteger(ayah) || ayah < 1 || ayah > 286) {
      return NextResponse.json({ error: "A valid surah and ayah are required." }, { status: 400 });
    }

    const data = await quranFetch(`/ayah/${surah}:${ayah}/editions/${EDITIONS}`);
    if (!Array.isArray(data) || data.length !== 6) throw new Error("The verified ayah source returned incomplete data.");
    const [arabic, english, hindi, urdu, transliteration, audio] = data;

    return NextResponse.json({
      source: "AlQuran Cloud",
      ayah: {
        surahNumber: arabic.surah.number,
        surahName: arabic.surah.englishName,
        surahArabicName: arabic.surah.name,
        ayahNumber: arabic.numberInSurah,
        globalNumber: arabic.number,
        arabic: String(arabic.text).replace(/^\uFEFF/, ""),
        english: english.text,
        hindi: hindi.text,
        urdu: urdu.text,
        transliteration: transliteration.text,
        audioUrl: audio.audio,
        editions: {
          arabic: "Quran Uthmani",
          english: "Saheeh International",
          hindi: hindi.edition.englishName || hindi.edition.name,
          urdu: urdu.edition.englishName || urdu.edition.name,
          audio: audio.edition.englishName || audio.edition.name,
        },
      },
    });
  } catch (error) {
    console.error("Quran reflection source error:", error);
    return NextResponse.json(
      { error: "The verified Quran source is temporarily unavailable. Please try again." },
      { status: 502 },
    );
  }
}
