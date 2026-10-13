"use client";

import { useUILanguage } from "@/components/UILanguageProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SurahGrid from "@/components/SurahGrid";
import { Book } from "lucide-react";

export default function QuranExplorerPage() {
  const { t } = useUILanguage();
  return (
    <main className="min-h-screen bg-ink">
      <Navbar />

      <div className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-gold/10 bg-gold/5 mb-6">
            <Book size={16} className="text-gold" />
            <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-bold">
              {t("Divine Guidance", "अल्लाह का मार्गदर्शन", "اللہ کی ہدایت")}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display text-parchment mb-6">
            {t("Explore the Qur’an", "क़ुरआन पढ़ें", "قرآن پڑھیں")}
          </h1>
          <p className="text-parchment/40 max-w-2xl mx-auto italic font-light">
            &quot;A Book which We have sent down to you, full of blessings, that
            they may ponder over its Verses, and that men of understanding may
            remember.&quot; — Sad 38:29
          </p>
        </div>

        <SurahGrid />
      </div>

      <Footer />
    </main>
  );
}
