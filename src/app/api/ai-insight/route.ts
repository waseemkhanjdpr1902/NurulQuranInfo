import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured." },
        { status: 500 }
      );
    }

    const { surahName, surahNumber, verseNumber, arabic, translation } = await request.json();

    if (!surahName || !surahNumber || !verseNumber || !arabic || !translation) {
      return NextResponse.json(
        { error: "Verse details are required for AI insight." },
        { status: 400 }
      );
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
    });
  } catch (error) {
    console.error("AI insight failed:", error);
    return NextResponse.json(
      { error: "Unable to generate AI insight right now." },
      { status: 500 }
    );
  }
}
