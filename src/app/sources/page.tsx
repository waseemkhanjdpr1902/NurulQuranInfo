import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "Our Sources and Methodology", description: "Learn how NurulQuran sources Quranic Arabic, translations, tafsir, recitation, topic mappings and protects private study data.", alternates: { canonical: "/sources" }, openGraph: { title: "Our Sources and Methodology | NurulQuran", description: "Transparent Quran, translation, tafsir, recitation and privacy methodology.", url: "/sources" } };

const sections = [
  ["Qur’anic Arabic", "Arabic ayahs are retrieved from the fixed quran-uthmani edition through AlQuran Cloud. NurulQuran does not ask an AI model to generate, rewrite or correct the Arabic text."],
  ["Translations", "English uses Saheeh International (en.sahih). Hindi uses the AlQuran Cloud hi.hindi edition attributed by the source to Suhel Farooq Khan and Saifur Rahman Nadwi. Urdu uses Fateh Muhammad Jalandhry (ur.jalandhry). A selected translation is distinct from the Qur’anic Arabic and is not itself the Arabic Qur’an."],
  ["Tafsir", "The current verse-study source is the English Ibn Kathir dataset exposed through the open spa5k tafsir API and, where linked, Quran.com. Hindi tafsir is not displayed because a reliable, legally usable Hindi dataset has not yet been confirmed."],
  ["Recitation", "Recitation URLs are supplied by AlQuran Cloud/Islamic Network editions for the selected reciter. Existing recitation components and audio files are preserved. Audio is loaded only when requested."],
  ["Topic mapping", "Every reference in Explore the Qur’an by Topic is explicitly stored in a reviewed local mapping. AI is not used to invent or select Quran references. Introductions, questions and actions are labelled as general educational guidance, not tafsir or fatwa."],
  ["AI-assisted content", "AI may assist concise study notes only when configured. Server prompts prohibit alteration of Arabic, fabricated history or hadith, legal rulings, spiritual diagnosis, guaranteed outcomes and claims made on behalf of Allah. Safe non-AI fallbacks are used when needed."],
  ["Privacy and synchronization", "Logged-out journey data, bookmarks, notes, plans and reflections are stored on the current device. Signed-in synchronization uses Supabase tables protected by row-level security so each user can access only their own records. Private notes are never included in public share content."],
  ["Reporting an issue", "Please report an incorrect mapping, translation display issue or broken audio link with the surah and ayah reference. Reports are for review and do not directly modify Quran data."],
];

export default function SourcesPage() { return <main className="min-h-screen bg-ink"><Navbar/><article className="mx-auto max-w-4xl px-5 pb-24 pt-36 sm:px-6 sm:pt-44"><p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Transparency</p><h1 className="mt-3 font-display text-5xl text-parchment sm:text-7xl">Our Sources and Methodology</h1><p className="mt-5 text-lg leading-8 text-parchment/65">NurulQuran distinguishes the revealed Arabic text from translations, recognised tafsir, general educational reflection and AI-assisted summaries.</p><div className="mt-10 space-y-5">{sections.map(([title, text]) => <section key={title} className="rounded-3xl border border-gold/15 bg-white/70 p-6"><h2 className="font-display text-2xl text-parchment">{title}</h2><p className="mt-3 leading-7 text-parchment/65">{text}</p></section>)}</div><div className="mt-8 flex flex-wrap gap-4"><Link href="/quran" className="font-bold text-gold underline">Read the Qur’an</Link><Link href="/quran-topics" className="font-bold text-gold underline">Explore topics</Link><a href="mailto:contact@nurulquran.info?subject=NurulQuran%20source%20or%20display%20issue" className="font-bold text-gold underline">Report an issue</a></div></article><Footer/></main>; }

