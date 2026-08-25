"use client";

import Link from "next/link";
import { Children, useEffect, useMemo, useState, type ReactNode } from "react";
import { Bookmark, BookOpen, CalendarCheck, Headphones, History, LogIn, RotateCcw, Sparkles } from "lucide-react";
import { TOTAL_QURAN_AYAHS } from "@/lib/quran-journey";
import { useQuranJourney } from "@/hooks/useQuranJourney";

type ReflectionSummary = { updatedAt?: string; ayah?: { surahName?: string; surahNumber?: number; ayahNumber?: number }; action?: { description?: string; kind?: string; completed?: boolean } };

export default function JourneyDashboard({ compact = false }: { compact?: boolean }) {
  const { data, loaded, authenticated, syncState, update } = useQuranJourney();
  const [reflections, setReflections] = useState<ReflectionSummary[]>([]);

  useEffect(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem("nurulquran.reflections.v1") || "[]");
      setReflections(Array.isArray(parsed) ? parsed : []);
    } catch { setReflections([]); }
  }, []);

  const percent = Math.min(100, (data.completedAyahs.length / TOTAL_QURAN_AYAHS) * 100);
  const todayAction = reflections.find(item => item.action && !item.action.completed)?.action;
  const latestReflection = reflections[0];
  const continueUrl = data.lastRead ? `/quran/${data.lastRead.surahSlug}#verse-${data.lastRead.ayahNumber}` : "/quran";
  const listenUrl = data.lastRead ? `/quran/${data.lastRead.surahSlug}?autoplay=true#verse-${data.lastRead.ayahNumber}` : "/quran";
  const planProgress = data.plan ? Math.round((data.plan.completedDays.length / data.plan.durationDays) * 100) : 0;
  const recent = useMemo(() => data.recentSurahs.slice(0, compact ? 3 : 6), [compact, data.recentSurahs]);

  if (!loaded) return <div className="h-48 animate-pulse rounded-3xl bg-white/50" aria-label="Loading Quran journey" />;

  return (
    <section className={`rounded-[32px] border border-gold/20 bg-white/75 shadow-xl shadow-gold/5 ${compact ? "p-5 sm:p-7" : "p-6 sm:p-10"}`} aria-labelledby={compact ? "journey-home-title" : "journey-title"}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-gold">Private learning progress</p>
          <h2 id={compact ? "journey-home-title" : "journey-title"} className="font-display text-3xl text-parchment sm:text-4xl">Continue Your Qur’an Journey</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-parchment/60">
            {authenticated ? (syncState === "error" ? "Saved on this device; account sync is temporarily unavailable." : "Saved on this device and synchronized securely with your account.") : "Your progress is stored privately on this device. Sign in to synchronize it across devices."}
          </p>
        </div>
        {!authenticated ? <Link href="/login" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gold/30 px-4 text-sm font-bold text-gold hover:bg-gold/10"><LogIn size={17}/> Sign in to sync</Link> : null}
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <JourneyStat icon={BookOpen} label="Last read" value={data.lastRead ? `${data.lastRead.surahName} · Ayah ${data.lastRead.ayahNumber}` : "Begin reading"}/>
        <JourneyStat icon={Bookmark} label="Bookmarked ayahs" value={String(data.bookmarks.length)}/>
        <JourneyStat icon={CalendarCheck} label="Reading plan" value={data.plan ? `${planProgress}% complete` : "Not started"}/>
        <JourneyStat icon={Sparkles} label="Qur’an completed" value={`${percent.toFixed(percent < 1 ? 1 : 0)}%`}/>
      </div>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-gold/10" aria-label={`${percent.toFixed(1)} percent of Quran marked read`}><div className="h-full rounded-full bg-gold" style={{ width: `${percent}%` }}/></div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={continueUrl} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gold px-5 text-sm font-bold text-ink"><BookOpen size={17}/> Continue Reading</Link>
        <Link href={listenUrl} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gold/30 px-5 text-sm font-bold text-gold"><Headphones size={17}/> Continue Listening</Link>
        <Link href="/bookmarks" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gold/20 px-5 text-sm font-bold text-parchment/70"><Bookmark size={17}/> View Bookmarks</Link>
        {compact ? <Link href="/my-quran-journey" className="inline-flex min-h-11 items-center px-4 text-sm font-bold text-gold underline">Open full dashboard</Link> : null}
      </div>

      {!compact ? <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <JourneyList title="Recently opened" icon={History} empty="Surahs you intentionally interact with will appear here.">
          {recent.map(item => <Link key={item.number} href={`/quran/${item.slug}`} className="block rounded-xl bg-gold/5 px-4 py-3 text-sm font-semibold text-parchment hover:bg-gold/10">{item.number}. {item.name}</Link>)}
        </JourneyList>
        <JourneyList title="Recent reflection" icon={Sparkles} empty="Your latest saved reflection will appear here.">
          {latestReflection?.ayah ? <Link href="/quran-reflection#saved-reflections" className="block rounded-xl bg-gold/5 px-4 py-3 text-sm text-parchment"><strong>{latestReflection.ayah.surahName}</strong><br/><span className="text-parchment/60">Qur’an {latestReflection.ayah.surahNumber}:{latestReflection.ayah.ayahNumber}</span></Link> : null}
        </JourneyList>
        <JourneyList title="Today’s selected action" icon={CalendarCheck} empty="Choose an action in the reflection planner.">
          {todayAction ? <div className="rounded-xl bg-gold/5 px-4 py-3 text-sm text-parchment">{todayAction.description || todayAction.kind}</div> : null}
        </JourneyList>
      </div> : null}

      {!compact && (data.lastRead || data.recentSurahs.length || data.bookmarks.length) ? <button onClick={() => { if (confirm("Clear reading history and progress on this device and synchronized account? Bookmarks will also be removed.")) update(current => ({ ...current, lastRead: null, recentSurahs: [], bookmarks: [], completedAyahs: [], completedSurahs: [], plan: null })); }} className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-rose-700"><RotateCcw size={16}/> Reset journey data</button> : null}
    </section>
  );
}

function JourneyStat({ icon: Icon, label, value }: { icon: typeof BookOpen; label: string; value: string }) {
  return <div className="rounded-2xl border border-gold/10 bg-gold/5 p-4"><Icon className="mb-3 text-gold" size={20}/><p className="text-[10px] font-bold uppercase tracking-wider text-parchment/45">{label}</p><p className="mt-1 font-semibold text-parchment">{value}</p></div>;
}

function JourneyList({ title, icon: Icon, empty, children }: { title: string; icon: typeof BookOpen; empty: string; children: ReactNode }) {
  return <div className="rounded-2xl border border-gold/10 p-5"><h3 className="flex items-center gap-2 font-bold text-parchment"><Icon size={18} className="text-gold"/> {title}</h3><div className="mt-4 space-y-2">{Children.count(children) ? children : <p className="text-sm leading-6 text-parchment/50">{empty}</p>}</div></div>;
}
