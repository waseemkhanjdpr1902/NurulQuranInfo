import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuranReader from "@/components/QuranReader";
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
      <section className="relative overflow-hidden border-b border-gold/10 px-4 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-36 md:pb-20 md:pt-40">
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

          <h1 className="mb-4 break-words font-display text-4xl text-parchment sm:text-6xl md:text-8xl">{surah.englishName}</h1>
          <p className="mb-8 font-arabic text-3xl text-gold sm:text-4xl">{surah.name}</p>
          
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-[10px] uppercase tracking-[0.15em] text-parchment/65 sm:gap-8 sm:text-xs sm:tracking-[0.2em]">
            <span>{surah.englishNameTranslation}</span>
            <span>•</span>
            <span>{surah.numberOfAyahs} Verses</span>
            <span>•</span>
            <span>{surah.revelationType}</span>
          </div>
        </div>
      </section>

      {/* Quran Reader Section */}
      <section className="px-3 py-10 sm:px-6 sm:py-16 md:py-20">
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
