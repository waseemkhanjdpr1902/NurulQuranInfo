import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { QURAN_TOPICS } from "@/data/quran-topics";

export default function DawahPage() {
  const topics = QURAN_TOPICS.filter(topic => ["good-character", "knowledge-and-reflection", "hope-and-mercy", "justice"].includes(topic.slug));
  return <main className="min-h-screen bg-ink text-parchment">
    <Navbar />
    <div className="mx-auto max-w-5xl px-5 pb-16" style={{paddingTop:"calc(var(--navigation-height, 160px) + 24px)"}}>
      <p className="font-bold text-gold">DAWAH · दावत · دعوت</p>
      <h1 className="mt-3 text-4xl font-display">Learn about Islam through clear sources</h1>
      <p className="mt-4 text-lg leading-8">Begin with the Qur’an, published translations and tafsir. The reading topics below use NurulQuran’s existing topic summaries and selected verse references. These summaries are educational introductions, not quotations or personal religious rulings.</p>
      <p className="mt-4 leading-8" lang="hi">कुरआन, तर्जुमा और तफ़सीर से शुरुआत करें। नीचे मौजूदा मौज़ू और आयतों के हवाले दिए हैं। निजी दीनी मसलों के लिए किसी मुस्तनद आलिम से पूछें।</p>
      <p className="mt-3 text-xl leading-9" lang="ur" dir="rtl">قرآن، ترجمہ اور تفسیر سے آغاز کریں۔ نیچے موجود موضوعات اور آیات کے حوالے دیے گئے ہیں۔ ذاتی دینی مسائل کے لیے کسی مستند عالم سے پوچھیں۔</p>
      <div className="mt-6 rounded-2xl border border-gold/25 bg-white p-5">
        <h2 className="text-xl font-bold">Reading and references</h2>
        <p className="mt-2 leading-7">The AI chat on this page is disabled. Use the topic links to read the referenced ayahs and their published explanations.</p>
        <div className="mt-4 flex flex-wrap gap-3">{[{href:"/quran",label:"Read Quran · कुरआन · قرآن"},{href:"/quran-topics",label:"Browse topics"},{href:"/sources",label:"Sources & methodology"}].map(link => <Link key={link.href} href={link.href} className="inline-flex min-h-11 items-center rounded-xl bg-[#075c3a] px-4 py-2 font-semibold text-white">{link.label}</Link>)}</div>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">{topics.map(topic => <article key={topic.slug} className="rounded-2xl border border-gold/25 bg-white p-6">
        <h2 className="text-2xl font-bold">{topic.title}</h2><p className="mt-3 leading-7">{topic.introduction}</p>
        <p className="mt-4 text-sm font-semibold">Selected Quran references: {topic.ayahs.map(ayah => `${ayah.surah}:${ayah.ayah}`).join(", ")}</p>
        <Link href={`/quran-topics/${topic.slug}`} className="mt-4 inline-flex min-h-11 items-center font-bold text-[#075c3a] underline">Read ayahs, translation and topic</Link>
      </article>)}</div>
      <Link href="/#quick-guide" className="mt-8 inline-flex min-h-11 items-center font-semibold underline">How to use NurulQuran</Link>
    </div><Footer />
  </main>;
}
