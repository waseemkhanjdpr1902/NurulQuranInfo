import type { Metadata } from "next";
import QuranReflectionPlanner from "@/components/QuranReflectionPlanner";

export const metadata: Metadata = {
  title: "Qur’an Reflection and Daily Action Planner",
  description: "Reflect on Qur’anic ayahs, record personal lessons and turn Quranic guidance into meaningful daily actions.",
  alternates: { canonical: "/quran-reflection" },
  openGraph: {
    title: "Qur’an Reflection and Daily Action Planner | NurulQuran",
    description: "Select a verified Qur’anic ayah, reflect privately and choose one meaningful daily action.",
    url: "/quran-reflection",
    type: "website",
  },
};

const faq = [
  { q: "Is this tool a tafsir or fatwa service?", a: "No. It supports personal learning and reflection. Formal tafsir and religious rulings should be sought from recognised scholars and reliable works." },
  { q: "Where does the Qur’anic text come from?", a: "Arabic, translations, transliteration and recitation are retrieved from AlQuran Cloud using fixed verified edition identifiers. AI is never permitted to generate Arabic ayah text." },
  { q: "Are my reflections private?", a: "Logged-out reflections remain in your browser. Signed-in users can synchronise reflections when the NurulQuran Supabase reflection table is configured." },
];

export default function QuranReflectionPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(item => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <QuranReflectionPlanner />
    </>
  );
}
