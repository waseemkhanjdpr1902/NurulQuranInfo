import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function extractTafsirText(data: any) {
  return (
    data?.text ||
    data?.tafsirs?.[0]?.text ||
    data?.tafsir?.text ||
    data?.verse?.tafsirs?.[0]?.text ||
    null
  );
}

function plainText(value: string) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const verseKey = searchParams.get("verse_key");

  if (!verseKey || !/^\d{1,3}:\d{1,3}$/.test(verseKey)) {
    return NextResponse.json({ error: "A valid verse_key is required." }, { status: 400 });
  }

  const [chapter, verse] = verseKey.split(":");
  const endpoints = [
    `https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/en-tafisr-ibn-kathir/${chapter}/${verse}.json`,
    `https://api.quran.com/api/v4/quran/tafsirs/169?verse_key=${encodeURIComponent(verseKey)}`,
    `https://api.quran.com/api/v4/verses/by_key/${encodeURIComponent(verseKey)}?tafsirs=169`,
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        headers: {
          Accept: "application/json",
          "User-Agent": "NurulQuranInfo/1.0",
        },
        next: { revalidate: 60 * 60 * 24 },
      });

      if (!response.ok) continue;

      const data = await response.json();
      const text = extractTafsirText(data);

      if (text) {
        return NextResponse.json({ text: plainText(String(text)) });
      }
    } catch (error) {
      console.error("Tafsir fetch failed:", error);
    }
  }

  return NextResponse.json(
    { error: "Tafsir Ibn Kathir was not found for this verse." },
    { status: 404 }
  );
}
