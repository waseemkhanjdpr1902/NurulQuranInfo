import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "Our Sources and Methodology", description: "Learn how NurulQuran sources Quranic Arabic, translations, tafsir, recitation, topic mappings and protects private study data.", alternates: { canonical: "/sources" }, openGraph: { title: "Our Sources and Methodology | NurulQuran", description: "Transparent Quran, translation, tafsir, recitation and privacy methodology.", url: "/sources" } };

const sections = [
  ["Indian Mushaf page images", "The Arabic-only reader uses the King Fahd Qur’an Printing Complex Nasta’liq edition. Original scan images are served unchanged from 1uc1d23/IndoPak-15-Line-Naskh-Mushaf-Page-Images at pinned commit a93e8947229889a2e486d9b414fe94e69c72c6e4, original_pages only. The opening page and surah index were visually compared with the publisher’s edition. Its 610 Quran reading pages are scan files 6–615, printed pages 2–611. Navigation displays printed numbers to match the publisher’s original surah index (scan files 620–621). Front matter, instructions, prayers and covers are excluded from Quran reading pages. No Quran text or images are AI-generated or reconstructed. Zoom changes display size only. Page images require internet. Saved reading positions are separate from the previous Madani edition."],
  ["Qur’anic Arabic", "Arabic ayahs are retrieved from the fixed quran-uthmani edition through AlQuran Cloud. NurulQuran does not ask an AI model to generate, rewrite or correct the Arabic text."],
  ["Translations", "English uses Saheeh International (en.sahih). Hindi uses the AlQuran Cloud hi.hindi edition attributed by the source to Suhel Farooq Khan and Saifur Rahman Nadwi. Urdu uses Fateh Muhammad Jalandhry (ur.jalandhry). A selected translation is distinct from the Qur’anic Arabic and is not itself the Arabic Qur’an."],
  ["Tafsir", "English verse study uses Ibn Kathir (Abridged), and Urdu uses Tafsir Ibn Kathir, through the spa5k tafsir dataset with Quran.com API fallbacks. Hindi uses Al-Mukhtasar from the Tafsir Center for Quranic Studies, supplied by QuranEnc. Tafsir is kept separate from translation and general study reflections."],
  ["Recitation", "Recitation URLs are supplied by AlQuran Cloud/Islamic Network editions for the selected reciter. Existing recitation components and audio files are preserved. Audio is loaded only when requested."],
  ["Topic mapping", "Every reference in Explore the Qur’an by Topic is explicitly stored in a reviewed local mapping. AI is not used to invent or select Quran references. Introductions, questions and actions are labelled as general educational guidance, not tafsir or fatwa."],
  ["AI-assisted content", "AI may assist concise study notes only when configured. Server prompts prohibit alteration of Arabic, fabricated history or hadith, legal rulings, spiritual diagnosis, guaranteed outcomes and claims made on behalf of Allah. Safe non-AI fallbacks are used when needed."],
  ["Privacy and synchronization", "Logged-out journey data, bookmarks, notes, plans and reflections are stored on the current device. Signed-in synchronization uses Supabase tables protected by row-level security so each user can access only their own records. Private notes are never included in public share content."],
  ["Reporting an issue", "Please report an incorrect mapping, translation display issue or broken audio link with the surah and ayah reference. Reports are for review and do not directly modify Quran data."],
];

const sourceLinks: Record<string, { label: string; href: string }[]> = {
  "Indian Mushaf page images": [
    { label: "View original Mushaf scans", href: "https://github.com/1uc1d23/IndoPak-15-Line-Naskh-Mushaf-Page-Images/tree/a93e8947229889a2e486d9b414fe94e69c72c6e4/original_pages" },
  ],
  "Qur’anic Arabic": [{ label: "AlQuran Cloud documentation", href: "https://alquran.cloud/api" }],
  "Translations": [{ label: "Translation editions and documentation", href: "https://alquran.cloud/api" }],
  "Tafsir": [
    { label: "English and Urdu tafsir source", href: "https://github.com/spa5k/tafsir_api" },
    { label: "Hindi Al-Mukhtasar source", href: "https://quranenc.com/en/browse/hindi_mokhtasar" },
  ],
  "Recitation": [{ label: "Audio editions and documentation", href: "https://alquran.cloud/api" }],
};

export default function SourcesPage() {
  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      <article className="mx-auto max-w-4xl px-5 pb-24 sm:px-6" style={{ paddingTop: "calc(var(--navigation-height, 160px) + 32px)" }}>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Transparency</p>
        <h1 className="mt-3 break-words font-display text-4xl text-parchment sm:text-6xl">Our Sources and Methodology</h1>
        <p className="mt-5 text-lg leading-8 text-parchment/80">NurulQuran distinguishes the revealed Arabic text from translations, recognised tafsir, general educational reflection and AI-assisted summaries.</p>
        <div className="mt-10 space-y-5">
          {sections.map(([title, text]) => (
            <section key={title} className="min-w-0 rounded-3xl border border-gold/15 bg-ink p-5 sm:p-6">
              <h2 className="font-display text-2xl text-parchment">{title}</h2>
              <p className="mt-3 break-words leading-7 text-parchment/80">{text}</p>
              {sourceLinks[title] && (
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-3" aria-label={`${title} references`}>
                  {sourceLinks[title].map(({ label, href }) => (
                    <li key={href}>
                      <a href={href} target="_blank" rel="noopener noreferrer" className="inline-block py-2 font-semibold text-gold underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
                        {label}<span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              {title === "Indian Mushaf page images" && <p className="mt-3 text-sm leading-6 text-parchment/80">The publisher’s PDF download is currently unavailable. Use the original scan archive above to inspect the pages used by the reader.</p>}
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
