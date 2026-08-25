"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen, CalendarDays, Check, ChevronDown, Clipboard, Download, Heart, Languages,
  Moon, Play, Plus, Printer, RefreshCw, Save, Search, Share2, ShieldCheck, Sparkles,
  Sun, Trash2, UserRound, Volume2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient, isSupabaseConfigured } from "@/services/supabase";

type Language = "en" | "ur" | "hi";
type Theme = "light" | "dark";
type Surah = { number: number; name: string; englishName: string; englishNameTranslation: string; numberOfAyahs: number };
type Ayah = {
  surahNumber: number; surahName: string; surahArabicName: string; ayahNumber: number; globalNumber: number;
  arabic: string; english: string; hindi: string; urdu: string; transliteration: string; audioUrl: string;
  editions: Record<string, string>;
};
type Insight = {
  simpleMeaning: string; mainMessage: string; context: string;
  importantWords: Array<{ word: string; meaning: string }>;
  themes: string[]; practicalLesson: string; sourceNote: string;
};
type Answers = { allah: string; self: string; improve: string; apply: string; duaPrompt: string };
type ActionPlan = { kind: string; description: string; targetDate: string; completed: boolean; reminder: boolean; consistency: string[] };
type Reflection = {
  id: string; createdAt: string; updatedAt: string; ayah: Ayah; translationLanguage: Language;
  answers: Answers; action: ActionPlan; personalDua: string; favourite: boolean;
};
type SearchResult = { surahNumber: number; surahName: string; ayahNumber: number; translation: string };

const STORAGE_KEY = "nurulquran.reflections.v1";
const EMPTY_ANSWERS: Answers = { allah: "", self: "", improve: "", apply: "", duaPrompt: "" };
const EMPTY_ACTION: ActionPlan = { kind: "", description: "", targetDate: "", completed: false, reminder: false, consistency: [] };
const ACTIONS = [
  "Improve one salah", "Make sincere tawbah", "Show patience in a difficult situation", "Forgive someone",
  "Help someone privately", "Avoid backbiting", "Express gratitude", "Read and understand more Qur’an", "Create my own action",
];
const QUESTIONS: Array<{ key: keyof Answers; en: string; ur: string; hi: string }> = [
  { key: "allah", en: "What does this ayah teach me about Allah?", ur: "یہ آیت مجھے اللہ کے بارے میں کیا سکھاتی ہے؟", hi: "यह आयत मुझे अल्लाह के बारे में क्या सिखाती है?" },
  { key: "self", en: "What does it teach me about myself?", ur: "یہ مجھے اپنے بارے میں کیا سکھاتی ہے؟", hi: "यह मुझे अपने बारे में क्या सिखाती है?" },
  { key: "improve", en: "Is there something I need to start, stop or improve?", ur: "مجھے کیا شروع، بند یا بہتر کرنا چاہیے؟", hi: "मुझे क्या शुरू, बंद या बेहतर करना चाहिए?" },
  { key: "apply", en: "How can I apply this ayah today?", ur: "میں آج اس آیت پر کیسے عمل کر سکتا ہوں؟", hi: "मैं आज इस आयत पर कैसे अमल कर सकता हूँ?" },
  { key: "duaPrompt", en: "What dua does this ayah inspire me to make?", ur: "یہ آیت مجھے کون سی دعا مانگنے کی ترغیب دیتی ہے؟", hi: "यह आयत मुझे कौन-सी दुआ करने की प्रेरणा देती है?" },
];
const COPY = {
  en: { start: "Start Reflection", today: "Reflect on Today’s Ayah", saved: "View Saved Reflections", select: "Select an ayah", reflection: "Guided Reflection", action: "Daily Action Planner", dua: "Personal Dua", save: "Save Reflection", history: "Saved Reflections" },
  ur: { start: "غور و فکر شروع کریں", today: "آج کی آیت پر غور کریں", saved: "محفوظ غور و فکر دیکھیں", select: "آیت منتخب کریں", reflection: "رہنمائی کے ساتھ غور و فکر", action: "روزانہ عمل کا منصوبہ", dua: "ذاتی دعا", save: "محفوظ کریں", history: "محفوظ غور و فکر" },
  hi: { start: "चिंतन शुरू करें", today: "आज की आयत पर चिंतन करें", saved: "सहेजे चिंतन देखें", select: "आयत चुनें", reflection: "मार्गदर्शित चिंतन", action: "दैनिक कार्य योजना", dua: "व्यक्तिगत दुआ", save: "चिंतन सहेजें", history: "सहेजे गए चिंतन" },
};

function todayIso(offset = 0) {
  const date = new Date(); date.setDate(date.getDate() + offset); return date.toISOString().slice(0, 10);
}
function safeReadLocal(): Reflection[] {
  try { const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); return Array.isArray(value) ? value : []; } catch { return []; }
}
function downloadBlob(content: BlobPart, type: string, filename: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a"); anchor.href = url; anchor.download = filename; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char] || char);
}

export default function QuranReflectionPlanner() {
  const [language, setLanguage] = useState<Language>("en");
  const [theme, setTheme] = useState<Theme>("light");
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [surahNumber, setSurahNumber] = useState(1);
  const [ayahNumber, setAyahNumber] = useState(1);
  const [ayah, setAyah] = useState<Ayah | null>(null);
  const [insight, setInsight] = useState<Insight | null>(null);
  const [showTransliteration, setShowTransliteration] = useState(false);
  const [translationLanguage, setTranslationLanguage] = useState<Language>("en");
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [action, setAction] = useState<ActionPlan>(EMPTY_ACTION);
  const [personalDua, setPersonalDua] = useState("");
  const [favourite, setFavourite] = useState(false);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [historySearch, setHistorySearch] = useState("");
  const [historyDate, setHistoryDate] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [syncMode, setSyncMode] = useState<"local" | "account">("local");
  const reflectionRef = useRef<HTMLElement | null>(null);
  const t = COPY[language];
  const selectedSurah = surahs.find(item => item.number === surahNumber);
  const translation = ayah ? (translationLanguage === "ur" ? ayah.urdu : translationLanguage === "hi" ? ayah.hindi : ayah.english) : "";

  useEffect(() => {
    const localReflections = safeReadLocal();
    setReflections(localReflections);
    const dueAction = localReflections.find(item => item.action.reminder && !item.action.completed && item.action.targetDate && item.action.targetDate <= todayIso());
    if (dueAction) setMessage(`Gentle reminder: review your action for Qur’an ${dueAction.ayah.surahNumber}:${dueAction.ayah.ayahNumber}.`);
    fetch("/api/quran-reflection?mode=surahs").then(res => res.json()).then(data => {
      if (data.surahs) setSurahs(data.surahs);
    }).catch(() => setError("Surah list could not be loaded."));
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user;
      setIsAuthenticated(Boolean(user));
      if (!user) return;
      try {
        const { data: rows, error: syncError } = await supabase.from("quran_reflections").select("payload").order("updated_at", { ascending: false });
        if (syncError) throw syncError;
        const cloud = (rows || []).map(row => row.payload as Reflection);
        if (cloud.length) { setReflections(cloud); localStorage.setItem(STORAGE_KEY, JSON.stringify(cloud)); }
        setSyncMode("account");
      } catch { setSyncMode("local"); }
    });
  }, []);

  async function loadAyah(nextSurah = surahNumber, nextAyah = ayahNumber) {
    setLoading(true); setError(""); setMessage("");
    try {
      const response = await fetch(`/api/quran-reflection?mode=ayah&surah=${nextSurah}&ayah=${nextAyah}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Ayah could not be loaded.");
      setAyah(data.ayah); setSurahNumber(nextSurah); setAyahNumber(nextAyah); setInsight(null);
      const insightResponse = await fetch("/api/quran-reflection/insight", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ surah: nextSurah, ayah: nextAyah }) });
      const insightData = await insightResponse.json();
      if (insightResponse.ok) setInsight(insightData.insight);
      setTimeout(() => reflectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Ayah could not be loaded."); }
    finally { setLoading(false); }
  }

  function globalToReference(global: number) {
    let remaining = global;
    for (const surah of surahs) {
      if (remaining <= surah.numberOfAyahs) return { surah: surah.number, ayah: remaining };
      remaining -= surah.numberOfAyahs;
    }
    return { surah: 1, ayah: 1 };
  }
  function selectToday() {
    if (!surahs.length) return;
    const start = new Date(new Date().getFullYear(), 0, 0);
    const day = Math.floor((Date.now() - start.getTime()) / 86400000);
    const ref = globalToReference(((day - 1) % 6236) + 1); loadAyah(ref.surah, ref.ayah);
  }
  function selectRandom() {
    if (!surahs.length) return;
    const ref = globalToReference(Math.floor(Math.random() * 6236) + 1); loadAyah(ref.surah, ref.ayah);
  }
  async function searchTranslation() {
    if (search.trim().length < 2) return;
    setLoading(true); setError("");
    try {
      const response = await fetch(`/api/quran-reflection?mode=search&q=${encodeURIComponent(search.trim())}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setSearchResults(data.results || []);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Search failed."); }
    finally { setLoading(false); }
  }

  async function copyAyah() {
    if (!ayah) return;
    await navigator.clipboard.writeText(`${ayah.arabic}\n\n${translation}\n\nQur’an ${ayah.surahName} (${ayah.surahNumber}:${ayah.ayahNumber}) — NurulQuran.info`);
    setMessage("Ayah and translation copied.");
  }
  async function shareAyah() {
    if (!ayah) return;
    const text = `${ayah.arabic}\n\n${translation}\n\n${ayah.surahName} ${ayah.surahNumber}:${ayah.ayahNumber} — NurulQuran.info`;
    if (navigator.share) { await navigator.share({ title: `Qur’an ${ayah.surahNumber}:${ayah.ayahNumber}`, text }); }
    else { await navigator.clipboard.writeText(text); setMessage("Share text copied."); }
  }
  function downloadAyahCard() {
    if (!ayah) return;
    const canvas = document.createElement("canvas"); canvas.width = 1200; canvas.height = 1200;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    ctx.fillStyle = "#F6F7F1"; ctx.fillRect(0, 0, 1200, 1200); ctx.fillStyle = "#167C6B"; ctx.fillRect(0, 0, 1200, 18);
    ctx.textAlign = "center"; ctx.fillStyle = "#163B36"; ctx.font = "52px serif"; wrapCanvas(ctx, ayah.arabic, 1080, 330, 75);
    ctx.font = "30px sans-serif"; wrapCanvas(ctx, translation, 980, 650, 46);
    ctx.fillStyle = "#167C6B"; ctx.font = "bold 28px sans-serif"; ctx.fillText(`${ayah.surahName} · ${ayah.surahNumber}:${ayah.ayahNumber}`, 600, 1030);
    ctx.font = "24px sans-serif"; ctx.fillText("NurulQuran.info", 600, 1100);
    canvas.toBlob(blob => { if (blob) downloadBlob(blob, "image/png", `quran-${ayah.surahNumber}-${ayah.ayahNumber}.png`); });
  }
  function wrapCanvas(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, startY: number, lineHeight: number) {
    const words = text.split(" "); const lines: string[] = []; let line = "";
    words.forEach(word => { const test = `${line} ${word}`.trim(); if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = word; } else line = test; });
    if (line) lines.push(line); lines.slice(0, 7).forEach((item, index) => ctx.fillText(item, 600, startY + index * lineHeight));
  }

  async function persist(next: Reflection[]) {
    setReflections(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    if (!isAuthenticated || !isSupabaseConfigured) return;
    const supabase = createClient();
    try {
      for (const item of next) {
        await supabase.from("quran_reflections").upsert({ id: item.id, payload: item, updated_at: item.updatedAt });
      }
      setSyncMode("account");
    } catch { setSyncMode("local"); }
  }
  async function saveReflection() {
    if (!ayah) { setError("Select an ayah before saving."); return; }
    const now = new Date().toISOString();
    const item: Reflection = { id: editingId || crypto.randomUUID(), createdAt: reflections.find(r => r.id === editingId)?.createdAt || now, updatedAt: now, ayah, translationLanguage, answers, action, personalDua, favourite };
    const next = [item, ...reflections.filter(r => r.id !== item.id)]; await persist(next); setEditingId(item.id); setMessage("Reflection saved privately.");
  }
  function editReflection(item: Reflection) {
    setAyah(item.ayah); setSurahNumber(item.ayah.surahNumber); setAyahNumber(item.ayah.ayahNumber); setTranslationLanguage(item.translationLanguage);
    setAnswers(item.answers); setAction(item.action); setPersonalDua(item.personalDua); setFavourite(item.favourite); setEditingId(item.id);
    reflectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  async function deleteReflection(id: string) {
    if (!confirm("Delete this reflection permanently?")) return;
    const next = reflections.filter(item => item.id !== id); await persist(next);
    if (isAuthenticated && isSupabaseConfigured) { try { await createClient().from("quran_reflections").delete().eq("id", id); } catch {} }
    if (editingId === id) setEditingId(null); setMessage("Reflection deleted.");
  }
  function exportAll() { downloadBlob(JSON.stringify(reflections, null, 2), "application/json", "nurulquran-reflections.json"); }
  function printReflection() {
    if (!ayah) return;
    const win = window.open("", "_blank", "noopener,noreferrer"); if (!win) { setError("Allow pop-ups to print or save as PDF."); return; }
    win.document.write(`<!doctype html><html><head><title>Qur’an Reflection ${ayah.surahNumber}:${ayah.ayahNumber}</title><style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;color:#163b36;line-height:1.6}.arabic{font-family:serif;font-size:34px;text-align:right;direction:rtl}.box{border:1px solid #cbded8;border-radius:12px;padding:16px;margin:14px 0}h1,h2{color:#167c6b}@media print{button{display:none}}</style></head><body><h1>Qur’an Reflection</h1><p class="arabic">${escapeHtml(ayah.arabic)}</p><p>${escapeHtml(translation)}</p><strong>${escapeHtml(ayah.surahName)} ${ayah.surahNumber}:${ayah.ayahNumber}</strong>${QUESTIONS.map(q => answers[q.key] ? `<div class="box"><h2>${escapeHtml(q.en)}</h2><p>${escapeHtml(answers[q.key])}</p></div>` : "").join("")}<div class="box"><h2>Daily action</h2><p>${escapeHtml(action.description || action.kind)}</p></div><div class="box"><h2>Personal dua</h2><p>${escapeHtml(personalDua)}</p></div><p><small>Private reflection · NurulQuran.info</small></p><script>window.onload=()=>window.print()<\/script></body></html>`);
    win.document.close();
  }

  const filteredHistory = useMemo(() => reflections.filter(item => {
    const query = historySearch.toLowerCase();
    const matchesText = !query || item.ayah.surahName.toLowerCase().includes(query) || item.ayah.english.toLowerCase().includes(query);
    return matchesText && (!historyDate || item.createdAt.slice(0, 10) === historyDate);
  }), [reflections, historySearch, historyDate]);
  const streak = useMemo(() => {
    const dates = new Set(reflections.map(item => item.createdAt.slice(0, 10))); let count = 0;
    for (let offset = 0; dates.has(todayIso(-offset)); offset += 1) count += 1;
    return count;
  }, [reflections]);

  const panel = "glass rounded-3xl border border-gold/15 p-5 sm:p-7";
  return (
    <main className={`${theme === "dark" ? "reflection-dark" : ""} min-h-screen bg-ink text-parchment`}>
      <Navbar />
      <section className="reflection-pattern px-5 pb-20 pt-36 sm:px-6 sm:pt-44">
        <div className="mx-auto max-w-6xl text-center">
          <span className="mb-5 block text-xs font-bold uppercase tracking-[0.35em] text-gold">Qur’an Reflection & Daily Action Planner</span>
          <h1 className="font-display text-4xl font-bold leading-tight sm:text-6xl">Reflect on the Qur’an. <span className="text-gold">Apply It to Your Life.</span></h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-parchment/70 sm:text-lg">Select an ayah, understand its message, write your reflection and choose one meaningful action for today.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button onClick={() => reflectionRef.current?.scrollIntoView({ behavior: "smooth" })} className="rounded-2xl bg-gold px-5 py-3 font-bold text-ink">{t.start}</button>
            <button onClick={selectToday} className="rounded-2xl border border-gold/25 bg-white/60 px-5 py-3 font-bold text-gold">{t.today}</button>
            <a href="#saved-reflections" className="rounded-2xl border border-gold/25 bg-white/60 px-5 py-3 font-bold text-gold">{t.saved}</a>
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-2" aria-label="Page preferences">
            <label className="flex items-center gap-2 rounded-xl border border-gold/20 bg-white/50 px-3 py-2 text-sm"><Languages size={16}/><span className="sr-only">Interface language</span><select value={language} onChange={e => setLanguage(e.target.value as Language)} className="bg-transparent" dir={language === "ur" ? "rtl" : "ltr"}><option value="en">English</option><option value="ur">اردو</option><option value="hi">हिन्दी</option></select></label>
            <button onClick={() => setTheme(value => value === "light" ? "dark" : "light")} className="flex items-center gap-2 rounded-xl border border-gold/20 bg-white/50 px-3 py-2 text-sm" aria-label="Toggle light and dark mode">{theme === "light" ? <Moon size={16}/> : <Sun size={16}/>} {theme === "light" ? "Dark" : "Light"}</button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-7 px-4 pb-24 sm:px-6" dir={language === "ur" ? "rtl" : "ltr"}>
        {error ? <div role="alert" className="rounded-2xl border border-red-300 bg-red-50 p-4 text-red-800">{error}</div> : null}
        {message ? <div role="status" className="rounded-2xl border border-gold/25 bg-gold/10 p-4 text-parchment">{message}</div> : null}

        <section ref={reflectionRef} className={`${panel} scroll-mt-28`} aria-labelledby="ayah-selection">
          <div className="mb-6 flex items-center gap-3"><BookOpen className="text-gold"/><h2 id="ayah-selection" className="font-display text-3xl font-bold">{t.select}</h2></div>
          <div className="grid gap-4 md:grid-cols-[1fr_180px_auto]">
            <label className="text-sm font-semibold">Surah<select value={surahNumber} onChange={e => { setSurahNumber(Number(e.target.value)); setAyahNumber(1); }} className="mt-2 h-12 w-full rounded-xl border border-gold/20 bg-white px-3 text-slate-900">{surahs.map(item => <option key={item.number} value={item.number}>{item.number}. {item.englishName} — {item.englishNameTranslation}</option>)}</select></label>
            <label className="text-sm font-semibold">Ayah number<input type="number" min={1} max={selectedSurah?.numberOfAyahs || 1} value={ayahNumber} onChange={e => setAyahNumber(Number(e.target.value))} className="mt-2 h-12 w-full rounded-xl border border-gold/20 bg-white px-3 text-slate-900" /></label>
            <button disabled={loading || !surahs.length} onClick={() => loadAyah()} className="mt-auto h-12 rounded-xl bg-gold px-5 font-bold text-ink disabled:opacity-50">{loading ? "Loading…" : "Load Ayah"}</button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2"><button onClick={selectRandom} className="rounded-xl border border-gold/25 px-4 py-2 text-sm font-bold text-gold"><RefreshCw size={15} className="mr-2 inline"/>Random Ayah</button><button onClick={selectToday} className="rounded-xl border border-gold/25 px-4 py-2 text-sm font-bold text-gold"><CalendarDays size={15} className="mr-2 inline"/>Today’s Ayah</button></div>
          <div className="mt-6 grid gap-2 sm:grid-cols-[1fr_auto]"><label className="sr-only" htmlFor="translation-search">Search English translation</label><input id="translation-search" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => { if (e.key === "Enter") searchTranslation(); }} placeholder="Search a keyword in the English translation" className="h-12 rounded-xl border border-gold/20 bg-white px-4 text-slate-900"/><button onClick={searchTranslation} disabled={search.trim().length < 2 || loading} className="h-12 rounded-xl border border-gold/25 px-5 font-bold text-gold"><Search size={17} className="mr-2 inline"/>Search</button></div>
          {searchResults.length ? <div className="mt-3 max-h-72 overflow-y-auto rounded-xl border border-gold/15 bg-white/50 p-2">{searchResults.map(result => <button key={`${result.surahNumber}:${result.ayahNumber}`} onClick={() => { loadAyah(result.surahNumber, result.ayahNumber); setSearchResults([]); }} className="block w-full rounded-lg p-3 text-left hover:bg-gold/10"><strong>{result.surahName} {result.surahNumber}:{result.ayahNumber}</strong><span className="mt-1 block text-sm text-parchment/70">{result.translation}</span></button>)}</div> : null}
        </section>

        {ayah ? <>
          <section className={panel} aria-labelledby="selected-ayah">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-bold text-gold">Surah {ayah.surahName} · {ayah.surahNumber}:{ayah.ayahNumber}</p><h2 id="selected-ayah" className="mt-1 font-display text-2xl">{ayah.surahArabicName}</h2></div><button onClick={() => setFavourite(value => !value)} aria-pressed={favourite} className="rounded-xl border border-gold/20 p-3 text-gold"><Heart fill={favourite ? "currentColor" : "none"}/><span className="sr-only">Favourite ayah</span></button></div>
            <p className="mt-8 text-right font-arabic text-3xl leading-[2.1] sm:text-5xl" dir="rtl" lang="ar">{ayah.arabic}</p>
            <div className="mt-5 flex flex-wrap gap-2"><button onClick={() => setShowTransliteration(value => !value)} className="rounded-xl border border-gold/20 px-3 py-2 text-sm">Transliteration {showTransliteration ? "on" : "off"}</button><select value={translationLanguage} onChange={e => setTranslationLanguage(e.target.value as Language)} className="rounded-xl border border-gold/20 bg-white px-3 py-2 text-sm text-slate-900"><option value="en">English — Saheeh International</option><option value="hi">हिन्दी</option><option value="ur">اردو</option></select></div>
            {showTransliteration ? <p className="mt-5 italic text-parchment/70">{ayah.transliteration}</p> : null}
            <p className="mt-5 text-lg leading-8" dir={translationLanguage === "ur" ? "rtl" : "ltr"} lang={translationLanguage}>{translation}</p>
            <p className="mt-3 text-xs text-parchment/55">Verified source: AlQuran Cloud · Arabic: Quran Uthmani · English: Saheeh International</p>
            <div className="mt-5 flex flex-wrap items-center gap-2"><audio controls preload="none" src={ayah.audioUrl} className="max-w-full" aria-label={`Play ${ayah.surahName} ayah ${ayah.ayahNumber}`}/><button onClick={copyAyah} className="rounded-xl border border-gold/20 p-2.5" title="Copy ayah and translation"><Clipboard size={18}/></button><button onClick={shareAyah} className="rounded-xl border border-gold/20 p-2.5" title="Share ayah"><Share2 size={18}/></button><button onClick={downloadAyahCard} className="rounded-xl border border-gold/20 px-3 py-2 text-sm font-bold" title="Download share card"><Download size={17} className="mr-2 inline"/>Ayah card</button></div>
          </section>

          <section className={panel} aria-labelledby="understanding"><div className="mb-6 flex items-center gap-3"><Sparkles className="text-gold"/><h2 id="understanding" className="font-display text-3xl font-bold">Understanding the Ayah</h2></div>
            {insight ? <div className="grid gap-4 md:grid-cols-2"><StudyCard title="Simple Meaning" text={insight.simpleMeaning}/><StudyCard title="Main Message" text={insight.mainMessage}/><StudyCard title="Historical or Surah Context" text={insight.context}/><div className="rounded-2xl bg-white/45 p-5"><h3 className="font-bold text-gold">Important Arabic Words</h3>{insight.importantWords.length ? <ul className="mt-3 space-y-2">{insight.importantWords.map(word => <li key={word.word}><span className="font-arabic text-xl" dir="rtl">{word.word}</span> — {word.meaning}</li>)}</ul> : <p className="mt-3 text-sm text-parchment/65">No word-level note is shown without sufficient grounding.</p>}</div><div className="rounded-2xl bg-white/45 p-5"><h3 className="font-bold text-gold">Related Qur’anic Themes</h3><div className="mt-3 flex flex-wrap gap-2">{insight.themes.map(themeItem => <span key={themeItem} className="rounded-full bg-gold/10 px-3 py-1 text-sm">{themeItem}</span>)}</div></div><StudyCard title="Practical Lesson" text={insight.practicalLesson}/><div className="md:col-span-2 rounded-2xl border border-gold/15 p-4 text-sm text-parchment/65"><strong>Source note:</strong> {insight.sourceNote} <a className="font-bold text-gold underline" href={`https://quran.com/${ayah.surahNumber}:${ayah.ayahNumber}/tafsirs/en-tafisr-ibn-kathir`} target="_blank" rel="noreferrer">Read recognised tafsir</a></div></div> : <p className="text-parchment/60">Educational notes are loading or unavailable. The verified ayah and translations remain available above.</p>}
          </section>

          <section className={panel} aria-labelledby="guided-reflection"><h2 id="guided-reflection" className="font-display text-3xl font-bold">{t.reflection}</h2><p className="mt-2 text-sm text-parchment/65">Your answers are private and are never included in the shared ayah card.</p><div className="mt-6 grid gap-5">{QUESTIONS.map(question => <label key={question.key} className="font-semibold">{question[language]}<textarea value={answers[question.key]} onChange={e => setAnswers(current => ({ ...current, [question.key]: e.target.value }))} rows={3} className="mt-2 w-full rounded-xl border border-gold/20 bg-white p-3 font-normal text-slate-900"/></label>)}</div></section>

          <section className={panel} aria-labelledby="daily-action"><h2 id="daily-action" className="font-display text-3xl font-bold">{t.action}</h2><p className="mt-2 text-sm text-parchment/65">Choose one realistic action without guilt-based targets or assumptions about guaranteed spiritual reward.</p><div className="mt-6 grid gap-4 md:grid-cols-2"><label className="font-semibold">Choose an action<select value={action.kind} onChange={e => setAction(current => ({ ...current, kind: e.target.value, description: e.target.value === "Create my own action" ? "" : e.target.value }))} className="mt-2 h-12 w-full rounded-xl border border-gold/20 bg-white px-3 text-slate-900"><option value="">Select one</option>{ACTIONS.map(item => <option key={item}>{item}</option>)}</select></label><label className="font-semibold">Target date<input type="date" value={action.targetDate} onChange={e => setAction(current => ({ ...current, targetDate: e.target.value }))} className="mt-2 h-12 w-full rounded-xl border border-gold/20 bg-white px-3 text-slate-900"/></label><label className="font-semibold md:col-span-2">Action description<input value={action.description} onChange={e => setAction(current => ({ ...current, description: e.target.value }))} className="mt-2 h-12 w-full rounded-xl border border-gold/20 bg-white px-3 text-slate-900"/></label></div><div className="mt-4 flex flex-wrap gap-5"><label className="flex items-center gap-2"><input type="checkbox" checked={action.completed} onChange={e => setAction(current => ({ ...current, completed: e.target.checked }))}/> Completed</label><label className="flex items-center gap-2"><input type="checkbox" checked={action.reminder} onChange={e => setAction(current => ({ ...current, reminder: e.target.checked }))}/> Optional in-app reminder</label></div><div className="mt-6"><p className="mb-3 font-semibold">Seven-day consistency tracker</p><div className="grid grid-cols-7 gap-2">{Array.from({ length: 7 }, (_, index) => todayIso(index)).map(date => { const active = action.consistency.includes(date); return <button key={date} onClick={() => setAction(current => ({ ...current, consistency: active ? current.consistency.filter(item => item !== date) : [...current.consistency, date] }))} aria-pressed={active} className={`rounded-xl border p-2 text-xs ${active ? "border-gold bg-gold text-ink" : "border-gold/20"}`}><span className="block font-bold">{new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { weekday: "short" })}</span>{active ? <Check size={15} className="mx-auto mt-1"/> : <span className="mt-1 block">○</span>}</button>; })}</div></div></section>

          <section className={panel} aria-labelledby="personal-dua"><h2 id="personal-dua" className="font-display text-3xl font-bold">{t.dua}</h2><p className="mt-2 text-sm text-parchment/65">Make dua sincerely in your own words, while observing Islamic manners of supplication.</p><textarea value={personalDua} onChange={e => setPersonalDua(e.target.value)} rows={5} className="mt-5 w-full rounded-xl border border-gold/20 bg-white p-3 text-slate-900" placeholder="Write your private dua here…"/></section>

          <section className={`${panel} flex flex-wrap gap-3`} aria-label="Save and export"><button onClick={saveReflection} className="rounded-xl bg-gold px-5 py-3 font-bold text-ink"><Save size={18} className="mr-2 inline"/>{t.save}</button><button onClick={printReflection} className="rounded-xl border border-gold/25 px-4 py-3 font-bold"><Download size={18} className="mr-2 inline"/>Download PDF</button><button onClick={printReflection} className="rounded-xl border border-gold/25 px-4 py-3 font-bold"><Printer size={18} className="mr-2 inline"/>Print Reflection</button><button onClick={copyAyah} className="rounded-xl border border-gold/25 px-4 py-3 font-bold"><Clipboard size={18} className="mr-2 inline"/>Copy Ayah & Translation</button></section>
        </> : null}

        <section id="saved-reflections" className={`${panel} scroll-mt-28`} aria-labelledby="saved-title"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 id="saved-title" className="font-display text-3xl font-bold">{t.history}</h2><p className="mt-2 text-sm text-parchment/65"><ShieldCheck size={15} className="mr-1 inline"/>{syncMode === "account" ? "Secure account synchronisation is active." : "Stored only on this device."} {!isAuthenticated ? <Link href="/login" className="font-bold text-gold underline">Sign in to enable secure synchronisation</Link> : null}</p></div><div className="rounded-2xl bg-gold/10 px-4 py-3 text-center"><strong className="block text-2xl text-gold">{streak}</strong><span className="text-xs">day reflection streak</span></div></div><div className="mt-6 grid gap-2 sm:grid-cols-[1fr_180px_auto]"><input value={historySearch} onChange={e => setHistorySearch(e.target.value)} placeholder="Search by surah or keyword" className="h-11 rounded-xl border border-gold/20 bg-white px-3 text-slate-900"/><input type="date" value={historyDate} onChange={e => setHistoryDate(e.target.value)} className="h-11 rounded-xl border border-gold/20 bg-white px-3 text-slate-900"/><button onClick={exportAll} disabled={!reflections.length} className="rounded-xl border border-gold/25 px-4 font-bold disabled:opacity-50"><Download size={16} className="mr-2 inline"/>Export all</button></div>{filteredHistory.length ? <div className="mt-5 grid gap-3">{filteredHistory.map(item => <article key={item.id} className="rounded-2xl border border-gold/15 bg-white/40 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-bold text-gold">{item.ayah.surahName} {item.ayah.surahNumber}:{item.ayah.ayahNumber} {item.favourite ? "♥" : ""}</p><p className="mt-1 text-sm text-parchment/60">{new Date(item.createdAt).toLocaleDateString()} · {item.action.completed ? "Action completed" : "Action open"}</p><p className="mt-2 line-clamp-2 text-sm">{item.ayah.english}</p></div><div className="flex gap-2"><button onClick={() => editReflection(item)} className="rounded-lg border border-gold/20 px-3 py-2 text-sm font-bold">Edit</button><button onClick={() => deleteReflection(item.id)} className="rounded-lg border border-red-200 p-2 text-red-700" title="Delete reflection"><Trash2 size={17}/></button></div></div></article>)}</div> : <div className="mt-6 rounded-2xl border border-dashed border-gold/25 p-8 text-center text-parchment/60">No saved reflections match this view.</div>}</section>

        <section className="rounded-3xl border border-amber-300 bg-amber-50 p-5 text-sm leading-6 text-amber-950"><strong>Important disclaimer:</strong> This reflection tool is intended for learning and personal reflection. For formal tafsir, legal rulings or personal religious matters, consult recognised scholars and reliable tafsir works.<br/><span className="mt-2 block font-semibold">For a fatwa or sensitive personal ruling: “This requires guidance from a qualified scholar who can understand your complete circumstances.”</span></section>
        <nav className="flex flex-wrap justify-center gap-4 text-sm font-bold text-gold" aria-label="Related learning pages"><Link href="/quran">Read Qur’an</Link><Link href="/tafseer">Tafseer</Link><Link href="/dua">Dua Library</Link><Link href="/names-of-allah">Names of Allah</Link></nav>
      </div>
      <Footer />
    </main>
  );
}

function StudyCard({ title, text }: { title: string; text: string }) {
  return <div className="rounded-2xl bg-white/45 p-5"><h3 className="font-bold text-gold">{title}</h3><p className="mt-3 leading-7 text-parchment/75">{text}</p></div>;
}
