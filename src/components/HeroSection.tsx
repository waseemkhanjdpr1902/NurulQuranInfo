"use client";
import { BookOpen, Headphones, Clock, Heart, Sparkles } from "lucide-react";
import Link from "next/link";
import { useUILanguage } from "@/components/UILanguageProvider";
export default function HeroSection() {
  const { t, rtl } = useUILanguage();
  const actions = [
    {
      href: "/mushaf",
      icon: BookOpen,
      label: t("Indian Mushaf", "भारतीय मुशहफ़", "ہندوستانی مصحف"),
      help: t("Read like a printed Quran · Zoom", "कुरआन के पन्ने पढ़ें • ज़ूम करें", "مطبوعہ قرآن کی طرح پڑھیں • زوم"),
    },
    {
      href: "/quran",
      icon: BookOpen,
      label: t("Read Qur’an", "क़ुरआन पढ़ें", "قرآن پڑھیں"),
      help: t(
        "Choose a surah and translation",
        "सूरह और अनुवाद चुनें",
        "سورت اور ترجمہ منتخب کریں",
      ),
    },
    {
      href: "/quran/al-faatiha?autoplay=true",
      icon: Headphones,
      label: t("Listen", "तिलावत सुनें", "تلاوت سنیں"),
      help: t(
        "Arabic + Urdu, or Arabic only",
        "अरबी + उर्दू, या केवल अरबी",
        "عربی + اردو، یا صرف عربی",
      ),
    },
    {
      href: "/prayer-times",
      icon: Clock,
      label: t("Prayer times", "नमाज़ का समय", "نماز کے اوقات"),
      help: t(
        "Times for your city",
        "आपके शहर के अनुसार समय",
        "آپ کے شہر کے مطابق اوقات",
      ),
    },
    {
      href: "/dua",
      icon: Heart,
      label: t("Daily duas", "रोज़मर्रा की दुआएँ", "روزمرہ کی دعائیں"),
      help: t(
        "Browse the dua library",
        "दुआओं का संग्रह देखें",
        "دعاؤں کا مجموعہ دیکھیں",
      ),
    },
  ];
  return (
    <section
      dir={rtl ? "rtl" : "ltr"}
      className="relative overflow-hidden px-4 pb-10 pt-44 sm:px-6 sm:pb-14 sm:pt-48"
    >
      <div className="mx-auto max-w-6xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-2 text-sm text-gold">
          <Sparkles size={16} />
          {t(
            "Read · Reflect · Remember",
            "पढ़ें · समझें · याद करें",
            "پڑھیں · غور کریں · یاد کریں",
          )}
        </span>
        <h1 className="mt-5 text-5xl font-display text-parchment sm:text-7xl">
          Nurul<span className="text-gold">Quran</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-parchment/80 sm:text-lg">
          {t(
            "Read the Qur’an, listen with Urdu translation, and find prayer times for your location.",
            "क़ुरआन पढ़ें, उर्दू तर्जुमे के साथ तिलावत सुनें और अपने स्थान के अनुसार नमाज़ का समय देखें।",
            "قرآن پڑھیں، اردو ترجمے کے ساتھ تلاوت سنیں اور اپنے مقام کے مطابق نماز کے اوقات دیکھیں۔",
          )}
        </p>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {actions.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-2xl border border-gold/25 bg-white p-4 text-parchment shadow-sm transition-colors hover:bg-gold/10"
            >
              <a.icon size={26} className="text-gold" />
              <span className="text-base font-semibold sm:text-lg">
                {a.label}
              </span>
              <span className="text-xs leading-relaxed text-parchment/75 sm:text-sm">
                {a.help}
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-5 text-sm text-parchment/75">
          {t(
            "Free reading and listening · No sign-in needed · Tap Play to start audio",
            "पढ़ना और सुनना मुफ़्त · लॉगिन ज़रूरी नहीं · ऑडियो के लिए प्ले दबाएँ",
            "پڑھنا اور سننا مفت · لاگ اِن ضروری نہیں · آڈیو کے لیے پلے دبائیں",
          )}
        </p>
      </div>
    </section>
  );
}
