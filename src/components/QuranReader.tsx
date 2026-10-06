"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowDown, ArrowRight, Headphones, MoreHorizontal, BookOpen, Info, Loader2, CheckCircle2, Copy, Share2, X, Heart, Sparkles, Bookmark, StickyNote, FolderPlus, Flag, Download } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Verse {
  id: number;
  verse_number: number;
  text_uthmani: string;
  translation: string;
  hindi_translation: string;
  urdu_translation: string;
  audio_url?: string;
}

const RECITERS = [
  { id: "ar.alafasy", name: "Mishary Rashid Alafasy" },
  { id: "ar.abdulsamad", name: "AbdulBaset AbdulSamad" },
  { id: "ar.abdurrahmaansudais", name: "Abdur-Rahman as-Sudais" },
  { id: "ar.shaatree", name: "Abu Bakr Ash-Shaatree" },
  { id: "ar.hanirifai", name: "Hani ar-Rifai" },
  { id: "ar.husary", name: "Mahmoud Al-Husary" },
  { id: "ar.abdullahbasfar", name: "Abdullah Basfar" },
  { id: "ar.ahmedajamy", name: "Ahmed ibn Ali al-Ajamy" },
  { id: "ar.hudhaify", name: "Ali al-Hudhaify" },
  { id: "ar.ibrahimakhbar", name: "Ibrahim Akhdar" },
  { id: "ar.mahermuaiqly", name: "Maher Al Muaiqly" },
  { id: "ar.muhammadayyoub", name: "Muhammad Ayyoub" },
  { id: "ar.muhammadjibreel", name: "Muhammad Jibreel" },
  { id: "ar.saoodshuraym", name: "Saood Ash-Shuraym" },
  { id: "ar.aymanswoaid", name: "Ayman Sowaid" },
  { id: "ar.parhizgar", name: "Shahriar Parhizgar" },
];

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

import AudioPlayer from "@/components/AudioPlayer/AudioPlayer";
import { useQuranJourney } from "@/hooks/useQuranJourney";
import { surahSlug } from "@/lib/quran-journey";
import { downloadAyahCard } from "@/lib/ayah-card";
import { TAFSIR_EDITIONS, isTafsirLanguage, type TafsirLanguage } from "@/lib/tafsir-editions";

export default function QuranReader({ 
  surah, 
  nextSlug, 
  prevSlug,
  autoplay = false
}: { 
  surah: Surah; 
  nextSlug?: string | null; 
  prevSlug?: string | null;
  autoplay?: boolean;
}) {
  const router = useRouter();
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [reciterId, setReciterId] = useState("ar.alafasy");
  const [playingVerseId, setPlayingVerseId] = useState<number | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [selectedTafsir, setSelectedTafsir] = useState<Verse | null>(null);
  const [tafsirContent, setTafsirContent] = useState<string | null>(null);
  const [loadingTafsir, setLoadingTafsir] = useState(false);
  const [tafsirLanguage, setTafsirLanguage] = useState<TafsirLanguage>("en");
  const [tafsirSource, setTafsirSource] = useState<{ resourceName: string; author: string; sourceUrl: string } | null>(null);
  const [tafsirError, setTafsirError] = useState("");
  const tafsirRequest = useRef<AbortController | null>(null);
  const [showCopyToast, setShowCopyToast] = useState(false);

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [playbackRequest, setPlaybackRequest] = useState(0);

  const [activeTab, setActiveTab] = useState<"tafsir" | "hadith" | "ai">("tafsir");
  const [hadithContent, setHadithContent] = useState<{ text: string, source: string }[]>([]);
  const [loadingHadith, setLoadingHadith] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [noteVerse, setNoteVerse] = useState<Verse | null>(null);
  const [noteText, setNoteText] = useState("");
  const [collection, setCollection] = useState("Favourite Ayahs");
  const [translationLanguage, setTranslationLanguage] = useState<"en" | "hi" | "ur">("en");
  const [arabicSize, setArabicSize] = useState<"normal" | "large">("normal");
  const [relaxedArabic, setRelaxedArabic] = useState(true);
  const { data: journey, update: updateJourney } = useQuranJourney();
  const currentSlug = surahSlug(surah.englishName);

  useEffect(() => {
    const saved = localStorage.getItem("nurulquran.translation-language");
    const savedTafsir = localStorage.getItem("nurulquran.tafsir-language");
    if (isTafsirLanguage(savedTafsir)) setTafsirLanguage(savedTafsir);
    else if (isTafsirLanguage(saved)) setTafsirLanguage(saved);
    if (saved === "en" || saved === "hi" || saved === "ur") setTranslationLanguage(saved);
    if (localStorage.getItem("nurulquran.arabic-size") === "large") setArabicSize("large");
    if (localStorage.getItem("nurulquran.arabic-spacing") === "compact") setRelaxedArabic(false);
  }, []);

  useEffect(() => () => tafsirRequest.current?.abort(), []);

  const fetchTafsir = async (verse: Verse, language: TafsirLanguage = tafsirLanguage) => {
    tafsirRequest.current?.abort();
    const controller = new AbortController();
    tafsirRequest.current = controller;
    setLoadingTafsir(true);
    setTafsirContent(null);
    setTafsirSource(null);
    setTafsirError("");
    setSelectedTafsir(verse);
    setActiveTab("tafsir");
    try {
      const verseKey = `${surah.number}:${verse.verse_number}`;
      const res = await fetch(`/api/tafsir?verse_key=${encodeURIComponent(verseKey)}&language=${language}`, { signal: controller.signal });
      const data = await res.json();
      if (!res.ok || !data?.text) throw new Error(data?.error || "Failed to load tafsir. Please try again.");
      if (controller.signal.aborted) return;
      setTafsirContent(data.text);
      setTafsirSource({ resourceName: data.resourceName, author: data.author, sourceUrl: data.sourceUrl });
    } catch (error) {
      if (controller.signal.aborted) return;
      setTafsirError(error instanceof Error ? error.message : "Failed to load tafsir. Please try again.");
    } finally {
      if (!controller.signal.aborted) setLoadingTafsir(false);
    }
  };

  const fetchRelatedHadith = async (verse: Verse) => {
    setLoadingHadith(true);
    setActiveTab("hadith");
    try {
      // Basic fallback while AI generates
      setHadithContent([
        { 
          text: "The Prophet (ﷺ) said: 'The best among you are those who learn the Quran and teach it.'", 
          source: "Sahih Bukhari 5027" 
        }
      ]);
    } catch (error) {
      console.error("Error fetching hadith:", error);
    } finally {
      setLoadingHadith(false);
    }
  };

  const fetchAiInsight = async (verse: Verse) => {
    setLoadingAi(true);
    setAiInsight(null);
    setActiveTab("ai");
    try {
      const res = await fetch("/api/ai-insight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          surahName: surah.englishName,
          surahNumber: surah.number,
          verseNumber: verse.verse_number,
          arabic: verse.text_uthmani,
          translation: verse.translation,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "AI insight request failed");
      }

      setAiInsight(data?.text || "Insight unavailable at the moment.");
    } catch (error) {
      console.error("AI Insight Error:", error);
      setAiInsight("Unable to generate AI insights. Please check that the Gemini API key is configured in Vercel.");
    } finally {
      setLoadingAi(false);
    }
  };

  const recordMeaningfulRead = useCallback((verse: Verse) => {
    const now = new Date().toISOString();
    updateJourney(current => ({
      ...current,
      lastRead: { surahNumber: surah.number, surahName: surah.englishName, surahSlug: currentSlug, ayahNumber: verse.verse_number, globalAyahNumber: verse.id, reciterId, updatedAt: now },
      recentSurahs: [
        { number: surah.number, name: surah.englishName, slug: currentSlug, openedAt: now },
        ...current.recentSurahs.filter(item => item.number !== surah.number),
      ].slice(0, 8),
      completedAyahs: current.completedAyahs.includes(verse.id) ? current.completedAyahs : [...current.completedAyahs, verse.id],
    }));
  }, [currentSlug, reciterId, surah.englishName, surah.number, updateJourney]);

  const playVerse = useCallback((verse: Verse) => {
    recordMeaningfulRead(verse);
    const fallbackAudio = `https://cdn.alquran.cloud/media/audio/ayah/${reciterId}/${verse.id}`;
    const audio = verse.audio_url || fallbackAudio;
    setAudioUrl(audio.startsWith("//") ? `https:${audio}` : audio);
    setPlayingVerseId(verse.id);
    setPlaybackRequest(request => request + 1);
  }, [reciterId, recordMeaningfulRead]);

  const openNote = (verse: Verse) => {
    const existing = journey.bookmarks.find(item => item.id === `${surah.number}:${verse.verse_number}`);
    setNoteVerse(verse);
    setNoteText(existing?.note || "");
    setCollection(existing?.collection || "Personal Study");
    recordMeaningfulRead(verse);
  };

  const toggleBookmark = (verse: Verse) => {
    const id = `${surah.number}:${verse.verse_number}`;
    const exists = journey.bookmarks.some(item => item.id === id);
    updateJourney(current => ({
      ...current,
      bookmarks: exists ? current.bookmarks.filter(item => item.id !== id) : [{
        id, surahNumber: surah.number, surahName: surah.englishName, surahSlug: currentSlug,
        ayahNumber: verse.verse_number, globalAyahNumber: verse.id, arabic: verse.text_uthmani,
        english: verse.translation, hindi: verse.hindi_translation, note: "", collection: "Favourite Ayahs",
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      }, ...current.bookmarks],
    }));
    recordMeaningfulRead(verse);
  };

  const saveNote = () => {
    if (!noteVerse) return;
    const id = `${surah.number}:${noteVerse.verse_number}`;
    const now = new Date().toISOString();
    updateJourney(current => {
      const existing = current.bookmarks.find(item => item.id === id);
      const item = {
        id, surahNumber: surah.number, surahName: surah.englishName, surahSlug: currentSlug,
        ayahNumber: noteVerse.verse_number, globalAyahNumber: noteVerse.id, arabic: noteVerse.text_uthmani,
        english: noteVerse.translation, hindi: noteVerse.hindi_translation, note: noteText.trim().slice(0, 5000),
        collection: collection.trim().slice(0, 80) || "Personal Study", createdAt: existing?.createdAt || now, updatedAt: now,
      };
      return { ...current, bookmarks: [item, ...current.bookmarks.filter(bookmark => bookmark.id !== id)] };
    });
    setNoteVerse(null);
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchVerses = async () => {
      setLoading(true);
      setLoadError(false);
      try {
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/editions/quran-uthmani,en.sahih,hi.hindi,ur.jalandhry,${reciterId}`, { signal: controller.signal });
        if (!res.ok) throw new Error("Failed to fetch verses");
        const data = await res.json();
        
        const arabicVerses = data.data[0].ayahs;
        const englishVerses = data.data[1].ayahs;
        const hindiVerses = data.data[2].ayahs;
        const urduVerses = data.data[3].ayahs;
        const audioVerses = data.data[4].ayahs;
        
        const combinedVerses = arabicVerses.map((v: any, i: number) => {
          let audio = audioVerses[i].audio;
          if (audio && audio.startsWith("//")) {
            audio = `https:${audio}`;
          }
          return {
            id: v.number,
            verse_number: v.numberInSurah,
            text_uthmani: v.text,
            translation: englishVerses[i].text,
            hindi_translation: hindiVerses[i].text,
            urdu_translation: urduVerses[i].text,
            audio_url: audio,
          };
        });
        
        if (!controller.signal.aborted) setVerses(combinedVerses);
      } catch (error) {
        if (controller.signal.aborted) return;
        setLoadError(true);
        console.error("Error fetching verses:", error);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchVerses();
    return () => controller.abort();
  }, [surah.number, reciterId, retryCount]);

  useEffect(() => {
    setAudioUrl(null);
    setPlayingVerseId(null);
    setIsAudioPlaying(false);
  }, [reciterId]);

  // Handle autoplay on mount
  const hasAutoplayed = useRef(false);
  useEffect(() => {
    if (autoplay && verses.length > 0 && !loading && !hasAutoplayed.current) {
      hasAutoplayed.current = true;
      playVerse(verses[0]);
    }
  }, [autoplay, loading, verses, playVerse]);

  // Auto-scroll to playing verse
  useEffect(() => {
    if (playingVerseId) {
      const playingVerse = verses.find(v => v.id === playingVerseId);
      if (playingVerse) {
        const element = document.getElementById(`verse-${playingVerse.verse_number}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
  }, [playingVerseId, verses]);

  const playNextVerse = useCallback(() => {
    if (playingVerseId === null) return;
    const currentIndex = verses.findIndex(v => v.id === playingVerseId);
    if (currentIndex !== -1 && currentIndex < verses.length - 1) {
      playVerse(verses[currentIndex + 1]);
    } else if (nextSlug) {
      router.push(`/quran/${nextSlug}?autoplay=true`);
    }
  }, [playingVerseId, verses, playVerse, nextSlug, router]);

  const playPrevVerse = useCallback(() => {
    if (playingVerseId === null) return;
    const currentIndex = verses.findIndex(v => v.id === playingVerseId);
    if (currentIndex !== -1 && currentIndex > 0) {
      playVerse(verses[currentIndex - 1]);
    } else if (prevSlug) {
      router.push(`/quran/${prevSlug}`);
    }
  }, [playingVerseId, verses, playVerse, prevSlug, router]);

  const copyVerse = (verse: Verse) => {
    const selectedTranslation = translationLanguage === "hi" ? verse.hindi_translation : translationLanguage === "ur" ? verse.urdu_translation : verse.translation;
    const text = `${verse.text_uthmani}\n\n${selectedTranslation}\n\n(Quran ${surah.number}:${verse.verse_number})`;
    navigator.clipboard.writeText(text);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 2000);
  };

  const shareSurah = () => {
    if (navigator.share) {
      navigator.share({
        title: `Surah ${surah.englishName}`,
        text: `Read and listen to Surah ${surah.englishName} on NurulQuran`,
        url: window.location.href,
      });
    }
  };

  const shareVerse = async (verse: Verse) => {
    const selectedTranslation = translationLanguage === "hi" ? verse.hindi_translation : translationLanguage === "ur" ? verse.urdu_translation : verse.translation;
    const text = `${verse.text_uthmani}\n\n${selectedTranslation}\n\n${surah.englishName} ${surah.number}:${verse.verse_number} — NurulQuran.info`;
    if (navigator.share) await navigator.share({ title: `Qur’an ${surah.number}:${verse.verse_number}`, text, url: `${window.location.origin}/quran/${currentSlug}#verse-${verse.verse_number}` });
    else { await navigator.clipboard.writeText(text); setShowCopyToast(true); setTimeout(() => setShowCopyToast(false), 2000); }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <Loader2 className="text-gold animate-spin" size={48} />
        <p className="text-parchment/40 font-display text-xl">Loading verses...</p>
      </div>
    );
  }

  if (loadError) {
    return <div role="alert" className="rounded-3xl border border-gold/20 bg-white p-8 text-center">
      <p className="text-lg text-parchment">We couldn’t load the ayahs. Please check your connection and try again.</p>
      <button onClick={() => setRetryCount(count => count + 1)} className="mt-4 min-h-12 rounded-xl bg-gold px-6 font-semibold text-white">Try again</button>
    </div>;
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Reciter Selection & Info */}
      <div className="mb-10 flex flex-col items-stretch justify-between gap-5 rounded-3xl border-2 border-gold/25 bg-[#e7f3ee] p-4 shadow-[0_16px_40px_rgba(13,102,88,0.12)] sm:p-6 md:mb-12 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <label className="flex min-w-0 flex-col gap-2 text-[10px] font-bold uppercase tracking-wider text-parchment/70 sm:flex-row sm:items-center">Translation
            <select value={translationLanguage} onChange={event => { const value = event.target.value as "en" | "hi" | "ur"; setTranslationLanguage(value); localStorage.setItem("nurulquran.translation-language", value); }} className="min-h-11 w-full min-w-0 rounded-xl border-2 border-gold/40 bg-white px-3 text-sm font-semibold normal-case tracking-normal text-parchment shadow-sm sm:w-auto">
              <option value="en">English — Saheeh International</option><option value="hi">हिंदी — Farooq Khan & Nadwi</option><option value="ur">اردو — Fateh Muhammad Jalandhry</option>
            </select>
          </label>
          <div className="flex w-full items-center rounded-xl border-2 border-gold/30 bg-white p-1 shadow-sm sm:w-auto" aria-label="Arabic reading controls">
            <button onClick={() => { const next = arabicSize === "normal" ? "large" : "normal"; setArabicSize(next); localStorage.setItem("nurulquran.arabic-size", next); }} className="min-h-10 flex-1 rounded-lg px-3 text-xs font-bold text-[#0d6658] hover:bg-[#d9eee6] sm:flex-none" aria-pressed={arabicSize === "large"}>Arabic A+</button>
            <button onClick={() => { const next = !relaxedArabic; setRelaxedArabic(next); localStorage.setItem("nurulquran.arabic-spacing", next ? "relaxed" : "compact"); }} className="min-h-10 flex-1 rounded-lg px-3 text-xs font-bold text-[#0d6658] hover:bg-[#d9eee6] sm:flex-none" aria-pressed={relaxedArabic}>Line spacing</button>
          </div>
          <div className="w-12 h-12 rounded-2xl gold-gradient flex items-center justify-center text-ink shadow-lg">
            <BookOpen size={24} />
          </div>
          <div>
            <h4 className="text-parchment font-bold">{surah.englishName}</h4>
            <select 
              value={reciterId}
              onChange={(e) => setReciterId(e.target.value)}
              aria-label="Reciter"
              className="min-h-11 max-w-full rounded-xl border border-gold/30 bg-white px-3 text-sm text-parchment"
            >
              {RECITERS.map(r => (
                <option key={r.id} value={r.id} className="bg-ink text-parchment">{r.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:items-center lg:gap-3">
          <button
            onClick={() => updateJourney(current => ({
              ...current,
              completedSurahs: current.completedSurahs.includes(surah.number) ? current.completedSurahs.filter(number => number !== surah.number) : [...current.completedSurahs, surah.number],
              completedAyahs: current.completedSurahs.includes(surah.number) ? current.completedAyahs.filter(id => !verses.some(verse => verse.id === id)) : [...new Set([...current.completedAyahs, ...verses.map(verse => verse.id)])],
            }))}
            className="min-h-12 rounded-2xl border-2 border-gold/35 bg-white px-4 text-[11px] font-bold uppercase tracking-wider text-[#0d6658] shadow-sm hover:border-gold hover:bg-[#d9eee6]"
          >
            {journey.completedSurahs.includes(surah.number) ? "Undo completed" : "Mark surah completed"}
          </button>
          <button 
            onClick={shareSurah}
            className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border-2 border-gold/35 bg-white px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0d6658] shadow-sm transition-all hover:border-gold hover:bg-[#d9eee6]"
          >
            <Share2 size={14} /> Share Surah
          </button>
        </div>
      </div>

      {/* Verses List */}
      <div className="mb-80 space-y-8 md:mb-64">
        {verses.map((verse, index) => (
          <motion.div 
            key={verse.id} 
            id={`verse-${verse.verse_number}`}
            role="article"
            aria-label={`Ayah ${surah.number}:${verse.verse_number}`}
            tabIndex={-1}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`group relative scroll-mt-32 rounded-3xl p-4 transition-all duration-700 sm:p-6 md:p-8 ${playingVerseId === verse.id ? 'glass bg-gold/5 border-gold/10' : 'hover:bg-gold/5'}`}
            onClick={() => recordMeaningfulRead(verse)}
            onFocusCapture={() => recordMeaningfulRead(verse)}
          >
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#0d6658]">
              Ayah {surah.number}:{verse.verse_number}
              {playingVerseId === verse.id && isAudioPlaying && <span className="rounded-full bg-gold/10 px-2 py-1 text-xs">Reciting</span>}
              {journey.bookmarks.some(item => item.id === `${surah.number}:${verse.verse_number}`) && <Bookmark size={16} aria-label="Bookmarked" fill="currentColor" />}
            </div>
            <div className="text-right mb-8">
              <p dir="rtl" lang="ar" className={`${arabicSize === "large" ? "text-4xl md:text-7xl" : "text-3xl md:text-6xl"} font-arabic text-parchment ${relaxedArabic ? "leading-[2.2]" : "leading-[1.65]"} text-right selection:bg-gold/40`}>
                {verse.text_uthmani}
              </p>
            </div>
            <div className="pl-6 md:pl-8 border-l-2 border-gold/10 group-hover:border-gold/30 transition-colors">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gold/60">{translationLanguage === "hi" ? "हिंदी — Farooq Khan & Nadwi" : translationLanguage === "ur" ? "اردو — Fateh Muhammad Jalandhry" : "English — Saheeh International"}</p>
              <p dir={translationLanguage === "ur" ? "rtl" : "ltr"} lang={translationLanguage} className="text-parchment/70 text-lg md:text-xl leading-relaxed font-light">
                {translationLanguage === "hi" ? verse.hindi_translation : translationLanguage === "ur" ? verse.urdu_translation : verse.translation}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap items-start gap-3">
            <details name="ayah-options" className="min-w-0 flex-1 rounded-2xl open:basis-full border border-gold/20 bg-white/70" onClickCapture={event => {
              if ((event.target as HTMLElement).closest("button, a")) {
                event.currentTarget.open = false;
                event.currentTarget.querySelector("summary")?.focus();
              }
            }}>
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 text-sm font-semibold text-[#0d6658] [&::-webkit-details-marker]:hidden" aria-label={`Options for ayah ${surah.number}:${verse.verse_number}`}>
                Ayah options <MoreHorizontal size={22} aria-hidden="true" />
              </summary>
              <div className="grid grid-cols-2 gap-2 border-t border-gold/15 p-3 sm:grid-cols-3">
              <button onClick={() => playVerse(verse)} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-gold/30 bg-white px-3 text-sm font-semibold text-[#0d6658] hover:bg-[#d9eee6]">
                <Headphones size={16} /> Listen from here
              </button>
              <button 
                onClick={() => copyVerse(verse)}
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-gold/30 bg-white px-3 text-sm font-semibold text-[#0d6658] transition-colors hover:border-gold hover:bg-[#d9eee6]"
              >
                <Copy size={16} /> Copy
              </button>
              <button onClick={(event) => { event.stopPropagation(); shareVerse(verse); }} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-gold/30 bg-white px-3 text-sm font-semibold text-[#0d6658] hover:border-gold hover:bg-[#d9eee6]"><Share2 size={16}/> Share</button>
              <button onClick={(event) => { event.stopPropagation(); const selected = translationLanguage === "hi" ? verse.hindi_translation : translationLanguage === "ur" ? verse.urdu_translation : verse.translation; downloadAyahCard({ arabic: verse.text_uthmani, translation: selected, reference: `${surah.englishName} · ${surah.number}:${verse.verse_number}`, filename: `quran-${surah.number}-${verse.verse_number}.png` }); }} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-gold/30 bg-white px-3 text-sm font-semibold text-[#0d6658] hover:border-gold hover:bg-[#d9eee6]"><Download size={16}/> Ayah card</button>
              <button 
                onClick={() => fetchTafsir(verse)}
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-gold/30 bg-white px-3 text-sm font-semibold text-[#0d6658] transition-colors hover:border-gold hover:bg-[#d9eee6]"
              >
                <Info size={16} /> Tafsir
              </button>
              <button onClick={(event) => { event.stopPropagation(); toggleBookmark(verse); }} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-gold/30 bg-white px-3 text-sm font-semibold text-[#0d6658] hover:border-gold hover:bg-[#d9eee6]" aria-label={`${journey.bookmarks.some(item => item.id === `${surah.number}:${verse.verse_number}`) ? "Remove bookmark from" : "Bookmark"} Quran ${surah.number}:${verse.verse_number}`}>
                <Bookmark size={16} fill={journey.bookmarks.some(item => item.id === `${surah.number}:${verse.verse_number}`) ? "currentColor" : "none"}/> {journey.bookmarks.some(item => item.id === `${surah.number}:${verse.verse_number}`) ? "Saved" : "Bookmark"}
              </button>
              <button onClick={(event) => { event.stopPropagation(); openNote(verse); }} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-gold/30 bg-white px-3 text-sm font-semibold text-[#0d6658] hover:border-gold hover:bg-[#d9eee6]"><StickyNote size={16}/> Note / collection</button>
              <a href={`/quran/${currentSlug}#verse-${verse.verse_number}`} onClick={event => event.stopPropagation()} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-gold/30 bg-white px-3 text-sm font-semibold text-[#0d6658] hover:border-gold hover:bg-[#d9eee6]"><BookOpen size={16}/> Context</a>
              <a href={`mailto:contact@nurulquran.info?subject=${encodeURIComponent(`Quran display issue ${surah.number}:${verse.verse_number}`)}`} onClick={event => event.stopPropagation()} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-gold/30 bg-white px-3 text-sm font-semibold text-[#0d6658] hover:border-gold hover:bg-[#d9eee6]"><Flag size={16}/> Report issue</a>
            </div>
            </details>
            {index < verses.length - 1 ? (
              <button type="button" aria-label={`Go to ayah ${surah.number}:${verses[index + 1].verse_number}`} onClick={event => {
                event.stopPropagation();
                const nextAyah = document.getElementById(`verse-${verses[index + 1].verse_number}`);
                nextAyah?.focus({ preventScroll: true });
                nextAyah?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
              }} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-gold/30 bg-white px-4 text-sm font-semibold text-[#0d6658] hover:bg-[#d9eee6]">
                Next ayah <ArrowDown size={18} aria-hidden="true" />
              </button>
            ) : (
              <Link href={nextSlug ? `/quran/${nextSlug}` : "/quran"} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-gold/30 bg-white px-4 text-sm font-semibold text-[#0d6658] hover:bg-[#d9eee6]">
                {nextSlug ? "Next surah" : "All surahs"} <ArrowRight size={18} aria-hidden="true" />
              </Link>
            )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* One recitation control, available before playback starts. */}
      <AudioPlayer
        audioUrl={audioUrl}
        playbackRequest={playbackRequest}
        title={surah.englishName}
        subtitle={`${playingVerseId ? `Ayah ${verses.find(verse => verse.id === playingVerseId)?.verse_number} · ` : ""}${RECITERS.find(reciter => reciter.id === reciterId)?.name || ""}`}
        onPlayRequest={() => { if (verses[0]) playVerse(verses[0]); }}
        onNext={playNextVerse}
        onPrev={playPrevVerse}
        onPlayStateChange={setIsAudioPlaying}
        onStop={() => { setAudioUrl(null); setPlayingVerseId(null); setIsAudioPlaying(false); }}
      />

      {/* Copy Toast */}
      <AnimatePresence>
        {showCopyToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-gold text-ink rounded-full font-bold text-xs shadow-2xl"
          >
            Verse copied to clipboard
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {noteVerse ? <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-parchment/70 backdrop-blur-sm" onClick={() => setNoteVerse(null)} aria-label="Close private note"/>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="relative w-full max-w-xl rounded-3xl border border-gold/30 bg-ink p-6 shadow-2xl sm:p-8" role="dialog" aria-modal="true" aria-labelledby="note-title">
            <button onClick={() => setNoteVerse(null)} className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-gold text-ink" aria-label="Close"><X size={22}/></button>
            <h3 id="note-title" className="pr-12 font-display text-2xl text-parchment">Private note · {surah.englishName} {noteVerse.verse_number}</h3>
            <p className="mt-2 text-sm text-parchment/55">Only you can see this note. It is never included when sharing an ayah.</p>
            <label className="mt-6 block text-xs font-bold uppercase tracking-wider text-gold">Collection
              <input value={collection} onChange={event => setCollection(event.target.value)} list="quran-collections" maxLength={80} className="mt-2 w-full rounded-xl border border-gold/20 bg-white/60 px-4 py-3 text-parchment outline-none"/>
              <datalist id="quran-collections"><option value="Favourite Ayahs"/><option value="Duas from the Qur’an"/><option value="Patience and Hope"/><option value="Rizq and Gratitude"/><option value="Personal Study"/></datalist>
            </label>
            <label className="mt-5 block text-xs font-bold uppercase tracking-wider text-gold">Your note
              <textarea value={noteText} onChange={event => setNoteText(event.target.value)} maxLength={5000} rows={6} className="mt-2 w-full resize-y rounded-xl border border-gold/20 bg-white/60 px-4 py-3 text-base font-normal normal-case tracking-normal text-parchment outline-none" placeholder="Write your private study note…"/>
            </label>
            <button onClick={saveNote} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-gold px-5 text-sm font-bold text-ink"><FolderPlus size={17}/> Save note and collection</button>
          </motion.div>
        </div> : null}
      </AnimatePresence>

      {/* Tafsir Modal */}
      <AnimatePresence>
        {selectedTafsir && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedTafsir(null);
                setTafsirContent(null);
              }}
              className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl glass p-8 md:p-12 rounded-[40px] border-gold/20 shadow-2xl max-h-[85vh] flex flex-col"
            >
              <button 
                onClick={() => {
                  tafsirRequest.current?.abort();
                  setSelectedTafsir(null);
                  setTafsirContent(null);
                }}
                aria-label="Close tafsir study"
                className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center text-parchment/70 hover:text-gold transition-colors z-10"
              >
                <X size={24} />
              </button>
              
              <div className="overflow-y-auto pr-4 custom-scrollbar">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                  <h3 className="text-2xl font-display text-gold">Verse {selectedTafsir.verse_number} Study</h3>
                  <div className="flex gap-2 p-1 glass rounded-2xl">
                    {[
                      { id: 'tafsir', label: 'Tafsir', icon: <BookOpen size={14} />, action: () => fetchTafsir(selectedTafsir) },
                      { id: 'hadith', label: 'Hadith', icon: <Heart size={14} />, action: () => fetchRelatedHadith(selectedTafsir) },
                      { id: 'ai', label: 'AI Study', icon: <Sparkles size={14} />, action: () => fetchAiInsight(selectedTafsir) }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id as any);
                          tab.action();
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-gold text-ink' : 'text-parchment/40 hover:text-gold'}`}
                      >
                        {tab.icon} {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="glass p-6 rounded-3xl bg-white/5 border-white/5 text-right">
                    <p className="text-2xl font-arabic text-parchment leading-loose">{selectedTafsir.text_uthmani}</p>
                  </div>
                  
                  <div dir={translationLanguage === "ur" ? "rtl" : "ltr"} lang={translationLanguage}>
                    <h4 className="text-gold/60 text-[10px] uppercase tracking-widest mb-2 font-bold">{translationLanguage === "hi" ? "हिंदी अनुवाद" : translationLanguage === "ur" ? "اردو ترجمہ" : "English Sahih Translation"}</h4>
                    <p className="text-parchment/70 leading-relaxed border-l-2 border-gold/20 pl-4">{translationLanguage === "hi" ? selectedTafsir.hindi_translation : translationLanguage === "ur" ? selectedTafsir.urdu_translation : selectedTafsir.translation}</p>
                  </div>
                  
                  <div className="pt-8 border-t border-white/5">
                    {activeTab === 'tafsir' && (
                      <div>
                        <label className="mb-5 flex flex-wrap items-center gap-3 text-sm font-semibold text-parchment">Tafsir language
                          <select aria-label="Tafsir language" value={tafsirLanguage} onChange={event => {
                            const language = event.target.value;
                            if (!isTafsirLanguage(language)) return;
                            setTafsirLanguage(language);
                            localStorage.setItem("nurulquran.tafsir-language", language);
                            void fetchTafsir(selectedTafsir, language);
                          }} className="min-h-12 max-w-full rounded-xl border border-gold/30 bg-white px-4 text-parchment">
                            {(Object.keys(TAFSIR_EDITIONS) as TafsirLanguage[]).map(language => <option key={language} value={language}>{TAFSIR_EDITIONS[language].label}</option>)}
                          </select>
                        </label>
                        {loadingTafsir ? (
                          <div role="status" className="flex flex-col items-center py-12 gap-4">
                            <Loader2 className="text-gold animate-spin" size={32} />
                            <p className="text-parchment/70 text-sm">Loading {TAFSIR_EDITIONS[tafsirLanguage].name}…</p>
                          </div>
                        ) : tafsirError ? (
                          <div role="alert" className="space-y-4 text-sm text-parchment">
                            <p>{tafsirError}</p>
                            <button onClick={() => fetchTafsir(selectedTafsir)} className="min-h-11 rounded-xl bg-gold px-4 font-semibold text-white">Retry tafsir</button>
                          </div>
                        ) : (
                          <div>
                            {tafsirSource && <p className="mb-5 text-sm text-gold">
                              {tafsirSource.resourceName} · {tafsirSource.author}
                              {tafsirSource.sourceUrl && <a href={tafsirSource.sourceUrl} target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex min-h-11 items-center underline">View source</a>}
                            </p>}
                            <div lang={tafsirLanguage} dir={tafsirLanguage === "ur" ? "rtl" : "ltr"} className={`whitespace-pre-line text-parchment ${tafsirLanguage === "ur" ? "text-xl leading-loose" : "text-base leading-relaxed"}`}>
                              {tafsirContent || "Tafsir is unavailable at the moment."}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'hadith' && (
                      loadingHadith ? (
                        <div className="flex flex-col items-center py-12 gap-4">
                          <Loader2 className="text-gold animate-spin" size={32} />
                          <p className="text-parchment/30 text-xs animate-pulse">Searching Prophetic Traditions...</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                           {hadithContent.map((h, i) => (
                             <div key={i} className="glass p-8 rounded-[32px] border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-gold/20 group-hover:bg-gold transition-colors" />
                                <p className="text-parchment/70 leading-relaxed italic mb-4">&quot;{h.text}&quot;</p>
                                <div className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">— {h.source}</div>
                             </div>
                           ))}
                           <p className="text-parchment/40 text-xs italic mt-8">Note: In Study Mode, use the AI Study tab for comprehensive Hadith connections to this specific verse.</p>
                        </div>
                      )
                    )}

                    {activeTab === 'ai' && (
                      loadingAi ? (
                        <div className="flex flex-col items-center py-12 gap-4">
                          <Loader2 className="text-gold animate-spin" size={32} />
                          <Sparkles className="text-gold/20 absolute animate-ping" size={48} />
                          <p className="text-parchment/30 text-xs animate-pulse font-display italic">Gemini is synthesizing Quran & Sunnah insights...</p>
                        </div>
                      ) : (
                        <div className="glass p-10 rounded-[40px] border-gold/10 bg-gold/5">
                           <div className="flex items-center gap-3 mb-8">
                             <Sparkles className="text-gold" size={24} />
                             <h4 className="text-xl font-display text-parchment">AI Spiritual Companion</h4>
                           </div>
                           <div className="prose prose-invert prose-gold max-w-none text-parchment/80 text-base leading-relaxed space-y-4 whitespace-pre-wrap font-light">
                             {aiInsight}
                           </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
