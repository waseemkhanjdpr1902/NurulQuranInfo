import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { rateLimit, rejectOversizedRequest } from "@/lib/api-security";

export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "model"; content: string };

const instructions = {
  quran:
    "You are a careful Quran study assistant. Be respectful, concise, and grounded in the Quran and established tafsir. Do not invent citations or issue religious rulings. Encourage consultation with a qualified scholar for personal rulings.",
  hadith:
    "You are a careful Islamic study assistant. Explain relationships between a supplied hadith and Quranic themes. Cite a verse only when confident, avoid declaring authenticity, and do not issue religious rulings.",
  dawah:
    "You are a kind Dawah study companion. Answer questions about Islam gently and clearly, using reliable Quranic evidence when confident. Avoid arguments, invented citations, and personal religious rulings.",
} as const;

function fallback(intent: keyof typeof instructions) {
  const messages = {
    quran: "The AI study guide is temporarily unavailable. You can continue reading the Quran and tafseer, and consult a qualified scholar for personal rulings.",
    hadith: "The Quran connection could not be generated safely at this time. Please use a trusted tafseer and verified hadith commentary for further study.",
    dawah: "The Dawah companion is temporarily unavailable. Please try again later or speak with a trusted local imam for personal questions.",
  };
  return messages[intent];
}

export async function POST(request: Request) {
  const blocked = rejectOversizedRequest(request) || rateLimit(request, "ai-chat", 15, 60_000);
  if (blocked) return blocked;

  try {
    const body = (await request.json()) as {
      intent?: keyof typeof instructions;
      messages?: ChatMessage[];
    };
    const intent = body.intent;
    const messages = Array.isArray(body.messages) ? body.messages.slice(-8) : [];

    if (!intent || !instructions[intent] || messages.length === 0) {
      return NextResponse.json({ error: "A supported intent and message are required." }, { status: 400 });
    }

    const cleanMessages = messages
      .filter((message) => message?.role === "user" || message?.role === "model")
      .map((message) => ({ ...message, content: String(message.content).trim().slice(0, 4000) }))
      .filter((message) => message.content);

    if (!cleanMessages.length || !cleanMessages.some((message) => message.role === "user")) {
      return NextResponse.json({ error: "A user message is required." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ text: fallback(intent), source: "fallback" });
    }

    const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      systemInstruction: instructions[intent],
    });
    const response = await model.generateContent({
      contents: cleanMessages.map((message) => ({
        role: message.role,
        parts: [{ text: message.content }],
      })),
    });

    return NextResponse.json({
      text: response.response.text() || fallback(intent),
      source: "gemini",
    });
  } catch (error) {
    console.error("AI chat failed:", error);
    return NextResponse.json({ error: "The AI study guide is temporarily unavailable." }, { status: 503 });
  }
}
