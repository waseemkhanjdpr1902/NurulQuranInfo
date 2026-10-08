"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, Headphones, BookOpen, Loader2 } from "lucide-react";
import { motion } from "motion/react";
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

import { URDU_AUDIO_SURAHS, urduAudioUrl, type AudioPhase } from "@/lib/quran-audio";
import AudioPlayer from "@/components/AudioPlayer/AudioPlayer";
import { useQuranJourney } from "@/hooks/useQuranJourney";
import { surahSlug } from "@/lib/quran-journey";
import InlineTafsir from "@/components/InlineTafsir";
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
  const [tafsirLanguage, setTafsirLanguage] = useState<TafsirLanguage>("en");

  const [audioMode, setAudioMode] = useState<"arabic" | "arabic-urdu">("arabic-urdu");
  const [audioPhase, setAudioPhase] = useState<AudioPhase>("arabic");
  const urduAudioAvailable = Boolean(URDU_AUDIO_SURAHS[surah.number]);

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [playbackRequest, setPlaybackRequest] = useState(0);

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
    } else if (audioMode === "arabic-urdu") {
      // Complete the surah before the reader chooses the next one.
      setAudioUrl(null);
      setPlayingVerseId(null);
      setIsAudioPlaying(false);
    } else if (nextSlug) {
      router.push(`/quran/${nextSlug}?autoplay=true`);
    }
  }, [playingVerseId, verses, playVerse, nextSlug, router, audioMode]);

  const playPrevVerse = useCallback(() => {
    if (playingVerseId === null) return;
    const currentIndex = verses.findIndex(v => v.id === playingVerseId);
    if (currentIndex !== -1 && currentIndex > 0) {
      playVerse(verses[currentIndex - 1]);
    } else if (prevSlug) {
      router.push(`/quran/${prevSlug}`);
    }
  }, [playingVerseId, verses, playVerse, prevSlug, router]);

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
      <SurahNavigation prevSlug={prevSlug} nextSlug={nextSlug} />
      {/* Reciter Selection & Info */}
      <div className="mb-10 flex flex-col items-stretch justify-between gap-5 rounded-3xl border-2 border-gold/25 bg-[#e7f3ee] p-4 shadow-[0_16px_40px_rgba(13,102,88,0.12)] sm:p-6 md:mb-12 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="w-full">
            <label className="flex flex-col gap-2 text-sm font-semibold text-[#0d6658]">Listening mode
              <select aria-label="Listening mode" value={audioMode} onChange={event => {
                const next = event.target.value === "arabic-urdu" && urduAudioAvailable ? "arabic-urdu" : "arabic";
                setAudioMode(next);
                // Mode changes stop playback so a paused ayah never starts unexpectedly.
                setAudioUrl(null); setPlayingVerseId(null); setIsAudioPlaying(false); setAudioPhase("arabic");
                if (next === "arabic-urdu") { setTranslationLanguage("ur"); localStorage.setItem("nurulquran.translation-language", "ur"); }
              }} className="min-h-11 max-w-full rounded-xl border-2 border-gold/40 bg-white px-3 text-sm text-parchment">
                <option value="arabic">Arabic only</option>
                <option value="arabic-urdu" disabled={!urduAudioAvailable}>Arabic tilawat + Urdu tarjuma{!urduAudioAvailable ? " — unavailable" : ""}</option>
              </select>
            </label>
            <p className="mt-2 text-xs text-parchment/70">Urdu translation audio available for all 114 surahs. Narration: Shamshad Ali Khan, via <a href="https://everyayah.com/recitations_ayat.html" target="_blank" rel="noreferrer" className="underline">EveryAyah</a>. Written Urdu: Fateh Muhammad Jalandhry.</p>
          </div>
          <label className="flex min-w-0 flex-col gap-2 text-[10px] font-bold uppercase tracking-wider text-parchment/70 sm:flex-row sm:items-center">Translation
            <select value={translationLanguage} onChange={event => { const value = event.target.value as "en" | "hi" | "ur"; setTranslationLanguage(value); localStorage.setItem("nurulquran.translation-language", value); }} className="min-h-11 w-full min-w-0 rounded-xl border-2 border-gold/40 bg-white px-3 text-sm font-semibold normal-case tracking-normal text-parchment shadow-sm sm:w-auto">
              <option value="en">English — Saheeh International</option><option value="hi">हिंदी — Farooq Khan & Nadwi</option><option value="ur">اردو — Fateh Muhammad Jalandhry</option>
            </select>
          </label>
          <label className="flex min-w-0 flex-col gap-2 text-[10px] font-bold uppercase tracking-wider text-parchment/70 sm:flex-row sm:items-center">Tafsir language
            <select aria-label="Tafsir language" value={tafsirLanguage} onChange={event => {
              if (!isTafsirLanguage(event.target.value)) return;
              setTafsirLanguage(event.target.value);
              localStorage.setItem("nurulquran.tafsir-language", event.target.value);
            }} className="min-h-11 max-w-full rounded-xl border-2 border-gold/40 bg-white px-3 text-sm font-semibold normal-case tracking-normal text-parchment">
              {(Object.keys(TAFSIR_EDITIONS) as TafsirLanguage[]).map(language => <option key={language} value={language}>{TAFSIR_EDITIONS[language].label}</option>)}
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
        </div>
      </div>

      {/* Verses List */}
      <div className="space-y-8">
        {verses.map((verse, index) => (
          <motion.div 
            key={verse.id} 
            id={`verse-${verse.verse_number}`}
            role="article"
            aria-label={`Ayah ${surah.number}:${verse.verse_number}`}
            aria-current={playingVerseId === verse.id ? "true" : undefined}
            tabIndex={-1}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`group relative scroll-mt-32 rounded-3xl p-4 transition-all duration-700 sm:p-6 md:p-8 ${playingVerseId === verse.id ? 'border-2 border-[#0d6658] bg-[#d9eee6] shadow-md' : 'hover:bg-gold/5'}`}
            onClick={() => recordMeaningfulRead(verse)}
            onFocusCapture={() => recordMeaningfulRead(verse)}
          >
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#0d6658]">
              Ayah {surah.number}:{verse.verse_number}
              {playingVerseId === verse.id && isAudioPlaying && <span className="rounded-full bg-gold/10 px-2 py-1 text-xs">{audioPhase === "urdu" ? "Urdu translation" : "Arabic tilawat"}</span>}

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
            <InlineTafsir verseKey={`${surah.number}:${verse.verse_number}`} language={tafsirLanguage} />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <button type="button" onClick={event => { event.stopPropagation(); playVerse(verse); }} className="flex min-h-12 items-center gap-2 rounded-2xl border border-gold/30 bg-white px-4 text-sm font-semibold text-[#0d6658] hover:bg-[#d9eee6]" aria-label={`Listen from ayah ${surah.number}:${verse.verse_number}`}>
                <Headphones size={18} aria-hidden="true" /> Listen from here
              </button>
            {index < verses.length - 1 ? (
              <button type="button" aria-label={`Go to ayah ${surah.number}:${verses[index + 1].verse_number}`} onClick={event => {
                event.stopPropagation();
                const nextAyah = document.getElementById(`verse-${verses[index + 1].verse_number}`);
                nextAyah?.focus({ preventScroll: true });
                nextAyah?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
              }} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-gold/30 bg-white px-4 text-sm font-semibold text-[#0d6658] hover:bg-[#d9eee6]">
                Next ayah <ArrowDown size={18} aria-hidden="true" />
              </button>
            ) : null}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 mb-80 md:mb-64"><SurahNavigation prevSlug={prevSlug} nextSlug={nextSlug} /></div>

      {/* One recitation control, available before playback starts. */}
      <AudioPlayer
        audioUrl={audioUrl}
        translationAudioUrl={audioMode === "arabic-urdu" && playingVerseId ? urduAudioUrl(surah.number, verses.find(verse => verse.id === playingVerseId)?.verse_number || 0) : null}
        onPhaseChange={setAudioPhase}
        playbackRequest={playbackRequest}
        title={surah.englishName}
        subtitle={`${playingVerseId ? `Ayah ${verses.find(verse => verse.id === playingVerseId)?.verse_number} · ` : ""}${RECITERS.find(reciter => reciter.id === reciterId)?.name || ""}`}
        onPlayRequest={() => { if (verses[0]) playVerse(verses[0]); }}
        onNext={playNextVerse}
        onPrev={playPrevVerse}
        onPlayStateChange={setIsAudioPlaying}
        onStop={() => { setAudioUrl(null); setPlayingVerseId(null); setIsAudioPlaying(false); }}
      />

    </div>
  );
}

function SurahNavigation({ prevSlug, nextSlug }: { prevSlug?: string | null; nextSlug?: string | null }) {
  const linkClass = "flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-gold/30 bg-white px-4 text-sm font-semibold text-[#0d6658] hover:bg-[#d9eee6]";
  return <nav aria-label="Surah navigation" className="mb-6 grid grid-cols-2 gap-3">
    {prevSlug ? <Link href={`/quran/${prevSlug}`} className={linkClass}><ArrowLeft size={18} aria-hidden="true" /> Previous surah</Link>
      : <span aria-disabled="true" className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-gold/15 px-4 text-sm text-parchment/50"><ArrowLeft size={18} aria-hidden="true" /> Previous surah</span>}
    <Link href={nextSlug ? `/quran/${nextSlug}` : "/quran"} className={linkClass}>{nextSlug ? "Next surah" : "All surahs"} <ArrowRight size={18} aria-hidden="true" /></Link>
  </nav>;
}
