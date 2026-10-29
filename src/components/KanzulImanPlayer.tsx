"use client";

import { useEffect, useRef, useState } from "react";
import { kanzulImanAudioUrl } from "@/data/kanzul-iman-audio";
import { useUILanguage } from "@/components/UILanguageProvider";

export default function KanzulImanPlayer({surahNumber, surahName}: {surahNumber: number; surahName: string}) {
  const { t, rtl } = useUILanguage();
  const player = useRef<HTMLAudioElement>(null);
  const [failed, setFailed] = useState(false);
  const url = kanzulImanAudioUrl(surahNumber);
  useEffect(() => {
    const audio = player.current;
    return () => { audio?.pause(); };
  }, []);
  return <section dir={rtl ? "rtl" : "ltr"} aria-label={t("Kanzul Iman audio player", "कंज़ुल ईमान ऑडियो प्लेयर", "کنزالایمان آڈیو پلیئر")} className="fixed inset-x-0 bottom-0 z-50 border-t border-gold/30 bg-[#123d32] px-4 py-4 text-white shadow-lg" style={{paddingBottom:"max(16px, env(safe-area-inset-bottom))"}}>
    <div className="mx-auto max-w-5xl">
      <h2 className="font-semibold">{t("Kanzul Iman", "कंज़ुल ईमान", "کنزالایمان")} · {surahName}</h2>
      <p className="mt-1 text-sm">{t("Translation: Imam Ahmad Raza Khan · Full-surah recording", "तर्जुमा: इमाम अहमद रज़ा ख़ान · पूरी सूरह की रिकॉर्डिंग", "ترجمہ: امام احمد رضا خان · مکمل سورت کی ریکارڈنگ")}</p>
      {url && <audio ref={player} src={url} controls preload="none" onError={() => setFailed(true)} onPlaying={() => setFailed(false)} aria-label={`${surahName} — Kanzul Iman`} className="mt-3 h-12 w-full" />}
      {failed && <div role="alert" className="mt-2 text-sm">
        <p>{t("The audio source could not load. Check your connection or try again later.", "ऑडियो स्रोत लोड नहीं हुआ। इंटरनेट जाँचें या कुछ देर बाद कोशिश करें।", "آڈیو ماخذ لوڈ نہیں ہوا۔ انٹرنیٹ چیک کریں یا کچھ دیر بعد کوشش کریں۔")}</p>
        <button type="button" className="min-h-11 rounded-lg border border-white/50 px-3 underline" onClick={() => {setFailed(false); player.current?.load();}}>{t("Reload audio", "ऑडियो फिर लोड करें", "آڈیو دوبارہ لوڈ کریں")}</button>
      </div>}
      <p className="mt-2 text-xs"><a href="https://siraatalmustaqim.com/kanzul-iman/" target="_blank" rel="noreferrer" className="inline-block py-2 underline">{t("Audio source: Siraatal Mustaqim", "ऑडियो स्रोत: Siraatal Mustaqim", "آڈیو ماخذ: Siraatal Mustaqim")}</a> · {t("No ayah synchronisation", "आयत के मुताबिक़ सिंक नहीं", "آیت کے مطابق ہم آہنگی نہیں")}</p>
    </div>
  </section>;
}
