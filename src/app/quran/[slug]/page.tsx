import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuranReader from "@/components/QuranReader";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

async function getSurahData(slug: string) {
  try {
    const res = await fetch("https://api.alquran.cloud/v1/surah");
    if (!res.ok) throw new Error("Failed to fetch chapters");
    const data = await res.json();
    const chapters = data.data;
    
    if (!chapters || !Array.isArray(chapters)) return null;

    const chapterIndex = chapters.findIndex((c: any) => 
      c.englishName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === slug
    );
    
    if (chapterIndex === -1) return null;

    const chapter = chapters[chapterIndex];
    const prevChapter = chapters[chapterIndex - 1];
    const nextChapter = chapters[chapterIndex + 1];

    const getSlug = (c: any) => c.englishName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    return {
      number: chapter.number,
      name: chapter.name,
      englishName: chapter.englishName,
      englishNameTranslation: chapter.englishNameTranslation,
      numberOfAyahs: chapter.numberOfAyahs,
      revelationType: chapter.revelationType,
      slug: slug,
      prevSlug: prevChapter ? getSlug(prevChapter) : null,
      nextSlug: nextChapter ? getSlug(nextChapter) : null,
    };
  } catch (error) {
    console.error("Error fetching surah data:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const surah = await getSurahData(slug);

  if (!surah) {
    return {
      title: "Surah Not Found",
    };
  }

  return {
    title: `Surah ${surah.englishName} (${surah.name})`,
    description: `Read Surah ${surah.englishName}, ${surah.englishNameTranslation}, with Arabic text, English translation, tafsir study, and working audio recitation.`,
    alternates: {
      canonical: `/quran/${slug}`,
    },
    openGraph: {
      title: `Surah ${surah.englishName} | NurulQuran.info`,
      description: `Read and listen to Surah ${surah.englishName} on NurulQuran.info.`,
      url: `/quran/${slug}`,
      type: "article",
    },
  };
}

export default async function SurahPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ autoplay?: string }>;
}) {
  const { slug } = await params;
  const { autoplay } = await searchParams;
  const surah = await getSurahData(slug);

  if (!surah) notFound();

  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      
      {/* Surah Header */}
      <section className="pt-40 pb-20 px-6 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gold/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-4 mb-8">
            {surah.prevSlug ? (
              <Link href={`/quran/${surah.prevSlug}`} className="w-10 h-10 rounded-full glass flex items-center justify-center text-parchment/50 hover:text-gold transition-colors">
                <ChevronLeft size={20} />
              </Link>
            ) : (
              <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-parchment/10 cursor-not-allowed">
                <ChevronLeft size={20} />
              </div>
            )}
            
            <div className="px-6 py-2 glass rounded-full text-gold text-xs font-bold uppercase tracking-widest">
              Surah {surah.number}
            </div>

            {surah.nextSlug ? (
              <Link href={`/quran/${surah.nextSlug}`} className="w-10 h-10 rounded-full glass flex items-center justify-center text-parchment/50 hover:text-gold transition-colors">
                <ChevronRight size={20} />
              </Link>
            ) : (
              <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-parchment/10 cursor-not-allowed">
                <ChevronRight size={20} />
              </div>
            )}
          </div>

          <h1 className="text-6xl md:text-8xl font-display text-parchment mb-4">{surah.englishName}</h1>
          <p className="text-gold font-arabic text-4xl mb-8">{surah.name}</p>
          
          <div className="flex flex-wrap items-center justify-center gap-8 text-parchment/40 text-xs uppercase tracking-[0.2em]">
            <span>{surah.englishNameTranslation}</span>
            <span>•</span>
            <span>{surah.numberOfAyahs} Verses</span>
            <span>•</span>
            <span>{surah.revelationType}</span>
          </div>
        </div>
      </section>

      {/* Quran Reader Section */}
      <section className="py-20 px-6">
        <QuranReader 
          surah={surah} 
          nextSlug={surah.nextSlug} 
          prevSlug={surah.prevSlug} 
          autoplay={autoplay === 'true'}
        />
      </section>

      <Footer />
    </main>
  );
}
