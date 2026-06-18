"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SurahGrid from "@/components/SurahGrid";
import { Book } from "lucide-react";
import { Breadcrumbs, RelatedTools, ToolGuidance } from "@/components/tooling";

export default function QuranExplorerPage() {
  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      
      <div className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "Quran Reading" }]} />
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-gold/10 bg-gold/5 mb-6">
            <Book size={16} className="text-gold" />
            <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-bold">Divine Guidance</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display text-parchment mb-6">Quran <span className="text-gold italic">Explorer</span></h1>
          <p className="text-parchment/40 max-w-2xl mx-auto italic font-light">
            &quot;A Book which We have sent down to you, full of blessings, that they may ponder over its Verses, and that men of understanding may remember.&quot; — Sad 38:29
          </p>
        </div>
        
        <SurahGrid />
      </div>

      <ToolGuidance
        title="Open a Surah for reading and study"
        what="The Quran explorer helps you find a Surah quickly and open the existing Quran reader for Arabic text, translation, tafsir study, and recitation."
        how={[
          "Search by Surah name, number, or Arabic title.",
          "Open a Surah card to continue into the reader.",
          "Use the reader controls already available there for study and listening.",
        ]}
      />
      <RelatedTools currentHref="/quran" />

      <Footer />
    </main>
  );
}
