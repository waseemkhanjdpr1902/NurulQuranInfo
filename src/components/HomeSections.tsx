"use client";
import Link from "next/link";
import {
  Clock,
  Landmark,
  Heart,
  Compass,
  Atom,
  BookOpen,
  Sparkles,
  MessageSquare,
  CircleDot,
} from "lucide-react";
import { useUILanguage } from "@/components/UILanguageProvider";
export default function HomeSections() {
  const { t, rtl } = useUILanguage();
  const tools = [
    {
      href: "/prayer-times",
      icon: Clock,
      title: t("Prayer times", "नमाज़ का समय", "نماز کے اوقات"),
    },
    { href: "/dua", icon: Heart, title: t("Duas", "दुआएँ", "دعائیں") },
    {
      href: "/prayer-times",
      icon: Compass,
      title: t("Qibla finder", "क़िब्ला की दिशा", "قبلہ کی سمت"),
    },
    {
      href: "/tasbih",
      icon: CircleDot,
      title: t("Tasbih counter", "तस्बीह काउंटर", "تسبیح کاؤنٹر"),
    },
    {
      href: "/names-of-allah",
      icon: BookOpen,
      title: t("Names of Allah", "अल्लाह के नाम", "اللہ کے نام"),
    },
    {
      href: "/zakat",
      icon: Landmark,
      title: t("Zakat calculator", "ज़कात कैलकुलेटर", "زکوٰۃ کیلکولیٹر"),
    },
    {
      href: "/quran-reflection",
      icon: Sparkles,
      title: t("Qur’an reflection", "क़ुरआन पर चिंतन", "قرآن پر غور و فکر"),
    },
    {
      href: "/islamic-science",
      icon: Atom,
      title: t("Islamic study", "इस्लामी अध्ययन", "اسلامی مطالعہ"),
    },
    {
      href: "/dawah",
      icon: MessageSquare,
      title: t("Dawah & learning", "दावत और तालीम", "دعوت اور تعلیم"),
    },
  ];
  const faqs = [
    {
      q: t("Is it free?", "क्या यह मुफ़्त है?", "کیا یہ مفت ہے؟"),
      a: t(
        "Qur’an reading, listening and the core Islamic tools are free. No sign-in is needed to begin.",
        "क़ुरआन पढ़ना, सुनना और मुख्य इस्लामी टूल मुफ़्त हैं। शुरुआत के लिए लॉगिन ज़रूरी नहीं है।",
        "قرآن پڑھنا، سننا اور بنیادی اسلامی ٹول مفت ہیں۔ شروع کرنے کے لیے لاگ اِن ضروری نہیں ہے۔",
      ),
    },
    {
      q: t(
        "Do I need internet?",
        "क्या इंटरनेट ज़रूरी है?",
        "کیا انٹرنیٹ ضروری ہے؟",
      ),
      a: t(
        "In Indian Mushaf, open Offline reading downloads to save a page, surah or para on this device. Check that your pages are available offline before disconnecting. Audio, translations and tafsir still need internet. Browser storage may be cleared by your device.",
        "इंडियन मुशहफ़ में ऑफ़लाइन डाउनलोड खोलकर पन्ना, सूरह या पारा इस डिवाइस पर सेव करें। इंटरनेट बंद करने से पहले सेव पन्नों की स्थिति जाँचें। ऑडियो, तर्जुमा और तफ़सीर के लिए इंटरनेट चाहिए। डिवाइस सेव पन्ने हटा सकता है।",
        "انڈین مصحف میں آف لائن ڈاؤن لوڈ کھول کر صفحہ، سورت یا پارہ اس ڈیوائس پر محفوظ کریں۔ انٹرنیٹ بند کرنے سے پہلے محفوظ صفحات کی حالت دیکھیں۔ آڈیو، ترجمہ اور تفسیر کے لیے انٹرنیٹ چاہیے۔ ڈیوائس محفوظ صفحات حذف کر سکتی ہے۔",
      ),
    },
    {
      q: t(
        "What can the website guide do?",
        "वेबसाइट रहनुमा क्या करता है?",
        "ویب سائٹ رہنما کیا کرتا ہے؟",
      ),
      a: t(
        "The guide finds surahs, website features and existing topic summaries with references. It does not generate religious advice, wazifas or personal rulings.",
        "रहनुमा सूरह, वेबसाइट के फ़ीचर और हवालों के साथ मौजूदा मौज़ू ढूँढता है। यह नई दीनी सलाह, वज़ीफ़े या निजी फ़तवे नहीं देता।",
        "رہنما سورتیں، ویب سائٹ کی سہولتیں اور حوالوں کے ساتھ موجودہ موضوعات تلاش کرتا ہے۔ یہ نئی دینی نصیحت، وظائف یا ذاتی فتوے نہیں دیتا۔",
      ),
    },
  ];
  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      className="mx-auto max-w-7xl space-y-14 px-5 py-12 sm:px-6"
    >
      <section id="tools" className="scroll-mt-44">
        <h2 className="text-3xl font-display text-parchment sm:text-4xl">
          {t("Useful tools", "उपयोगी टूल", "کارآمد ٹول")}
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {tools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="flex min-h-28 flex-col items-center justify-center gap-3 rounded-2xl border border-gold/20 bg-white p-4 text-center font-semibold text-parchment hover:bg-gold/10"
            >
              <tool.icon size={24} className="text-gold" />
              {tool.title}
            </Link>
          ))}
        </div>
      </section>
      <section className="rounded-3xl border border-gold/20 bg-gold/5 p-6 sm:p-8">
        <h2 className="text-2xl font-display sm:text-3xl">
          {t(
            "Clear sources, careful learning",
            "स्पष्ट स्रोत, ज़िम्मेदार अध्ययन",
            "واضح ماخذ، ذمہ دار مطالعہ",
          )}
        </h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-parchment/80">
          {t(
            "Qur’anic Arabic, published translations and tafsir are labelled separately. The website guide helps with navigation and existing references. Read about our sources and methodology.",
            "क़ुरआन की अरबी, प्रकाशित अनुवाद और तफ़सीर की अलग पहचान दी गई है। वेबसाइट रहनुमा नेविगेशन और मौजूदा हवालों में मदद करता है। हमारे स्रोत और कार्यप्रणाली जानें।",
            "قرآنی عربی، شائع شدہ ترجمے اور تفسیر کی الگ شناخت دی گئی ہے۔ ویب سائٹ رہنما نیویگیشن اور موجودہ حوالوں میں مدد کرتا ہے۔ ہمارے ماخذ اور طریقۂ کار جانیں۔",
          )}
        </p>
        <Link
          href="/sources"
          className="mt-4 inline-flex min-h-11 items-center rounded-xl border border-gold/30 bg-white px-4 font-semibold text-gold"
        >
          {t("View sources", "स्रोत देखें", "ماخذ دیکھیں")}
        </Link>
      </section>
      <section>
        <h2 className="text-3xl font-display">
          {t("Common questions", "आम सवाल", "عام سوالات")}
        </h2>
        <div className="mt-5 space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="rounded-2xl border border-gold/20 bg-white p-5"
            >
              <summary className="cursor-pointer font-semibold">
                {faq.q}
              </summary>
              <p className="mt-3 leading-relaxed text-parchment/80">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
