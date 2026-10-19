import { NextResponse } from "next/server";
import { rateLimit, rejectOversizedRequest } from "@/lib/api-security";
import { websiteGuide } from "@/lib/website-guide";

export const dynamic = "force-dynamic";

// Source-based lookup only: never send questions to a generative provider.
export async function POST(request: Request) {
  const blocked = rejectOversizedRequest(request) || rateLimit(request, "ai-chat", 15, 60_000);
  if (blocked) return blocked;
  try {
    const body = await request.json();
    if (body.intent === "dawah") return NextResponse.json({error:"Dawah chat is disabled. Please use the introductory reading and references."}, {status:410});
    if (!["quran", "hadith"].includes(body.intent) || !Array.isArray(body.messages)) return NextResponse.json({error:"A supported intent and message are required."}, {status:400});
    const question = [...body.messages].reverse().find(message => message?.role === "user" && typeof message.content === "string")?.content?.trim().slice(0,4000);
    if (!question) return NextResponse.json({error:"A user message is required."}, {status:400});
    return NextResponse.json(websiteGuide(question, body.language));
  } catch {
    return NextResponse.json({error:"Please send a valid question."}, {status:400});
  }
}
