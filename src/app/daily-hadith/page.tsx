import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Breadcrumbs, RelatedTools, ToolGuidance } from "@/components/tooling";

export const metadata: Metadata = {
  title: "Daily Hadith",
  description: "Read a daily hadith with source, short reflection, and a practical action prompt.",
  alternates: {
    canonical: "/daily-hadith",
  },
};

const hadiths = [
  {
    source: "Sahih Bukhari 1",
    text: "Actions are only by intentions, and every person will have only what they intended.",
    reflection: "Renew your intention before work, study, worship, and service.",
  },
  {
    source: "Sahih Muslim 2699",
    text: "Whoever follows a path in pursuit of knowledge, Allah will make easy for him a path to Paradise.",
    reflection: "Make one sincere step in learning today, even if it is small.",
  },
  {
    source: "Sahih Bukhari 6018",
    text: "He is not merciful to people, Allah will not be merciful to him.",
    reflection: "Let mercy shape one conversation today.",
  },
];

export default function DailyHadithPage() {
  const hadith = hadiths[new Date().getDate() % hadiths.length];

  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      <section className="pt-40 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "Daily Hadith" }]} />
          <p className="text-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-6">Daily Hadith</p>
          <h1 className="text-5xl md:text-7xl font-display text-parchment mb-8">Prophetic wisdom for today</h1>
          <article className="glass p-8 md:p-12 rounded-[42px] border-gold/10">
            <p className="text-parchment/80 text-2xl md:text-3xl font-light leading-relaxed mb-8">&quot;{hadith.text}&quot;</p>
            <p className="text-gold/70 text-sm font-bold uppercase tracking-widest mb-6">{hadith.source}</p>
            <div className="p-5 rounded-2xl bg-white/5 text-parchment/55 leading-relaxed">{hadith.reflection}</div>
          </article>
        </div>
      </section>

      <ToolGuidance
        title="Learn one narration at a time"
        what="Daily Hadith highlights a short narration and a practical reflection to help connect knowledge with character."
        how={[
          "Read the narration carefully and note the source.",
          "Use the reflection prompt to choose one small action.",
          "Open the Hadith Library for more study and context.",
        ]}
      />
      <RelatedTools currentHref="/daily-hadith" />
      <Footer />
    </main>
  );
}
