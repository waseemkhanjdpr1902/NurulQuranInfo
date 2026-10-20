import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "Our Sources and Methodology", description: "Learn how NurulQuran sources Quranic Arabic, translations, tafsir, recitation, topic mappings and protects private study data.", alternates: { canonical: "/sources" }, openGraph: { title: "Our Sources and Methodology | NurulQuran", description: "Transparent Quran, translation, tafsir, recitation and privacy methodology.", url: "/sources" } };

const sections = [
  ["Indian Mushaf page images", "The Arabic-only reader uses the King Fahd Qur’an Printing Complex Nasta’liq edition. The publisher’s PDF is temporarily unavailable; the original scan archive is linked below. Original scan images are served unchanged from 1uc1d23/IndoPak-15-Line-Naskh-Mushaf-Page-Images at pinned commit a93e8947229889a2e486d9b414fe94e69c72c6e4, original_pages only. The opening page and surah index were visually compared with the publisher’s edition. Its 610 Quran reading pages are scan files 6–615, printed pages 2–611. Navigation displays printed numbers to match the publisher’s original surah index (scan files 620–621). Front matter, instructions, prayers and covers are excluded from Quran reading pages. No Quran text or images are AI-generated or reconstructed. Zoom changes display size only. Page images require internet. Saved reading positions are separate from the previous Madani edition."],
  ["Qur’anic Arabic", "Arabic ayahs are retrieved from the fixed quran-uthmani edition through AlQuran Cloud. NurulQuran does not ask an AI model to generate, rewrite or correct the Arabic text."],
  ["Translations", "English uses Saheeh International (en.sahih). Hindi uses the AlQuran Cloud hi.hindi edition attributed by the source to Suhel Farooq Khan and Saifur Rahman Nadwi. Urdu uses Fateh Muhammad Jalandhry (ur.jalandhry). A selected translation is distinct from the Qur’anic Arabic and is not itself the Arabic Qur’an."],
  ["Tafsir", "Verse study offers Ibn Kathir (Abridged) in English and Ibn Kathir in Urdu through the spa5k tafsir dataset and Quran.com. Hindi uses Al-Mukhtasar from QuranEnc, attributed to the Tafsir Center for Quranic Studies. Tafsir is an explanation of the Qur’an and is displayed separately from translation."],
  ["Recitation", "Recitation URLs are supplied by AlQuran Cloud/Islamic Network editions for the selected reciter. Existing recitation components and audio files are preserved. Audio is loaded only when requested."],
  ["Topic mapping", "Every reference in Explore the Qur’an by Topic is explicitly stored in a reviewed local mapping. AI is not used to invent or select Quran references. Introductions, questions and actions are labelled as general educational guidance, not tafsir or fatwa."],
  ["AI-assisted content", "AI may assist concise study notes only when configured. Server prompts prohibit alteration of Arabic, fabricated history or hadith, legal rulings, spiritual diagnosis, guaranteed outcomes and claims made on behalf of Allah. Safe non-AI fallbacks are used when needed."],
  ["Privacy and synchronization", "Logged-out journey data, bookmarks, notes, plans and reflections are stored on the current device. Signed-in synchronization uses Supabase tables protected by row-level security so each user can access only their own records. Private notes are never included in public share content."],
  ["Reporting an issue", "Please report an incorrect mapping, translation display issue or broken audio link with the surah and ayah reference. Reports are for review and do not directly modify Quran data."],
];

const sourceLinks: Record<string, { label: string; href: string }[]> = {
  "Indian Mushaf page images": [{ label: "Original Mushaf scan archive", href: "https://github.com/1uc1d23/IndoPak-15-Line-Naskh-Mushaf-Page-Images/tree/a93e8947229889a2e486d9b414fe94e69c72c6e4/original_pages" }],
  "Qur’anic Arabic": [{ label: "AlQuran Cloud documentation", href: "https://alquran.cloud/api" }],
  "Translations": [{ label: "Translation editions", href: "https://alquran.cloud/api" }],
  "Tafsir": [
    { label: "Ibn Kathir dataset", href: "https://github.com/spa5k/tafsir_api" },
    { label: "Hindi Al-Mukhtasar", href: "https://quranenc.com/en/browse/hindi_mokhtasar" },
  ],
  "Recitation": [{ label: "Recitation API documentation", href: "https://alquran.cloud/api" }],
};

export default function SourcesPage() {
  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      <article className="mx-auto max-w-4xl px-5 pb-24 pt-36 sm:px-6 sm:pt-44">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Transparency</p>
        <h1 className="mt-3 font-display text-4xl text-parchment sm:text-7xl">Our Sources and Methodology</h1>
        <p className="mt-5 text-lg leading-8 text-parchment/80">NurulQuran distinguishes the revealed Arabic text from translations, recognised tafsir, general educational reflection and AI-assisted summaries.</p>
        <p className="mt-3 text-sm leading-6 text-parchment/80">Use the labelled links below to visit our source providers. External sources open in a new tab; their availability is managed by the provider.</p>
        <div className="mt-10 space-y-5">
          {sections.map(([title, text]) => (
            <section key={title} className="min-w-0 rounded-3xl border border-gold/15 bg-white/70 p-6">
              <h2 className="font-display text-2xl text-parchment">{title}</h2>
              <p className="mt-3 break-words leading-7 text-parchment/80">{text}</p>
              {sourceLinks[title] && (
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                  {sourceLinks[title].map(({ label, href }) => (
                    <li key={href} className="min-w-0">
                      <a href={href} target="_blank" rel="noopener noreferrer" className="inline-block break-words py-2 font-bold text-gold underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">{label}<span className="sr-only"> (opens in a new tab)</span></a>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/quran" className="py-2 font-bold text-gold underline">Read the Qur’an</Link>
          <Link href="/quran-topics" className="py-2 font-bold text-gold underline">Explore topics</Link>
          <a href="mailto:contact@nurulquran.info?subject=NurulQuran%20source%20or%20display%20issue" className="py-2 font-bold text-gold underline">Report an issue</a>
        </div>
      </article>
      <Footer />
    </main>
  );
}
