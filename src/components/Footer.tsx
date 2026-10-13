"use client";

import { useUILanguage } from "@/components/UILanguageProvider";
import { Sparkles, Heart, Globe } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const { t, language, rtl } = useUILanguage();
  const links = {
    explore: [
      {
        name: t("Digital Quran", "क़ुरआन पढ़ें", "قرآن پڑھیں"),
        href: "/quran",
      },
      {
        name: t("Hadith Library", "हदीस संग्रह", "حدیث کا مجموعہ"),
        href: "/hadith",
      },
      {
        name: t("Tafseer & AI", "तफ़सीर और AI", "تفسیر اور AI"),
        href: "/tafseer",
      },
      {
        name: t("Islamic Science", "इस्लामी अध्ययन", "اسلامی مطالعہ"),
        href: "/islamic-science",
      },
    ],
    tools: [
      { name: t("Supplications", "दुआएँ", "دعائیں"), href: "/dua" },
      {
        name: t("Tasbih Counter", "तस्बीह काउंटर", "تسبیح کاؤنٹر"),
        href: "/tasbih",
      },
      {
        name: t("Zakat Calculator", "ज़कात कैलकुलेटर", "زکوٰۃ کیلکولیٹر"),
        href: "/zakat",
      },
      {
        name: t("Prayer Times", "नमाज़ का समय", "نماز کے اوقات"),
        href: "/prayer-times",
      },
    ],
    learn: [
      {
        name: t("Names of Allah", "अल्लाह के नाम", "اللہ کے نام"),
        href: "/names-of-allah",
      },
      {
        name: t("Qur’an Reflection", "क़ुरआन पर चिंतन", "قرآن پر غور و فکر"),
        href: "/quran-reflection",
      },
      {
        name: t(
          "My Qur’an Journey",
          "मेरी क़ुरआन प्रगति",
          "میری قرآنی پیش رفت",
        ),
        href: "/my-quran-journey",
      },
      {
        name: t("Qur’an Topics", "क़ुरआन के विषय", "قرآن کے موضوعات"),
        href: "/quran-topics",
      },
      {
        name: t("Reading Plan", "पढ़ने की योजना", "پڑھنے کا منصوبہ"),
        href: "/quran-reading-plan",
      },
      { name: t("Sources", "स्रोत", "ماخذ"), href: "/sources" },
      {
        name: t("Spiritual Guide", "रूहानी मार्गदर्शन", "روحانی رہنمائی"),
        href: "/spiritual-guide",
      },
      { name: t("AI Dawah", "AI दावत", "AI دعوت"), href: "/dawah" },
      { name: t("Dashboard", "डैशबोर्ड", "ڈیش بورڈ"), href: "/dashboard" },
    ],
  };

  return (
    <footer
      dir={rtl ? "rtl" : "ltr"}
      className="bg-ink pt-20 md:pt-28 pb-10 px-6 border-t border-white/5 relative overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gold/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16 mb-16 md:mb-20">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-4 mb-8 group">
              <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center text-ink shadow-lg shadow-gold/20">
                <Sparkles size={20} />
              </div>
              <span className="text-2xl font-display font-bold text-parchment tracking-tight">
                Nurul<span className="text-gold">Quran</span>
              </span>
            </Link>
            <p className="text-parchment/40 text-sm leading-relaxed mb-10 max-w-sm">
              {t(
                "Read, listen and learn with clear sources. Built for the Ummah.",
                "स्पष्ट स्रोतों के साथ पढ़ें, सुनें और सीखें। उम्मत की सेवा के लिए।",
                "واضح ماخذ کے ساتھ پڑھیں، سنیں اور سیکھیں۔ امت کی خدمت کے لیے۔",
              )}
            </p>
            <Link
              href="/quran"
              className="inline-flex items-center rounded-xl border border-gold/20 px-5 py-3 text-xs font-bold uppercase tracking-widest text-gold hover:bg-gold/10 transition-colors"
            >
              {t("Begin reading", "पढ़ना शुरू करें", "پڑھنا شروع کریں")}
            </Link>
          </div>

          <FooterColumn
            title={t("Explore", "देखें", "دیکھیں")}
            links={links.explore}
          />
          <FooterColumn title={t("Tools", "टूल", "ٹول")} links={links.tools} />
          <FooterColumn
            title={t("Learn", "सीखें", "سیکھیں")}
            links={links.learn}
          />
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-[10px] uppercase tracking-[0.3em] font-bold text-parchment/20">
          <p>© 2026 NurulQuran. Read, reflect and remember.</p>
          <div className="flex items-center gap-2 text-gold/30">
            Made with <Heart size={10} className="fill-gold animate-pulse" />{" "}
            for the Ummah
          </div>
          <div className="flex items-center gap-3">
            <Globe size={12} className="text-gold/20" />
            <span>
              {language === "hi"
                ? "हिन्दी"
                : language === "ur"
                  ? "اردو"
                  : "English"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { name: string; href: string }[];
}) {
  return (
    <div className="lg:col-span-1">
      <h4 className="text-parchment font-bold mb-8 uppercase tracking-[0.3em] text-xs pb-4 border-b border-white/5 inline-block">
        {title}
      </h4>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="text-parchment/40 hover:text-gold transition-all flex items-center group text-sm font-light"
            >
              <span className="group-hover:translate-x-1 transition-transform">
                {link.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
