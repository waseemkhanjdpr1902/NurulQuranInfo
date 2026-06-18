import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Breadcrumbs, RelatedTools, ToolGuidance } from "@/components/tooling";

export const metadata: Metadata = {
  title: "Daily Verse",
  description: "Reflect on a daily Quran verse with translation, short reflection, and sharing prompt.",
  alternates: {
    canonical: "/daily-verse",
  },
};

const verses = [
  {
    ref: "Quran 2:286",
    ar: "لَا يُكَلِّفُ ٱللَّـهُ نَفْسًا إِلَّا وُسْعَهَا",
    tr: "Allah does not burden a soul beyond that it can bear.",
    reflection: "Begin with trust: Allah knows your capacity and sees your effort.",
  },
  {
    ref: "Quran 13:28",
    ar: "أَلَا بِذِكْرِ ٱللَّـهِ تَطْمَئِنُّ ٱلْقُلُوبُ",
    tr: "Surely in the remembrance of Allah do hearts find comfort.",
    reflection: "Return to dhikr when the heart feels scattered.",
  },
  {
    ref: "Quran 94:6",
    ar: "إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
    tr: "Indeed, with hardship comes ease.",
    reflection: "Look for the door of ease Allah opens alongside the trial.",
  },
];

export default function DailyVersePage() {
  const verse = verses[new Date().getDate() % verses.length];

  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      <section className="pt-40 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "Daily Verse" }]} />
          <p className="text-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-6">Daily Verse</p>
          <h1 className="text-5xl md:text-7xl font-display text-parchment mb-8">A Quran reflection for today</h1>
          <article className="glass p-8 md:p-12 rounded-[42px] border-gold/10">
            <p className="text-right font-arabic text-4xl md:text-6xl text-gold leading-loose mb-8">{verse.ar}</p>
            <p className="text-parchment/80 text-xl leading-relaxed mb-5">&quot;{verse.tr}&quot;</p>
            <p className="text-gold/70 text-sm font-bold uppercase tracking-widest mb-6">{verse.ref}</p>
            <div className="p-5 rounded-2xl bg-white/5 text-parchment/55 leading-relaxed">{verse.reflection}</div>
          </article>
        </div>
      </section>

      <ToolGuidance
        title="Reflect with one ayah"
        what="Daily Verse gives you a focused Quran reminder to read, reflect on, and share with family or friends."
        how={[
          "Read the Arabic slowly and then the translation.",
          "Pause on the reflection and write one action for the day.",
          "Open the Quran tool for broader context and tafsir study.",
        ]}
      />
      <RelatedTools currentHref="/daily-verse" />
      <Footer />
    </main>
  );
}
