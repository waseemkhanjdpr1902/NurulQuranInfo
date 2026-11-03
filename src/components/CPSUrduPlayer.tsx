"use client";

import { useEffect, useRef, useState } from "react";
import { useUILanguage } from "@/components/UILanguageProvider";
import { cpsUrduAudioUrl } from "@/data/cps-urdu-audio";

export default function CPSUrduPlayer({ surahNumber, surahName }: { surahNumber: number; surahName: string }) {
  const { t, rtl } = useUILanguage();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [failed, setFailed] = useState(false);
  const url = cpsUrduAudioUrl(surahNumber);
  useEffect(() => {
    const audio = audioRef.current;
    return () => { audio?.pause(); };
  }, [surahNumber]);
  return (
    <section dir={rtl ? "rtl" : "ltr"} aria-label="CPS Urdu translation — Khalid Syed" className="fixed inset-x-0 bottom-0 z-50 max-h-[60dvh] overflow-y-auto border-t border-gold/30 bg-[#123d32] px-4 py-4 text-white shadow-lg" style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>
      <div className="mx-auto max-w-5xl">
        <h2 className="font-semibold">{t("CPS Urdu · Khalid Syed", "CPS उर्दू · ख़ालिद सैयद", "سی پی ایس اردو · خالد سید")} · {surahName}</h2>
        <p className="mt-1 text-sm">{t("Translation: Maulana Wahiduddin Khan · Voice: Khalid Syed", "तर्जुमा: मौलाना वहीदुद्दीन ख़ान · आवाज़: ख़ालिद सैयद", "ترجمہ: مولانا وحید الدین خان · آواز: خالد سید")}</p>
        {url ? <audio key={surahNumber} ref={audioRef} src={url} controls preload="none" onError={() => setFailed(true)} onPlaying={() => setFailed(false)} aria-label={`${surahName} — Urdu translation by Khalid Syed`} className="mt-3 h-12 w-full" /> : <p role="alert">{t("Recording unavailable for this surah.", "इस सूरह की रिकॉर्डिंग उपलब्ध नहीं है।", "اس سورت کی ریکارڈنگ دستیاب نہیں ہے۔")}</p>}
        {failed && <div role="alert" className="mt-2 text-sm">
          <p>{t("The recording could not load. Check your connection or try again.", "रिकॉर्डिंग लोड नहीं हुई। इंटरनेट जाँचें या दोबारा कोशिश करें।", "ریکارڈنگ لوڈ نہیں ہوئی۔ انٹرنیٹ چیک کریں یا دوبارہ کوشش کریں۔")}</p>
          <button type="button" className="min-h-11 rounded-lg border border-white/50 px-3 underline" onClick={() => { setFailed(false); audioRef.current?.load(); }}>{t("Reload audio", "ऑडियो फिर लोड करें", "آڈیو دوبارہ لوڈ کریں")}</button>
        </div>}
        <p className="mt-2 text-xs">{t("Urdu translation only · Complete surah · Internet required. Written translation is selected separately. No ayah highlighting.", "केवल उर्दू तर्जुमा · पूरी सूरह · इंटरनेट ज़रूरी है। लिखित तर्जुमा अलग चुनें। आयत हाइलाइट नहीं होती।", "صرف اردو ترجمہ · مکمل سورت · انٹرنیٹ ضروری ہے۔ تحریری ترجمہ الگ منتخب کریں۔ آیت ہائی لائٹ نہیں ہوتی۔")}</p>
        <p className="mt-1 flex flex-wrap gap-x-4 text-xs">
          <a className="inline-block min-h-11 py-3 underline" href="https://www.inzaar.org/urdu-translation-of-quran-by-maulana-wahid-uddin-khan/" target="_blank" rel="noopener noreferrer">{t("Translation and narrator credits", "तर्जुमा और आवाज़ का स्रोत", "ترجمہ اور راوی کا حوالہ")}</a>
          <a className="inline-block min-h-11 py-3 underline" href="https://huggingface.co/datasets/naxalpha/islamic-audios-v2/tree/933abc3c86c65b78f2faff010ee2c9fcc380f9e8/Inzaar" target="_blank" rel="noopener noreferrer">{t("Audio archive", "ऑडियो संग्रह", "آڈیو مجموعہ")}</a>
        </p>
      </div>
    </section>
  );
}
