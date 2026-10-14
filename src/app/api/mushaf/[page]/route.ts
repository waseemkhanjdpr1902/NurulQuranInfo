import { mushafSourceUrl, validMushafPage } from "@/lib/mushaf";

export const runtime = "nodejs";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ page: string }> },
) {
  const page = validMushafPage((await params).page);
  if (page === null) return new Response("Invalid Mushaf page", { status: 400 });
  try {
    const upstream = await fetch(mushafSourceUrl(page), {
      signal: AbortSignal.timeout(20000),
      next: { revalidate: 86400 },
    });
    if (!upstream.ok || !upstream.headers.get("content-type")?.includes("image/png")) {
      return new Response("Mushaf page temporarily unavailable", { status: 502 });
    }
    // Forward the publisher's PNG unchanged; never reconstruct Quran text or images.
    return new Response(upstream.body, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, s-maxage=604800",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Mushaf page temporarily unavailable", { status: 502 });
  }
}
