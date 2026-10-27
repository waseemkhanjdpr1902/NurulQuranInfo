"use client";

import { useUILanguage } from "@/components/UILanguageProvider";
import { fetchWithTimeout } from "@/lib/fetch-with-timeout";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Headphones,
  BookOpen,
  Loader2,
} from "lucide-react";
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

import {
  URDU_AUDIO_SURAHS,
  urduAudioUrl,
  type AudioPhase,
} from "@/lib/quran-audio";
import AudioPlayer from "@/components/AudioPlayer/AudioPlayer";
import { useQuranJourney } from "@/hooks/useQuranJourney";
import { surahSlug } from "@/lib/quran-journey";
import InlineTafsir from "@/components/InlineTafsir";
import {
  TAFSIR_EDITIONS,
  isTafsirLanguage,
  type TafsirLanguage,
} from "@/lib/tafsir-editions";

export default function QuranReader({
  surah,
  nextSlug,
  prevSlug,
  autoplay = false,
}: {
  surah: Surah;
  nextSlug?: string | null;
  prevSlug?: string | null;
  autoplay?: boolean;
}) {
  const { t, language } = useUILanguage();
  const router = useRouter();
  const [memorise, setMemorise] = useState(false);
  const [practiceStart, setPracticeStart] = useState(1);
  const [practiceEnd, setPracticeEnd] = useState(1);
  const [practiceRepeats, setPracticeRepeats] = useState(3);
  const [practiceGap, setPracticeGap] = useState(3);
  const [hidePracticeText, setHidePracticeText] = useState(false);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [reciterId, setReciterId] = useState("ar.alafasy");
  const [playingVerseId, setPlayingVerseId] = useState<number | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [tafsirLanguage, setTafsirLanguage] = useState<TafsirLanguage>("en");

  const [audioMode, setAudioMode] = useState<"arabic" | "arabic-urdu">(
    "arabic-urdu",
  );
  const [audioPhase, setAudioPhase] = useState<AudioPhase>("arabic");
  const urduAudioAvailable = Boolean(URDU_AUDIO_SURAHS[surah.number]);

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [playbackRequest, setPlaybackRequest] = useState(0);

  const [translationLanguage, setTranslationLanguage] = useState<
    "en" | "hi" | "ur"
  >("en");
  const [arabicSize, setArabicSize] = useState<"normal" | "large">("normal");
  const [relaxedArabic, setRelaxedArabic] = useState(true);
  const { data: journey, update: updateJourney } = useQuranJourney();
  const currentSlug = surahSlug(surah.englishName);

  useEffect(() => {
    const saved = localStorage.getItem("nurulquran.translation-language");
    const savedTafsir = localStorage.getItem("nurulquran.tafsir-language");
    if (isTafsirLanguage(savedTafsir)) setTafsirLanguage(savedTafsir);
    else if (isTafsirLanguage(saved)) setTafsirLanguage(saved);
    if (saved === "en" || saved === "hi" || saved === "ur")
      setTranslationLanguage(saved);
    if (localStorage.getItem("nurulquran.arabic-size") === "large")
      setArabicSize("large");
    if (localStorage.getItem("nurulquran.arabic-spacing") === "compact")
      setRelaxedArabic(false);
  }, []);

  useEffect(() => {
    // Interface language sets the initial translation only; an explicit reader choice is preserved.
    try {
      if (!localStorage.getItem("nurulquran.translation-language"))
        setTranslationLanguage(language);
      if (!localStorage.getItem("nurulquran.tafsir-language"))
        setTafsirLanguage(language);
    } catch {
      setTranslationLanguage(language);
    }
  }, [language]);

  const recordMeaningfulRead = useCallback(
    (verse: Verse) => {
      const now = new Date().toISOString();
      updateJourney((current) => ({
        ...current,
        lastRead: {
          surahNumber: surah.number,
          surahName: surah.englishName,
          surahSlug: currentSlug,
          ayahNumber: verse.verse_number,
          globalAyahNumber: verse.id,
          reciterId,
          updatedAt: now,
        },
        recentSurahs: [
          {
            number: surah.number,
            name: surah.englishName,
            slug: currentSlug,
            openedAt: now,
          },
          ...current.recentSurahs.filter(
            (item) => item.number !== surah.number,
          ),
        ].slice(0, 8),
        completedAyahs: current.completedAyahs.includes(verse.id)
          ? current.completedAyahs
          : [...current.completedAyahs, verse.id],
      }));
    },
    [currentSlug, reciterId, surah.englishName, surah.number, updateJourney],
  );

  const playVerse = useCallback(
    (verse: Verse) => {
      recordMeaningfulRead(verse);
      const fallbackAudio = `https://cdn.alquran.cloud/media/audio/ayah/${reciterId}/${verse.id}`;
      const audio = verse.audio_url || fallbackAudio;
      setAudioUrl(audio.startsWith("//") ? `https:${audio}` : audio);
      setPlayingVerseId(verse.id);
      setPlaybackRequest((request) => request + 1);
    },
    [reciterId, recordMeaningfulRead],
  );

  useEffect(() => {
    const controller = new AbortController();
    const fetchVerses = async () => {
      setLoading(true);
      setLoadError(false);
      try {
        const res = await fetchWithTimeout(
          `https://api.alquran.cloud/v1/surah/${surah.number}/editions/quran-uthmani,en.sahih,hi.hindi,ur.jalandhry,${reciterId}`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error("Failed to fetch verses");
        const data = await res.json();

        if (
          !Array.isArray(data.data) ||
          data.data.length !== 5 ||
          data.data.some(
            (edition: { ayahs?: unknown[] }) =>
              !Array.isArray(edition.ayahs) ||
              edition.ayahs.length !== surah.numberOfAyahs,
          )
        )
          throw new Error("Incomplete ayah data");
        const arabicVerses = data.data[0].ayahs;
        const englishVerses = data.data[1].ayahs;
        const hindiVerses = data.data[2].ayahs;
        const urduVerses = data.data[3].ayahs;
        const audioVerses = data.data[4].ayahs;

        const combinedVerses = arabicVerses.map((v: any, i: number) => {
          if (
            [
              englishVerses[i],
              hindiVerses[i],
              urduVerses[i],
              audioVerses[i],
            ].some(
              (item) =>
                item.number !== v.number ||
                item.numberInSurah !== v.numberInSurah,
            )
          )
            throw new Error("Ayah editions are not aligned");
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
  }, [surah.number, surah.numberOfAyahs, reciterId, retryCount]);

  useEffect(() => {
    setAudioUrl(null);
    setPlayingVerseId(null);
    setIsAudioPlaying(false);
    setMemorise(false);
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
      const playingVerse = verses.find((v) => v.id === playingVerseId);
      if (playingVerse) {
        const element = document.getElementById(
          `verse-${playingVerse.verse_number}`,
        );
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
  }, [playingVerseId, verses]);

  const playNextVerse = useCallback(() => {
    if (playingVerseId === null) return;
    const currentIndex = verses.findIndex((v) => v.id === playingVerseId);
    if (memorise && verses[currentIndex]?.verse_number >= practiceEnd) {
      setMemorise(false);
      setAudioUrl(null);
      setPlayingVerseId(null);
      setIsAudioPlaying(false);
      return;
    }
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
  }, [playingVerseId, verses, playVerse, nextSlug, router, audioMode, memorise, practiceEnd]);

  const playPrevVerse = useCallback(() => {
    if (playingVerseId === null) return;
    const currentIndex = verses.findIndex((v) => v.id === playingVerseId);
    if (memorise && verses[currentIndex]?.verse_number <= practiceStart) {
      playVerse(verses[practiceEnd - 1]); return;
    }
    if (currentIndex !== -1 && currentIndex > 0) {
      playVerse(verses[currentIndex - 1]);
    } else if (prevSlug) {
      router.push(`/quran/${prevSlug}`);
    }
  }, [playingVerseId, verses, playVerse, prevSlug, router, memorise, practiceStart, practiceEnd]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <Loader2 className="text-gold animate-spin" size={48} />
        <p className="text-parchment/40 font-display text-xl">
          {t("Loading ayahs…", "आयतें लोड हो रही हैं…", "آیات لوڈ ہو رہی ہیں…")}
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div
        role="alert"
        className="rounded-3xl border border-gold/20 bg-white p-8 text-center"
      >
        <p className="text-lg text-parchment">
          {t(
            "We couldn’t load the ayahs. Check your connection and retry.",
            "आयतें लोड नहीं हुईं। इंटरनेट कनेक्शन जाँचें और फिर कोशिश करें।",
            "آیات لوڈ نہیں ہوئیں۔ انٹرنیٹ کنکشن چیک کریں اور دوبارہ کوشش کریں۔",
          )}
        </p>
        <button
          onClick={() => setRetryCount((count) => count + 1)}
          className="mt-4 min-h-12 rounded-xl bg-gold px-6 font-semibold text-white"
        >
          {t("Try again", "फिर कोशिश करें", "دوبارہ کوشش کریں")}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <SurahNavigation prevSlug={prevSlug} nextSlug={nextSlug} />
      {/* Reciter Selection & Info */}
      <div className="mb-10 flex flex-col items-stretch justify-between gap-5 rounded-3xl border-2 border-gold/25 bg-[#e7f3ee] p-4 shadow-[0_16px_40px_rgba(13,102,88,0.12)] sm:p-6 md:mb-12 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="w-full">
            <div className="flex flex-col gap-2 text-sm font-semibold text-[#0d6658]">
              {t("Listening mode", "सुनने का तरीका", "سننے کا طریقہ")}
              <div
                role="group"
                aria-label={t(
                  "Listening mode",
                  "सुनने का तरीका",
                  "سننے کا طریقہ",
                )}
                className="grid grid-cols-1 gap-2 sm:grid-cols-2"
              >
                {(["arabic-urdu", "arabic"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    aria-pressed={audioMode === mode}
                    disabled={mode === "arabic-urdu" && !urduAudioAvailable}
                    onClick={() => {
                      setAudioMode(mode);
                      setAudioUrl(null);
                      setPlayingVerseId(null);
                      setIsAudioPlaying(false);
                      setAudioPhase("arabic");
                      if (mode === "arabic-urdu") {
                        setTranslationLanguage("ur");
                        localStorage.setItem(
                          "nurulquran.translation-language",
                          "ur",
                        );
                      }
                    }}
                    className={`min-h-12 rounded-xl border-2 px-4 py-3 text-sm font-semibold ${audioMode === mode ? "border-[#0d6658] bg-[#0d6658] text-white" : "border-gold/30 bg-white text-parchment"}`}
                  >
                    {mode === "arabic-urdu"
                      ? t(
                          "Arabic + Urdu translation",
                          "अरबी + उर्दू तर्जुमा",
                          "عربی + اردو ترجمہ",
                        )
                      : t("Arabic only", "केवल अरबी", "صرف عربی")}
                  </button>
                ))}
              </div>
            </div>
            <p className="mt-2 text-xs text-parchment/70">
              {t(
                "Arabic plays first, followed by Urdu for each ayah. Audio requires internet. Urdu narration: Shamshad Ali Khan, via",
                "हर आयत की अरबी तिलावत के बाद उर्दू तर्जुमा चलता है। ऑडियो के लिए इंटरनेट ज़रूरी है। उर्दू आवाज़: Shamshad Ali Khan, स्रोत",
                "ہر آیت کی عربی تلاوت کے بعد اردو ترجمہ چلتا ہے۔ آڈیو کے لیے انٹرنیٹ ضروری ہے۔ اردو آواز: Shamshad Ali Khan، ماخذ",
              )}{" "}
              <a
                href="https://everyayah.com/recitations_ayat.html"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                EveryAyah
              </a>
              .{" "}
              {t(
                "Written Urdu: Fateh Muhammad Jalandhry.",
                "लिखित उर्दू: Fateh Muhammad Jalandhry.",
                "تحریری اردو: Fateh Muhammad Jalandhry.",
              )}
            </p>
          </div>
          <label className="flex min-w-0 flex-col gap-2 text-[10px] font-bold uppercase tracking-wider text-parchment/70 sm:flex-row sm:items-center">
            {t("Written translation", "लिखित अनुवाद", "تحریری ترجمہ")}
            <select
              value={translationLanguage}
              onChange={(event) => {
                const value = event.target.value as "en" | "hi" | "ur";
                setTranslationLanguage(value);
                localStorage.setItem("nurulquran.translation-language", value);
              }}
              className="min-h-11 w-full min-w-0 rounded-xl border-2 border-gold/40 bg-white px-3 text-sm font-semibold normal-case tracking-normal text-parchment shadow-sm sm:w-auto"
            >
              <option value="en">English — Saheeh International</option>
              <option value="hi">हिंदी — Farooq Khan & Nadwi</option>
              <option value="ur">اردو — Fateh Muhammad Jalandhry</option>
            </select>
          </label>
          <label className="flex min-w-0 flex-col gap-2 text-[10px] font-bold uppercase tracking-wider text-parchment/70 sm:flex-row sm:items-center">
            {t("Tafsir language", "तफ़सीर की भाषा", "تفسیر کی زبان")}
            <select
              aria-label={t(
                "Tafsir language",
                "तफ़सीर की भाषा",
                "تفسیر کی زبان",
              )}
              value={tafsirLanguage}
              onChange={(event) => {
                if (!isTafsirLanguage(event.target.value)) return;
                setTafsirLanguage(event.target.value);
                localStorage.setItem(
                  "nurulquran.tafsir-language",
                  event.target.value,
                );
              }}
              className="min-h-11 max-w-full rounded-xl border-2 border-gold/40 bg-white px-3 text-sm font-semibold normal-case tracking-normal text-parchment"
            >
              {(Object.keys(TAFSIR_EDITIONS) as TafsirLanguage[]).map(
                (language) => (
                  <option key={language} value={language}>
                    {TAFSIR_EDITIONS[language].label}
                  </option>
                ),
              )}
            </select>
          </label>
          <div
            className="flex w-full items-center rounded-xl border-2 border-gold/30 bg-white p-1 shadow-sm sm:w-auto"
            aria-label="Arabic reading controls"
          >
            <button
              onClick={() => {
                const next = arabicSize === "normal" ? "large" : "normal";
                setArabicSize(next);
                localStorage.setItem("nurulquran.arabic-size", next);
              }}
              className="min-h-10 flex-1 rounded-lg px-3 text-xs font-bold text-[#0d6658] hover:bg-[#d9eee6] sm:flex-none"
              aria-pressed={arabicSize === "large"}
            >
              {t("Arabic A+", "अरबी अक्षर बड़े करें", "عربی حروف بڑے کریں")}
            </button>
            <button
              onClick={() => {
                const next = !relaxedArabic;
                setRelaxedArabic(next);
                localStorage.setItem(
                  "nurulquran.arabic-spacing",
                  next ? "relaxed" : "compact",
                );
              }}
              className="min-h-10 flex-1 rounded-lg px-3 text-xs font-bold text-[#0d6658] hover:bg-[#d9eee6] sm:flex-none"
              aria-pressed={relaxedArabic}
            >
              {t("Line spacing", "पंक्तियों में अंतर", "سطروں میں فاصلہ")}
            </button>
          </div>
          <div className="w-12 h-12 rounded-2xl gold-gradient flex items-center justify-center text-ink shadow-lg">
            <BookOpen size={24} />
          </div>
          <div>
            <h4 className="text-parchment font-bold">{surah.englishName}</h4>
            <select
              value={reciterId}
              onChange={(e) => setReciterId(e.target.value)}
              aria-label={t("Reciter", "क़ारी", "قاری")}
              className="min-h-11 max-w-full rounded-xl border border-gold/30 bg-white px-3 text-sm text-parchment"
            >
              {RECITERS.map((r) => (
                <option
                  key={r.id}
                  value={r.id}
                  className="bg-ink text-parchment"
                >
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:items-center lg:gap-3">
          <button
            onClick={() =>
              updateJourney((current) => ({
                ...current,
                completedSurahs: current.completedSurahs.includes(surah.number)
                  ? current.completedSurahs.filter(
                      (number) => number !== surah.number,
                    )
                  : [...current.completedSurahs, surah.number],
                completedAyahs: current.completedSurahs.includes(surah.number)
                  ? current.completedAyahs.filter(
                      (id) => !verses.some((verse) => verse.id === id),
                    )
                  : [
                      ...new Set([
                        ...current.completedAyahs,
                        ...verses.map((verse) => verse.id),
                      ]),
                    ],
              }))
            }
            className="min-h-12 rounded-2xl border-2 border-gold/35 bg-white px-4 text-[11px] font-bold uppercase tracking-wider text-[#0d6658] shadow-sm hover:border-gold hover:bg-[#d9eee6]"
          >
            {journey.completedSurahs.includes(surah.number)
              ? t(
                  "Undo completed",
                  "पूर्ण होने का निशान हटाएँ",
                  "مکمل ہونے کا نشان ہٹائیں",
                )
              : t(
                  "Mark surah completed",
                  "सूरह पूर्ण चिन्हित करें",
                  "سورت مکمل نشان زد کریں",
                )}
          </button>
        </div>
      </div>

      <details className="mb-8 rounded-2xl border border-gold/30 bg-white p-4 text-[#12352a]">
        <summary className="cursor-pointer py-3 text-xl font-semibold">{t("Memorisation practice", "हिफ़्ज़ की मश्क़", "حفظ کی مشق")}</summary>
        <p className="my-3">{t("Choose an ayah range, repeat each ayah and pause to recite it yourself. Practice stops after the selected range is completed.", "आयतें चुनें, हर आयत दोहराएँ और वक़्फ़े में ख़ुद पढ़ें। चुनी हुई आयतें पूरी होने पर मश्क़ रुक जाएगी।", "آیات منتخب کریں، ہر آیت دہرائیں اور وقفے میں خود پڑھیں۔ منتخب آیات مکمل ہونے پر مشق رک جائے گی۔")}</p>
        <div className="flex flex-wrap gap-3">
          <label>{t("From ayah", "पहली आयत", "پہلی آیت")}<select className="ms-2 min-h-12 rounded-lg border px-3" value={practiceStart} disabled={memorise} onChange={e => {const n=Number(e.target.value);setPracticeStart(n);setPracticeEnd(end=>Math.max(n,end));}}>{verses.map(v=><option key={v.id} value={v.verse_number}>{v.verse_number}</option>)}</select></label>
          <label>{t("To ayah", "आख़िरी आयत", "آخری آیت")}<select className="ms-2 min-h-12 rounded-lg border px-3" value={practiceEnd} disabled={memorise} onChange={e=>setPracticeEnd(Number(e.target.value))}>{verses.filter(v=>v.verse_number>=practiceStart).map(v=><option key={v.id} value={v.verse_number}>{v.verse_number}</option>)}</select></label>
          <label>{t("Repeats per ayah", "हर आयत की दोहराई", "ہر آیت کی دہرائی")}<select className="ms-2 min-h-12 rounded-lg border px-3" value={practiceRepeats} disabled={memorise} onChange={e=>setPracticeRepeats(Number(e.target.value))}>{[1,2,3,5,10].map(n=><option key={n}>{n}</option>)}</select></label>
          <label>{t("Practice pause (seconds)", "मश्क़ का वक़्फ़ा (सेकंड)", "مشق کا وقفہ (سیکنڈ)")}<select className="ms-2 min-h-12 rounded-lg border px-3" value={practiceGap} disabled={memorise} onChange={e=>setPracticeGap(Number(e.target.value))}>{[0,3,5,10].map(n=><option key={n}>{n}</option>)}</select></label>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="min-h-12 rounded-xl bg-[#075c3a] px-4 font-semibold text-white" onClick={() => {setMemorise(!memorise); if(memorise) {setAudioUrl(null);setPlayingVerseId(null);setIsAudioPlaying(false);} else {setAudioMode("arabic");playVerse(verses[practiceStart-1]);}}}>{memorise ? t("Stop practice", "मश्क़ रोकें", "مشق روکیں") : t("Start practice", "मश्क़ शुरू करें", "مشق شروع کریں")}</button>
          <button aria-pressed={hidePracticeText} className="min-h-12 rounded-xl border px-4" onClick={()=>setHidePracticeText(value=>!value)}>{hidePracticeText ? t("Reveal selected ayahs", "चुनी आयतें दिखाएँ", "منتخب آیات دکھائیں") : t("Hide selected ayahs", "चुनी आयतें छुपाएँ", "منتخب آیات چھپائیں")}</button>
        </div>
      </details>
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
            className={`group relative scroll-mt-44 rounded-3xl p-4 transition-all duration-700 sm:p-6 md:p-8 ${playingVerseId === verse.id ? "border-2 border-[#0d6658] bg-[#d9eee6] shadow-md" : "hover:bg-gold/5"}`}
            onClick={() => recordMeaningfulRead(verse)}
            onFocusCapture={() => recordMeaningfulRead(verse)}
          >
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#0d6658]">
              {t("Ayah", "आयत", "آیت")} {surah.number}:{verse.verse_number}
              {playingVerseId === verse.id && isAudioPlaying && (
                <span className="rounded-full bg-gold/10 px-2 py-1 text-xs">
                  {audioPhase === "urdu"
                    ? t("Urdu translation", "उर्दू तर्जुमा", "اردو ترجمہ")
                    : t("Arabic tilawat", "अरबी तिलावत", "عربی تلاوت")}
                </span>
              )}
            </div>
            <div hidden={hidePracticeText && verse.verse_number >= practiceStart && verse.verse_number <= practiceEnd} className="text-right mb-8">
              <p
                dir="rtl"
                lang="ar"
                className={`${arabicSize === "large" ? "text-4xl md:text-7xl" : "text-3xl md:text-6xl"} font-arabic text-parchment ${relaxedArabic ? "leading-[2.2]" : "leading-[1.65]"} text-right selection:bg-gold/40`}
              >
                {verse.text_uthmani}
              </p>
            </div>
            <div className="pl-6 md:pl-8 border-l-2 border-gold/10 group-hover:border-gold/30 transition-colors">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gold/60">
                {translationLanguage === "hi"
                  ? "हिंदी — Farooq Khan & Nadwi"
                  : translationLanguage === "ur"
                    ? "اردو — Fateh Muhammad Jalandhry"
                    : "English — Saheeh International"}
              </p>
              <p
                dir={translationLanguage === "ur" ? "rtl" : "ltr"}
                lang={translationLanguage}
                className="text-parchment/70 text-lg md:text-xl leading-relaxed font-light"
              >
                {translationLanguage === "hi"
                  ? verse.hindi_translation
                  : translationLanguage === "ur"
                    ? verse.urdu_translation
                    : verse.translation}
              </p>
            </div>
            <InlineTafsir
              verseKey={`${surah.number}:${verse.verse_number}`}
              language={tafsirLanguage}
            />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  playVerse(verse);
                }}
                className="flex min-h-12 items-center gap-2 rounded-2xl border border-gold/30 bg-white px-4 text-sm font-semibold text-[#0d6658] hover:bg-[#d9eee6]"
                aria-label={`Listen from ayah ${surah.number}:${verse.verse_number}`}
              >
                <Headphones size={18} aria-hidden="true" />{" "}
                {t("Listen from here", "यहाँ से सुनें", "یہاں سے سنیں")}
              </button>
              {index < verses.length - 1 ? (
                <button
                  type="button"
                  aria-label={`Go to ayah ${surah.number}:${verses[index + 1].verse_number}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    const nextAyah = document.getElementById(
                      `verse-${verses[index + 1].verse_number}`,
                    );
                    nextAyah?.focus({ preventScroll: true });
                    nextAyah?.scrollIntoView({
                      behavior: window.matchMedia(
                        "(prefers-reduced-motion: reduce)",
                      ).matches
                        ? "auto"
                        : "smooth",
                      block: "start",
                    });
                  }}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-gold/30 bg-white px-4 text-sm font-semibold text-[#0d6658] hover:bg-[#d9eee6]"
                >
                  {t("Next ayah", "अगली आयत", "اگلی آیت")}{" "}
                  <ArrowDown size={18} aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 mb-80 md:mb-64">
        <SurahNavigation prevSlug={prevSlug} nextSlug={nextSlug} />
      </div>

      {/* One recitation control, available before playback starts. */}
      <AudioPlayer
        practiceMode={memorise}
        repetitions={memorise ? practiceRepeats : 1}
        practicePause={memorise ? practiceGap : 0}
        modeLabel={
          audioMode === "arabic-urdu"
            ? t(
                "Arabic + Urdu translation",
                "अरबी + उर्दू तर्जुमा",
                "عربی + اردو ترجمہ",
              )
            : t("Arabic only", "केवल अरबी", "صرف عربی")
        }
        audioUrl={audioUrl}
        translationAudioUrl={
          audioMode === "arabic-urdu" && playingVerseId
            ? urduAudioUrl(
                surah.number,
                verses.find((verse) => verse.id === playingVerseId)
                  ?.verse_number || 0,
              )
            : null
        }
        onPhaseChange={setAudioPhase}
        playbackRequest={playbackRequest}
        title={surah.englishName}
        subtitle={`${playingVerseId ? `${t("Ayah", "आयत", "آیت")} ${verses.find((verse) => verse.id === playingVerseId)?.verse_number} · ` : ""}${RECITERS.find((reciter) => reciter.id === reciterId)?.name || ""}`}
        onPlayRequest={() => {
          if (verses[0]) playVerse(verses[memorise ? practiceStart - 1 : 0]);
        }}
        onNext={playNextVerse}
        onPrev={playPrevVerse}
        onPlayStateChange={setIsAudioPlaying}
        onStop={() => {
          setMemorise(false);
          setAudioUrl(null);
          setPlayingVerseId(null);
          setIsAudioPlaying(false);
        }}
      />
    </div>
  );
}

function SurahNavigation({
  prevSlug,
  nextSlug,
}: {
  prevSlug?: string | null;
  nextSlug?: string | null;
}) {
  const { t } = useUILanguage();
  const linkClass =
    "flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-gold/30 bg-white px-4 text-sm font-semibold text-[#0d6658] hover:bg-[#d9eee6]";
  return (
    <nav aria-label="Surah navigation" className="mb-6 grid grid-cols-2 gap-3">
      {prevSlug ? (
        <Link href={`/quran/${prevSlug}`} className={linkClass}>
          <ArrowLeft size={18} aria-hidden="true" />{" "}
          {t("Previous surah", "पिछली सूरह", "پچھلی سورت")}
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-gold/15 px-4 text-sm text-parchment/50"
        >
          <ArrowLeft size={18} aria-hidden="true" />{" "}
          {t("Previous surah", "पिछली सूरह", "پچھلی سورت")}
        </span>
      )}
      <Link
        href={nextSlug ? `/quran/${nextSlug}` : "/quran"}
        className={linkClass}
      >
        {nextSlug
          ? t("Next surah", "अगली सूरह", "اگلی سورت")
          : t("All surahs", "सभी सूरहें", "تمام سورتیں")}{" "}
        <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </nav>
  );
}
