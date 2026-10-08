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

    // The greeting is UI text, not conversation history. Gemini history starts with a user.
    const firstUser = cleanMessages.findIndex((message) => message.role === "user");
    const conversation = cleanMessages.slice(firstUser);
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (apiKey) {
      try {
        const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({
          model: process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash",
          systemInstruction: instructions[intent],
        });
        const response = await model.generateContent({
          contents: conversation.map(message => ({ role: message.role, parts: [{ text: message.content }] })),
        }, { timeout: 8000 });
        const text = response.response.text()?.trim();
        if (text) return NextResponse.json({ text, source: "gemini" });
      } catch {
        console.warn("Gemini unavailable; trying alternate study provider.");
      }
    }

    const groqKey = process.env.GROQ_API_KEY?.trim();
    if (groqKey) {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${groqKey}`, "Content-Type": "application/json" },
        signal: AbortSignal.timeout(20_000),
        body: JSON.stringify({
          model: process.env.GROQ_MODEL?.trim() || "openai/gpt-oss-120b",
          temperature: 0.2,
          max_completion_tokens: 2400,
          messages: [
            { role: "system", content: instructions[intent] + " Reply in the user's language. Do not generate Arabic Quran verse text from memory; give surah and ayah references and encourage checking the original." },
            ...conversation.map(message => ({ role: message.role === "model" ? "assistant" : "user", content: message.content })),
          ],
        }),
      });
      if (!response.ok) {
        const error = response.status === 429 ? "The AI service is busy. Please try again shortly."
          : response.status === 401 || response.status === 403 ? "The alternate AI provider needs its API key or permissions checked."
          : "The AI study guide is temporarily unavailable. Please try again shortly.";
        console.warn("Alternate study provider failed", { status: response.status });
        return NextResponse.json({ error }, { status: 503 });
      }
      const data = await response.json();
      const text = data.choices?.[0]?.message?.content?.trim();
      if (text) return NextResponse.json({ text, source: "groq" });
    }
    return NextResponse.json({ error: fallback(intent) }, { status: 503 });
  } catch (error) {
    const providerStatus = typeof error === "object" && error !== null && "status" in error ? Number(error.status) : 0;
    const details = error instanceof Error ? error.message.toLowerCase() : "";
    // Classify provider failures without exposing its raw message or credentials.
    const reason = /leaked|reported as leaked/.test(details) ? "blocked_key"
      : /api key not valid|api_key_invalid|invalid api key|expired/.test(details) ? "invalid_key"
      : /api.*not.*enabled|has not been used|service_disabled/.test(details) ? "disabled_api"
      : /quota|resource_exhausted/.test(details) ? "quota"
      : /not found|not supported.*generatecontent/.test(details) ? "model"
      : providerStatus === 403 ? "access_denied"
      : providerStatus === 400 ? "invalid_request" : "unavailable";
    console.error("AI chat failed", { providerStatus, reason });
    const configurationErrors: Record<string, string> = {
      blocked_key: "Google has blocked the website's Gemini API key. The administrator must replace it.",
      invalid_key: "The website's Gemini API key is invalid or expired. The administrator must replace it.",
      disabled_api: "The Gemini API is not enabled for the website's Google project.",
      access_denied: "Google is denying access to the website's Gemini service.",
      model: "The website's configured Gemini model is unavailable.",
      quota: "The website's Gemini usage quota has been reached. Please try again later.",
    };
    if (configurationErrors[reason]) return NextResponse.json({ error: configurationErrors[reason], code: reason }, { status: 503 });
    const message = providerStatus === 429
      ? "The AI provider has reached its usage limit. Please try again later."
      : providerStatus === 400 || providerStatus === 401 || providerStatus === 403
        ? "The AI service needs its provider configuration checked. Please contact the website administrator."
        : providerStatus === 404
          ? "The configured AI model is unavailable. Please contact the website administrator."
          : "The AI study guide is temporarily unavailable. Please try again shortly.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
