import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type AiMode = "quran-assistant" | "dawah" | "hadith-context";

const SYSTEM_INSTRUCTIONS: Record<AiMode, string> = {
  "quran-assistant":
    "You are a careful Islamic study assistant for NurulQuran. Answer Quran, tafsir, and Islamic concept questions respectfully. Keep answers concise, avoid unsupported rulings, and tell users to consult qualified scholars for personal fatwa questions.",
  dawah:
    "You are a wise and kind dawah companion. Answer questions about Islam with wisdom, evidence from Quran and Sunnah where appropriate, and a gentle tone. Keep responses scannable and avoid aggressive debate.",
  "hadith-context":
    "You are an Islamic study assistant specializing in Quran and Sunnah connections. Explain related Quranic themes for a hadith, avoid unsupported citations, and clearly separate reflection from confirmed references.",
};

function fallbackText(mode: AiMode) {
  if (mode === "dawah") {
    return "I can share a gentle study note: Islam centers on worshiping Allah alone, following the guidance of the Quran and the Prophet Muhammad (peace be upon him), and living with mercy, justice, and sincerity. For detailed personal questions, please consult a qualified local scholar.";
  }

  if (mode === "hadith-context") {
    return "Study note: this hadith can be reflected on through Quranic themes of sincerity, mercy, obedience to Allah, and excellent character. Please consult classical commentaries or a qualified scholar before drawing legal rulings from a single text.";
  }

  return "Assalamu alaikum. I can help with concise Quran study reflections. Please ask about a verse, theme, or Islamic concept, and consult qualified scholars for personal religious rulings.";
}

export async function POST(request: Request) {
  let body: { mode?: AiMode; prompt?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "A prompt is required." }, { status: 400 });
  }

  const mode = body.mode || "quran-assistant";
  const prompt = body.prompt?.trim();

  if (!SYSTEM_INSTRUCTIONS[mode] || !prompt) {
    return NextResponse.json({ error: "A valid mode and prompt are required." }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ text: fallbackText(mode), source: "fallback" });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_INSTRUCTIONS[mode],
    });

    const response = await model.generateContent(prompt);
    return NextResponse.json({
      text: response.response.text() || fallbackText(mode),
      source: "gemini",
    });
  } catch (error) {
    console.error("AI chat failed:", error);
    return NextResponse.json({ text: fallbackText(mode), source: "fallback" });
  }
}
