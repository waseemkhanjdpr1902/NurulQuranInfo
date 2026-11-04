import SurahPage from "@/app/quran/[slug]/page";

export default async function ListenSurahPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ autoplay?: string }> }) {
  const search = await searchParams;
  return SurahPage({ params, searchParams: Promise.resolve({ ...search, view: "listen" }) });
}
