"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Bookmark, BookOpen, Download, Loader2, Search } from "lucide-react";
import type { QuranTopic } from "@/data/quran-topics";
import { useQuranJourney } from "@/hooks/useQuranJourney";
import { surahSlug } from "@/lib/quran-journey";
import { downloadAyahCard } from "@/lib/ayah-card";

type Ayah = { surahNumber: number; surahName: string; ayahNumber: number; globalNumber: number; arabic: string; english: string; hindi: string; urdu: string; audioUrl: string; editions: Record<string, string> };
type Language = "en" | "hi" | "ur";

export default function QuranTopicDetail({ topic }: { topic: QuranTopic }) {
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [query, setQuery] = useState("");
  const [surahFilter, setSurahFilter] = useState("all");
  const { data, update } = useQuranJourney();

  useEffect(() => {
    const saved = localStorage.getItem("nurulquran.translation-language");
    if (saved === "en" || saved === "hi" || saved === "ur") setLanguage(saved);
    Promise.all(topic.ayahs.map(reference => fetch(`/api/quran-reflection?mode=ayah&surah=${reference.surah}&ayah=${reference.ayah}`).then(response => {
      if (!response.ok) throw new Error("Ayah source unavailable"); return response.json();
    }))).then(results => setAyahs(results.map(result => result.ayah))).catch(() => setError("Verified ayahs could not be loaded. Please try again.")).finally(() => setLoading(false));
  }, [topic.ayahs]);

  const changeLanguage = (next: Language) => { setLanguage(next); localStorage.setItem("nurulquran.translation-language", next); };
  const filtered = useMemo(() => ayahs.filter(ayah => {
    const translation = language === "hi" ? ayah.hindi : language === "ur" ? ayah.urdu : ayah.english;
    return (!query || `${translation} ${ayah.surahName}`.toLowerCase().includes(query.toLowerCase())) && (surahFilter === "all" || ayah.surahNumber === Number(surahFilter));
  }), [ayahs, language, query, surahFilter]);
  const surahs = [...new Map(ayahs.map(ayah => [ayah.surahNumber, ayah.surahName])).entries()];

  const save = (ayah: Ayah) => {
    const id = `${ayah.surahNumber}:${ayah.ayahNumber}`;
    const exists = data.bookmarks.some(item => item.id === id);
    update(current => ({ ...current, bookmarks: exists ? current.bookmarks.filter(item => item.id !== id) : [{ id, surahNumber: ayah.surahNumber, surahName: ayah.surahName, surahSlug: surahSlug(ayah.surahName), ayahNumber: ayah.ayahNumber, globalAyahNumber: ayah.globalNumber, arabic: ayah.arabic, english: ayah.english, hindi: ayah.hindi, note: "", collection: topic.title, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...current.bookmarks] }));
  };

  return <article>
    <Link href="/quran-topics" className="text-sm font-bold text-gold underline">← All topics</Link>
    <header className="mt-7 max-w-4xl"><p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">Reviewed Qur’anic theme</p><h1 className="mt-3 font-display text-5xl text-parchment sm:text-7xl">{topic.title}</h1><p className="mt-5 max-w-3xl text-base leading-8 text-parchment/65">{topic.introduction}</p></header>

    <div className="mt-8 grid gap-3 rounded-3xl border border-gold/15 bg-white/70 p-4 sm:grid-cols-3">
      <label className="relative"><span className="sr-only">Search translations</span><Search className="absolute left-3 top-3.5 text-gold" size={18}/><input value={query} onChange={event => setQuery(event.target.value)} className="min-h-11 w-full rounded-xl border border-gold/15 bg-ink pl-10 pr-3 text-sm" placeholder="Search translation"/></label>
      <select aria-label="Filter topic passages by surah" value={surahFilter} onChange={event => setSurahFilter(event.target.value)} className="min-h-11 rounded-xl border border-gold/15 bg-ink px-3 text-sm"><option value="all">All surahs</option>{surahs.map(([number, name]) => <option key={number} value={number}>{number}. {name}</option>)}</select>
      <select aria-label="Translation language" value={language} onChange={event => changeLanguage(event.target.value as Language)} className="min-h-11 rounded-xl border border-gold/15 bg-ink px-3 text-sm"><option value="en">English — Saheeh International</option><option value="hi">हिंदी — Farooq Khan & Nadwi</option><option value="ur">اردو — Fateh Muhammad Jalandhry</option></select>
    </div>

    {loading ? <div className="flex items-center gap-3 py-16 text-parchment/55"><Loader2 className="animate-spin text-gold"/> Loading verified ayahs…</div> : null}
    {error ? <div className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-800" role="alert">{error}</div> : null}
    <div className="mt-8 space-y-6">{filtered.map(ayah => {
      const translation = language === "hi" ? ayah.hindi : language === "ur" ? ayah.urdu : ayah.english;
      const saved = data.bookmarks.some(item => item.id === `${ayah.surahNumber}:${ayah.ayahNumber}`);
      return <section key={`${ayah.surahNumber}:${ayah.ayahNumber}`} className="rounded-3xl border border-gold/15 bg-white/75 p-5 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-gold">{ayah.surahName} · {ayah.surahNumber}:{ayah.ayahNumber}</p>
        <p lang="ar" dir="rtl" className="mt-6 text-right font-arabic text-3xl leading-[2.2] text-parchment sm:text-4xl">{ayah.arabic}</p>
        <div className="mt-5 border-l-2 border-gold/20 pl-5"><p dir={language === "ur" ? "rtl" : "ltr"} lang={language} className="text-base leading-8 text-parchment/70 sm:text-lg">{translation}</p><p className="mt-2 text-xs text-parchment/45">Translation: {language === "hi" ? ayah.editions.hindi : language === "ur" ? ayah.editions.urdu : ayah.editions.english}</p></div>
        <div className="mt-6 flex flex-wrap items-center gap-3"><audio controls preload="none" src={ayah.audioUrl} className="max-w-full" aria-label={`Listen to ${ayah.surahName} ayah ${ayah.ayahNumber}`}/><Link href={`/quran/${surahSlug(ayah.surahName)}#verse-${ayah.ayahNumber}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gold/20 px-4 text-sm font-bold text-gold"><BookOpen size={17}/> Read in Context</Link><button onClick={() => save(ayah)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gold/20 px-4 text-sm font-bold text-gold" aria-pressed={saved}><Bookmark size={17} fill={saved ? "currentColor" : "none"}/> {saved ? "Saved" : "Save"}</button><button onClick={() => downloadAyahCard({ arabic: ayah.arabic, translation, reference: `${ayah.surahName} · ${ayah.surahNumber}:${ayah.ayahNumber}`, filename: `quran-${ayah.surahNumber}-${ayah.ayahNumber}.png` })} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gold/20 px-4 text-sm font-bold text-gold"><Download size={17}/> Ayah card</button></div>
      </section>;
    })}</div>

    <div className="mt-10 grid gap-5 md:grid-cols-2"><section className="rounded-3xl bg-gold/5 p-6"><h2 className="font-display text-2xl text-parchment">Reflection question</h2><p className="mt-3 leading-7 text-parchment/65">{topic.reflection}</p></section><section className="rounded-3xl bg-gold/5 p-6"><h2 className="font-display text-2xl text-parchment">One practical action</h2><p className="mt-3 leading-7 text-parchment/65">{topic.action}</p></section></div>
    <aside className="mt-8 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm leading-6 text-amber-950"><strong>Source and methodology:</strong> References are manually mapped in NurulQuran’s reviewed topic dataset. Arabic and translations are loaded from fixed AlQuran Cloud editions. These topic introductions are general educational summaries, not tafsir.<br/><strong>This educational collection is not a fatwa or a substitute for qualified scholarly, medical or professional guidance.</strong></aside>
  </article>;
}
