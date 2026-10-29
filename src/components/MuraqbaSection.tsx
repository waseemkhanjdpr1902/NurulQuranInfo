"use client";

import Link from "next/link";
import { BookOpen, Heart } from "lucide-react";
import { useUILanguage } from "@/components/UILanguageProvider";

export default function MuraqbaSection() {
  const { t, rtl } = useUILanguage();
  return (
    <section id="muraqba" dir={rtl ? "rtl" : "ltr"} className="mx-auto max-w-7xl px-6 py-16">
      <div className="rounded-3xl border border-gold/20 bg-gold/5 p-6 sm:p-10">
        <Heart className="mb-4 text-gold" aria-hidden="true" />
        <h2 className="text-3xl font-display text-parchment sm:text-4xl">
          {t("Remembrance and reflection", "ज़िक्र और ग़ौर-ओ-फ़िक्र", "ذکر اور غور و فکر")}
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-parchment/80">
          {t("The Qur’an connects remembrance of Allah with reassurance of the heart. Read the ayah with its translation and tafsir in context.", "क़ुरआन अल्लाह के ज़िक्र को दिल के इत्मिनान से जोड़ता है। आयत को उसके तर्जुमे और तफ़सीर के साथ पढ़ें।", "قرآن اللہ کے ذکر کو دل کے اطمینان سے جوڑتا ہے۔ آیت کو اس کے ترجمے اور تفسیر کے ساتھ پڑھیں۔")}
        </p>
        <Link href="/quran/ar-rad#verse-28" className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-xl border border-gold/30 px-4 py-3 font-semibold text-gold">
          <BookOpen size={20} aria-hidden="true" />{t("Read Ar-Ra’d 13:28", "अर-रअद 13:28 पढ़ें", "الرعد 13:28 پڑھیں")}
        </Link>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link href="/spiritual-guide" className="min-h-12 rounded-xl bg-white px-5 py-3 font-semibold text-parchment underline">{t("Referenced spiritual guide", "हवालों के साथ रूहानी रहनुमाई", "حوالوں کے ساتھ روحانی رہنمائی")}</Link>
          <Link href="/dua" className="min-h-12 rounded-xl bg-white px-5 py-3 font-semibold text-parchment underline">{t("Browse duas", "दुआएँ देखें", "دعائیں دیکھیں")}</Link>
        </div>
      </div>
    </section>
  );
}
