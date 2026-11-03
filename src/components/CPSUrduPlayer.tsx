"use client";

import { useState } from "react";
import { useUILanguage } from "@/components/UILanguageProvider";

// Playlist linked by the publisher, which explicitly credits Khalid Syed:
// https://www.inzaar.org/urdu-translation-of-quran-by-maulana-wahid-uddin-khan/
const playlist = "PL334FsZuGYwrADH9KrRE9izE_tVvtrz6K";
const source = "https://www.inzaar.org/urdu-translation-of-quran-by-maulana-wahid-uddin-khan/";

export default function CPSUrduPlayer() {
  const { t, rtl } = useUILanguage();
  const [loaded, setLoaded] = useState(false);
  return (
    <section dir={rtl ? "rtl" : "ltr"} aria-label="CPS Urdu translation — Khalid Syed" className="fixed inset-x-0 bottom-0 z-50 max-h-[65dvh] overflow-y-auto border-t border-gold/30 bg-[#123d32] px-4 py-3 text-white shadow-lg" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
      <div className="mx-auto max-w-5xl">
        <h2 className="font-semibold">{t("CPS Urdu · Khalid Syed", "CPS उर्दू · ख़ालिद सैयद", "سی پی ایس اردو · خالد سید")}</h2>
        <p className="mt-1 text-sm">{t("Translation: Maulana Wahiduddin Khan · Voice: Khalid Syed", "तर्जुमा: मौलाना वहीदुद्दीन ख़ान · आवाज़: ख़ालिद सैयद", "ترجمہ: مولانا وحید الدین خان · آواز: خالد سید")}</p>
        <p className="mt-1 text-xs">{t("Centre for Peace and Spirituality · Urdu translation collection. Choose your surah in the YouTube playlist menu. Written translation is selected separately; it does not follow this recording. Internet required; no ayah highlighting.", "Centre for Peace and Spirituality · उर्दू तर्जुमा संग्रह। YouTube प्लेलिस्ट मेनू में सूरह चुनें। लिखित तर्जुमा अलग है और इस रिकॉर्डिंग के साथ नहीं चलता। इंटरनेट ज़रूरी है; आयत हाइलाइट नहीं होती।", "Centre for Peace and Spirituality · اردو ترجمہ مجموعہ۔ یوٹیوب پلے لسٹ کے مینو میں سورت منتخب کریں۔ تحریری ترجمہ الگ ہے اور اس ریکارڈنگ کے ساتھ نہیں چلتا۔ انٹرنیٹ ضروری ہے؛ آیت ہائی لائٹ نہیں ہوتی۔")}</p>
        {loaded ? <iframe title="Urdu Quran translation — Maulana Wahiduddin Khan, narrated by Khalid Syed" src={`https://www.youtube-nocookie.com/embed/videoseries?list=${playlist}&rel=0`} className="mx-auto mt-2 h-44 w-full max-w-lg rounded-lg sm:h-52" allow="encrypted-media; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /> : <button type="button" onClick={() => setLoaded(true)} className="mt-3 min-h-12 rounded-xl border border-white/50 px-5 font-semibold">{t("Load Urdu playlist", "उर्दू प्लेलिस्ट खोलें", "اردو پلے لسٹ کھولیں")}</button>}
        <p className="mt-1 flex flex-wrap gap-x-4 text-xs">
          <a className="inline-block min-h-11 py-3 underline" href={`https://www.youtube.com/playlist?list=${playlist}`} target="_blank" rel="noopener noreferrer">{t("Open on YouTube / playback help", "YouTube पर खोलें / प्लेबैक सहायता", "یوٹیوب پر کھولیں / پلے بیک مدد")}</a>
          <a className="inline-block min-h-11 py-3 underline" href={source} target="_blank" rel="noopener noreferrer">{t("Publisher and narrator credits", "प्रकाशक और आवाज़ का स्रोत", "ناشر اور راوی کا حوالہ")}</a>
        </p>
      </div>
    </section>
  );
}
