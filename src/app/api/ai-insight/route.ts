import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function fallbackInsight({
  surahName,
  surahNumber,
  verseNumber,
  translation,
}: {
  surahName: string;
  surahNumber: number;
  verseNumber: number;
  translation: string;
}) {
  return `Study notes for Surah ${surahName} (${surahNumber}:${verseNumber})

Core meaning
${translation}

Spiritual reflection
This ayah invites the reader to pause, receive the verse with humility, and connect its meaning to worship, character, and daily choices.

Practical lesson
Read the ayah slowly, repeat it with attention, and choose one action today that reflects its guidance.

Hadith connection
When an authenticated hadith connection is not certain, it is better to avoid unsupported citations. Use this note as a study starting point and consult a qualified scholar or classical tafsir for rulings.`;
}

export async function POST(request: Request) {
  let verseDetails: {
    surahName: string;
    surahNumber: number;
    verseNumber: number;
    arabic: string;
    translation: string;
  };

  try {
    verseDetails = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Verse details are required for AI insight." },
      { status: 400 }
    );
  }

  const { surahName, surahNumber, verseNumber, arabic, translation } = verseDetails;

  if (!surahName || !surahNumber || !verseNumber || !arabic || !translation) {
    return NextResponse.json(
      { error: "Verse details are required for AI insight." },
      { status: 400 }
    );
  }

  const fallback = () =>
    NextResponse.json({
      text: fallbackInsight({ surahName, surahNumber, verseNumber, translation }),
      source: "fallback",
    });

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return fallback();
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction:
        "You are a careful Islamic study assistant. Explain Quranic verses respectfully, avoid unsupported rulings, and include relevant context in clear English.",
    });

    const response = await model.generateContent(
      `Provide concise tafsir-style study notes for Quran ${surahName} (${surahNumber}:${verseNumber}).

Arabic:
${arabic}

Translation:
${translation}

Include:
1. Core meaning
2. Spiritual reflection
3. Practical lesson
4. Any relevant hadith connection only when you are confident`
    );

    return NextResponse.json({
      text: response.response.text() || "Insight unavailable at the moment.",
      source: "gemini",
    });
  } catch (error) {
    console.error("AI insight failed:", error);
    return fallback();
  }
}
