"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useUILanguage } from "@/components/UILanguageProvider";

export default function SpiritualGuidePage() {
  const { t, rtl } = useUILanguage();
  const sections = [
    { title: t("Remembrance", "ज़िक्र", "ذکر"), reference: "Ar-Ra’d 13:28", href: "/quran/ar-rad#verse-28", text: t("Reflect on the connection between remembrance of Allah and reassurance of the heart.", "अल्लाह के ज़िक्र और दिल के इत्मिनान के ताल्लुक़ पर ग़ौर करें।", "اللہ کے ذکر اور دل کے اطمینان کے تعلق پر غور کریں۔") },
    { title: t("Repentance and hope", "तौबा और उम्मीद", "توبہ اور امید"), reference: "Az-Zumar 39:53", href: "/quran/az-zumar#verse-53", text: t("Read Allah’s invitation not to despair of His mercy, together with the surrounding ayahs and tafsir.", "अल्लाह की रहमत से मायूस न होने की आयत को आस-पास की आयतों और तफ़सीर के साथ पढ़ें।", "اللہ کی رحمت سے مایوس نہ ہونے کی آیت کو آس پاس کی آیات اور تفسیر کے ساتھ پڑھیں۔") },
    { title: t("Self-reflection", "अपना मुहासबा", "اپنا محاسبہ"), reference: "Al-Hashr 59:18", href: "/quran/al-hashr#verse-18", text: t("Consider your actions and what you are preparing for the Hereafter. The reflection question here is an editorial study prompt, not a quotation or prescribed ritual.", "अपने आमाल और आख़िरत की तैयारी पर ग़ौर करें। यह सवाल अध्ययन में मदद के लिए है; उद्धरण या तयशुदा अमल नहीं है।", "اپنے اعمال اور آخرت کی تیاری پر غور کریں۔ یہ سوال مطالعے میں مدد کے لیے ہے؛ اقتباس یا مقررہ عمل نہیں ہے۔") },
  ];
  return <main className="min-h-screen bg-ink">
    <Navbar />
    <article dir={rtl ? "rtl" : "ltr"} className="mx-auto max-w-4xl px-5 pb-20 pt-[calc(var(--navigation-height,144px)+32px)]">
      <h1 className="text-4xl font-display text-parchment">{t("Spiritual guide", "रूहानी रहनुमाई", "روحانی رہنمائی")}</h1>
      <p className="mt-4 text-lg leading-relaxed text-parchment/80">{t("General reading prompts with Quran references. These summaries are not quotations, tafsir or personal religious rulings. Open each source to read the ayah, translation and tafsir.", "क़ुरआनी हवालों के साथ आम अध्ययन के सवाल। ये ख़ुलासे उद्धरण, तफ़सीर या निजी फ़तवे नहीं हैं। हर हवाला खोलकर आयत, तर्जुमा और तफ़सीर पढ़ें।", "قرآنی حوالوں کے ساتھ عمومی مطالعے کے سوالات۔ یہ خلاصے اقتباس، تفسیر یا ذاتی فتوے نہیں ہیں۔ ہر حوالہ کھول کر آیت، ترجمہ اور تفسیر پڑھیں۔")}</p>
      <div className="mt-8 space-y-5">{sections.map(section => <section key={section.reference} className="rounded-2xl border border-gold/20 bg-white p-6">
        <h2 className="text-2xl font-display">{section.title}</h2>
        <p className="mt-3 leading-relaxed">{section.text}</p>
        <Link href={section.href} className="mt-4 inline-flex min-h-12 items-center font-semibold text-gold underline">{section.reference}</Link>
      </section>)}</div>
      <Link href="/sources" className="mt-8 inline-flex min-h-12 items-center font-semibold text-gold underline">{t("Sources and methodology", "स्रोत और कार्यप्रणाली", "ماخذ اور طریقۂ کار")}</Link>
    </article>
    <Footer />
  </main>;
}
