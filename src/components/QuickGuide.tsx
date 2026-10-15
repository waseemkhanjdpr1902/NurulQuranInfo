"use client";

import Link from "next/link";
import { useUILanguage } from "@/components/UILanguageProvider";

export default function QuickGuide() {
  const { t, rtl } = useUILanguage();
  const items = [
    {
      href: "/quran",
      title: t("Read and listen to Quran", "कुरआन पढ़ें और सुनें", "قرآن پڑھیں اور سنیں"),
      text: t("Open Quran from the menu and choose a surah. Tap Play in the bottom player, or Listen from here below an ayah. Use the player to pause or move between ayahs.", "मेनू में कुरआन खोलें और सूरह चुनें। नीचे प्लेयर में Play या किसी आयत के नीचे यहाँ से सुनें दबाएँ। प्लेयर से रोकें या अगली-पिछली आयत पर जाएँ।", "مینو سے قرآن کھولیں اور سورت منتخب کریں۔ نیچے پلیئر میں Play یا آیت کے نیچے یہاں سے سنیں دبائیں۔ پلیئر سے روکیں یا اگلی پچھلی آیت پر جائیں۔"),
    },
    {
      href: "/quran",
      title: t("Choose translation and audio", "तर्जुमा और सुनने का तरीका चुनें", "ترجمہ اور سننے کا طریقہ منتخب کریں"),
      text: t("At the top of a surah, choose Written translation: English, Hindi or Urdu. Listening mode lets you choose Arabic only or Arabic + Urdu translation where available. Written language and audio mode are separate choices.", "सूरह के ऊपर लिखित अनुवाद में English, हिंदी या उर्दू चुनें। सुनने का तरीका में केवल अरबी या अरबी + उर्दू तर्जुमा चुनें, जहाँ दस्तयाब हो। लिखित तर्जुमा और ऑडियो अलग विकल्प हैं।", "سورت کے اوپر تحریری ترجمہ میں انگریزی، ہندی یا اردو منتخب کریں۔ سننے کا طریقہ میں صرف عربی یا عربی + اردو ترجمہ منتخب کریں، جہاں دستیاب ہو۔ تحریری زبان اور آڈیو الگ انتخاب ہیں۔"),
    },
    {
      href: "/quran",
      title: t("Find tafseer and move through ayahs", "तफ़सीर पढ़ें और अगली आयत पर जाएँ", "تفسیر پڑھیں اور اگلی آیت پر جائیں"),
      text: t("Choose the tafseer language at the top of the surah, then open the tafseer below an ayah. Next ayah moves down the page; Previous surah and Next surah change surahs.", "सूरह के ऊपर तफ़सीर की भाषा चुनें, फिर आयत के नीचे तफ़सीर खोलें। अगली आयत से आगे बढ़ें। पिछली सूरह और अगली सूरह से सूरह बदलें।", "سورت کے اوپر تفسیر کی زبان منتخب کریں، پھر آیت کے نیچے تفسیر کھولیں۔ اگلی آیت سے آگے بڑھیں۔ پچھلی سورت اور اگلی سورت سے سورت بدلیں۔"),
    },
    {
      href: "/quran-topics",
      title: t("Explore topics and reflect", "मौज़ूआत और तदब्बुर", "موضوعات اور تدبر"),
      text: t("Topics groups ayahs by subject. Reflect opens the Quran reflection and daily action planner.", "Topics में मौज़ू के मुताबिक आयतें खोजें। Reflect में कुरआन पर तदब्बुर और रोज़ाना अमल का प्लान खोलें।", "Topics میں موضوع کے مطابق آیات تلاش کریں۔ Reflect میں قرآن پر تدبر اور روزانہ عمل کا منصوبہ کھولیں۔"),
    },
    {
      href: "/my-quran-journey",
      title: t("Continue your Quran journey", "अपनी कुरआन की पढ़ाई जारी रखें", "اپنا قرآنی سفر جاری رکھیں"),
      text: t("Journey shows your reading progress and lets you continue from your last recorded ayah on this browser.", "Journey में इसी ब्राउज़र पर पढ़ाई की प्रगति देखें और पिछली दर्ज आयत से जारी रखें।", "Journey میں اسی براؤزر پر پڑھنے کی پیش رفت دیکھیں اور آخری محفوظ آیت سے جاری رکھیں۔"),
    },
    {
      href: "/#tools",
      title: t("Prayer times, duas and other tools", "नमाज़ के वक़्त, दुआएँ और दूसरे टूल", "نماز کے اوقات، دعائیں اور دیگر ٹول"),
      text: t("Open Tools in the menu for Prayer Times, Duas, Tasbih, Names of Allah and other useful pages. Hadith has its own menu link.", "मेनू में Tools खोलें: नमाज़ के वक़्त, दुआएँ, तस्बीह, अल्लाह के नाम और दूसरे पेज मिलेंगे। हदीस का अलग मेनू लिंक है।", "مینو میں Tools کھولیں: نماز کے اوقات، دعائیں، تسبیح، اللہ کے نام اور دیگر صفحات ملیں گے۔ حدیث کا الگ مینو لنک ہے۔"),
    },
  ];
  return (
    <section id="quick-guide" aria-labelledby="quick-guide-title" dir={rtl ? "rtl" : "ltr"} className="scroll-mt-48 mx-auto max-w-7xl px-5 py-8 sm:px-6">
      <div className="rounded-3xl border border-gold/30 bg-white p-5 text-[#12352a] shadow-sm sm:p-8">
        <h2 id="quick-guide-title" className="text-2xl font-bold sm:text-3xl">{t("New here? Quick navigation guide", "पहली बार आए हैं? आसान रहनुमाई", "پہلی بار آئے ہیں؟ آسان رہنمائی")}</h2>
        <p className="mt-3 text-base leading-relaxed">{t("On mobile, tap the menu button at the top right. On a computer, use the links across the top. Choose English, Hindi or Urdu from the language selector next to the menu.", "मोबाइल पर ऊपर दाईं तरफ मेनू बटन दबाएँ। कंप्यूटर पर ऊपर दिए लिंक इस्तेमाल करें। मेनू के पास भाषा विकल्प से English, हिंदी या उर्दू चुनें।", "موبائل پر اوپر دائیں طرف مینو بٹن دبائیں۔ کمپیوٹر پر اوپر دیے گئے لنکس استعمال کریں۔ مینو کے پاس زبان کے انتخاب سے انگریزی، ہندی یا اردو منتخب کریں۔")}</p>
        <Link href="/mushaf" className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-[#075c3a] px-4 py-2 font-semibold text-white">{t("Arabic only: Indian Mushaf with zoom", "सिर्फ अरबी: भारतीय मुशहफ़ और ज़ूम", "صرف عربی: ہندوستانی مصحف اور زوم")}</Link>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {items.map((item, index) => (
            <details key={item.title} className="rounded-2xl border border-[#c8ded4] bg-[#f4f9f6] p-4">
              <summary className="min-h-11 cursor-pointer text-base font-bold leading-relaxed focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0d6658]">{index + 1}. {item.title}</summary>
              <p className="mt-3 text-base leading-relaxed">{item.text}</p>
              <Link href={item.href} className="mt-3 inline-flex min-h-11 items-center rounded-xl bg-[#075c3a] px-4 py-2 font-semibold text-white hover:bg-[#064b30] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075c3a]">{t("Open this section", "यह हिस्सा खोलें", "یہ حصہ کھولیں")}</Link>
              {item.href === "/quran-topics" && <Link href="/quran-reflection" className="mx-3 inline-flex min-h-11 items-center font-semibold underline">{t("Open Reflect", "तदब्बुर खोलें", "تدبر کھولیں")}</Link>}
            </details>
          ))}
          <details className="rounded-2xl border border-[#c8ded4] bg-[#f4f9f6] p-4 sm:col-span-2">
            <summary className="min-h-11 cursor-pointer text-base font-bold leading-relaxed focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0d6658]">{t("7. Install the app on your mobile", "7. मोबाइल पर ऐप इंस्टॉल करें", "7. موبائل پر ایپ انسٹال کریں")}</summary>
            <p className="mt-3 text-base leading-relaxed">{t("Android: open this website in Chrome or Edge. Tap Install app / How to install at the bottom left, or choose Install app / Add to Home screen from the browser menu. If you opened the link in WhatsApp, open it in your browser first.", "Android: वेबसाइट Chrome या Edge में खोलें। नीचे बाईं तरफ ऐप जोड़ें / ऐप कैसे जोड़ें दबाएँ, या ब्राउज़र मेनू में Install app / Add to Home screen चुनें। WhatsApp से आए हों तो पहले ब्राउज़र में खोलें।", "Android: ویب سائٹ Chrome یا Edge میں کھولیں۔ نیچے بائیں طرف ایپ شامل کریں / ایپ کیسے شامل کریں دبائیں، یا براؤزر مینو میں Install app / Add to Home screen منتخب کریں۔ WhatsApp سے آئے ہوں تو پہلے براؤزر میں کھولیں۔")}</p>
            <p className="mt-3 text-base leading-relaxed" dir="ltr">iPhone: Safari → Share → Add to Home Screen → Add.</p>
            <p className="mt-3 text-base leading-relaxed">{t("The installed web app opens from your home screen. Audio requires internet. Already installed? Open the NurulQuran icon on your home screen.", "इंस्टॉल की गई वेब ऐप होम स्क्रीन से खुलती है। ऑडियो के लिए इंटरनेट ज़रूरी है। ऐप पहले से है? होम स्क्रीन पर NurulQuran आइकन खोलें।", "انسٹال شدہ ویب ایپ ہوم اسکرین سے کھلتی ہے۔ آڈیو کے لیے انٹرنیٹ ضروری ہے۔ ایپ پہلے سے ہے؟ ہوم اسکرین پر NurulQuran آئیکن کھولیں۔")}</p>
          </details>
        </div>
      </div>
    </section>
  );
}
