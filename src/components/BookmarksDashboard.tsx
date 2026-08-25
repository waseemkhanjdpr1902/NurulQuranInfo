"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpen, Download, Search, Trash2 } from "lucide-react";
import { useQuranJourney } from "@/hooks/useQuranJourney";

export default function BookmarksDashboard() {
  const { data, loaded, authenticated, update } = useQuranJourney();
  const [query, setQuery] = useState("");
  const [surah, setSurah] = useState("all");
  const [collection, setCollection] = useState("all");
  const [sort, setSort] = useState<"newest" | "oldest" | "quran">("newest");
  const [editing, setEditing] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const collections = [...new Set(data.bookmarks.map(item => item.collection))].filter(Boolean).sort();
  const surahs = [...new Map(data.bookmarks.map(item => [item.surahNumber, item.surahName])).entries()].sort((a, b) => a[0] - b[0]);
  const filtered = useMemo(() => data.bookmarks.filter(item => {
    const text = `${item.surahName} ${item.english} ${item.hindi || ""} ${item.note}`.toLowerCase();
    return (!query || text.includes(query.toLowerCase())) && (surah === "all" || item.surahNumber === Number(surah)) && (collection === "all" || item.collection === collection);
  }).sort((a, b) => sort === "quran" ? a.globalAyahNumber - b.globalAyahNumber : sort === "oldest" ? a.createdAt.localeCompare(b.createdAt) : b.createdAt.localeCompare(a.createdAt)), [collection, data.bookmarks, query, sort, surah]);

  function download() {
    const blob = new Blob([JSON.stringify(data.bookmarks, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "nurulquran-private-bookmarks.json"; link.click(); URL.revokeObjectURL(url);
  }

  if (!loaded) return <div className="h-64 animate-pulse rounded-3xl bg-white/50"/>;

  return <section aria-labelledby="bookmarks-title">
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gold">Private library</p><h1 id="bookmarks-title" className="font-display text-4xl text-parchment sm:text-6xl">Bookmarks & Notes</h1><p className="mt-3 text-sm text-parchment/60">{authenticated ? "Synchronized securely with your account when available." : "Stored only on this device. Sign in to synchronize across devices."}</p></div>
      <button onClick={download} disabled={!data.bookmarks.length} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gold/25 px-4 text-sm font-bold text-gold disabled:opacity-40"><Download size={17}/> Export all</button>
    </div>

    <div className="mt-8 grid gap-3 rounded-3xl border border-gold/15 bg-white/70 p-4 sm:grid-cols-2 lg:grid-cols-4">
      <label className="relative"><span className="sr-only">Search bookmarks</span><Search className="absolute left-3 top-3.5 text-gold" size={18}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search ayah or note" className="min-h-11 w-full rounded-xl border border-gold/15 bg-ink pl-10 pr-3 text-sm"/></label>
      <select aria-label="Filter by surah" value={surah} onChange={event => setSurah(event.target.value)} className="min-h-11 rounded-xl border border-gold/15 bg-ink px-3 text-sm"><option value="all">All surahs</option>{surahs.map(([number, name]) => <option key={number} value={number}>{number}. {name}</option>)}</select>
      <select aria-label="Filter by collection" value={collection} onChange={event => setCollection(event.target.value)} className="min-h-11 rounded-xl border border-gold/15 bg-ink px-3 text-sm"><option value="all">All collections</option>{collections.map(value => <option key={value}>{value}</option>)}</select>
      <select aria-label="Sort bookmarks" value={sort} onChange={event => setSort(event.target.value as typeof sort)} className="min-h-11 rounded-xl border border-gold/15 bg-ink px-3 text-sm"><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="quran">Qur’an order</option></select>
    </div>

    <div className="mt-7 space-y-5">
      {!filtered.length ? <div className="rounded-3xl border border-dashed border-gold/25 p-10 text-center"><BookOpen className="mx-auto text-gold"/><h2 className="mt-4 font-display text-2xl">No bookmarks found</h2><p className="mt-2 text-sm text-parchment/55">Use the Bookmark or Private note action beside any ayah.</p><Link href="/quran" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-gold px-5 text-sm font-bold text-ink">Read the Qur’an</Link></div> : null}
      {filtered.map(item => <article key={item.id} className="rounded-3xl border border-gold/15 bg-white/75 p-5 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-gold">{item.surahName} · {item.surahNumber}:{item.ayahNumber}</p><span className="mt-2 inline-block rounded-full bg-gold/10 px-3 py-1 text-xs text-parchment/65">{item.collection}</span></div><button onClick={() => { if (confirm("Permanently delete this bookmark and its private note?")) update(current => ({ ...current, bookmarks: current.bookmarks.filter(bookmark => bookmark.id !== item.id) })); }} className="flex h-11 w-11 items-center justify-center rounded-full text-rose-700 hover:bg-rose-50" aria-label={`Delete bookmark ${item.surahNumber}:${item.ayahNumber}`}><Trash2 size={18}/></button></div>
        <p dir="rtl" lang="ar" className="mt-6 text-right font-arabic text-3xl leading-[2] text-parchment">{item.arabic}</p>
        <p className="mt-5 border-l-2 border-gold/20 pl-4 leading-7 text-parchment/70">{item.english}</p>
        {item.hindi ? <p lang="hi" className="mt-3 border-l-2 border-gold/20 pl-4 leading-7 text-parchment/70">{item.hindi}</p> : null}
        {editing === item.id ? <div className="mt-5"><label className="text-xs font-bold uppercase tracking-wider text-gold">Private note<textarea value={note} onChange={event => setNote(event.target.value)} maxLength={5000} rows={4} className="mt-2 w-full rounded-xl border border-gold/20 bg-ink p-3 text-base font-normal normal-case tracking-normal text-parchment"/></label><div className="mt-3 flex gap-3"><button onClick={() => { update(current => ({ ...current, bookmarks: current.bookmarks.map(bookmark => bookmark.id === item.id ? { ...bookmark, note: note.trim(), updatedAt: new Date().toISOString() } : bookmark) })); setEditing(null); }} className="min-h-11 rounded-xl bg-gold px-4 text-sm font-bold text-ink">Save note</button><button onClick={() => setEditing(null)} className="min-h-11 px-4 text-sm font-bold">Cancel</button></div></div> : item.note ? <div className="mt-5 rounded-xl bg-gold/5 p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-gold">Private note</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-parchment/70">{item.note}</p></div> : null}
        <div className="mt-5 flex flex-wrap gap-4"><Link href={`/quran/${item.surahSlug}#verse-${item.ayahNumber}`} className="text-sm font-bold text-gold underline">Open full surah</Link><button onClick={() => { setEditing(item.id); setNote(item.note); }} className="text-sm font-bold text-gold underline">Edit note</button></div>
      </article>)}
    </div>
  </section>;
}

