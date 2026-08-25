"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { QURAN_TOPICS } from "@/data/quran-topics";

export default function QuranTopicsExplorer() {
  const [query, setQuery] = useState("");
  const topics = useMemo(() => QURAN_TOPICS.filter(topic => `${topic.title} ${topic.introduction}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return <section>
    <div className="mx-auto max-w-3xl text-center"><p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-gold">Reviewed thematic guide</p><h1 className="font-display text-5xl text-parchment sm:text-7xl">Explore the Qur’an by Topic</h1><p className="mt-5 leading-7 text-parchment/60">Discover manually mapped Qur’anic passages through established themes. This is an educational index—not divination, diagnosis, personalised revelation or a fatwa service.</p></div>
    <label className="relative mx-auto mt-10 block max-w-xl"><span className="sr-only">Search Quran topics</span><Search className="absolute left-4 top-4 text-gold" size={20}/><input value={query} onChange={event => setQuery(event.target.value)} className="min-h-13 w-full rounded-2xl border border-gold/20 bg-white/75 pl-12 pr-4 shadow-sm" placeholder="Search patience, rizq, family…"/></label>
    <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{topics.map(topic => <article key={topic.slug} className="flex flex-col rounded-3xl border border-gold/15 bg-white/70 p-6 shadow-sm"><h2 className="font-display text-2xl text-parchment">{topic.title}</h2><p className="mt-3 flex-1 text-sm leading-6 text-parchment/60">{topic.introduction}</p><p className="mt-4 text-xs font-semibold text-gold">{topic.ayahs.length} reviewed passages</p><Link href={`/quran-topics/${topic.slug}`} className="mt-5 inline-flex min-h-11 items-center gap-2 font-bold text-gold">Explore topic <ArrowRight size={17}/></Link></article>)}</div>
    {!topics.length ? <p className="mt-10 text-center text-parchment/55">No topic matched your search.</p> : null}
  </section>;
}

