"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SurahGrid from "@/components/SurahGrid";
import { useUILanguage } from "@/components/UILanguageProvider";

export default function ListenPage() {
  const { t } = useUILanguage();
  return <main className="min-h-screen bg-ink"><Navbar /><div className="px-5 pb-20 pt-40"><div className="mx-auto max-w-4xl text-center"><h1 className="font-display text-5xl text-parchment">{t("Listen to the Qur’an", "क़ुरआन सुनें", "قرآن سنیں")}</h1><p className="mt-5 text-lg text-parchment/80">{t("Choose a surah, select a voice, and tap Play.", "सूरह चुनें, आवाज़ चुनें और प्ले दबाएँ।", "سورت اور آواز منتخب کریں، پھر پلے دبائیں۔")}</p><Link href="/mushaf" className="mt-5 inline-block text-gold underline">{t("Want to read instead?", "पढ़ना चाहते हैं?", "پڑھنا چاہتے ہیں؟")}</Link></div><SurahGrid listening /></div><Footer /></main>;
}
