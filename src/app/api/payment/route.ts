import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await req.text();

  return NextResponse.json(
    {
      error: "This payment endpoint is deprecated. Use /api/donation for Buy Me a Coffee support.",
    },
    { status: 410 }
  );
}
