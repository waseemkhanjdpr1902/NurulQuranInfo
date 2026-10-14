"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUILanguage } from "@/components/UILanguageProvider";
import { MUSHAF_SURAHS } from "@/data/mushaf-surahs";
import { MUSHAF_PAGE_COUNT, MUSHAF_STORAGE_KEY, validMushafPage } from "@/lib/mushaf";

export default function MushafReader() {
  const { t, rtl } = useUILanguage();
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [zoom, setZoom] = useState(100);
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [invalid, setInvalid] = useState(false);
  const [full, setFull] = useState(false);
  const [fullError, setFullError] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const current = [...MUSHAF_SURAHS].reverse().find(s => s.page <= page) || MUSHAF_SURAHS[0];
  const button = "min-h-11 rounded-xl border border-[#b9d8ca] bg-white px-3 py-2 text-sm font-semibold text-[#12352a] hover:bg-[#e7f3ee] disabled:opacity-40";

  useEffect(() => {
    let savedPage: number | null = null;
    let savedZoom = 100;
    try {
      const saved = JSON.parse(localStorage.getItem(MUSHAF_STORAGE_KEY) || "null");
      savedPage = validMushafPage(saved?.page);
      if (Number.isInteger(saved?.zoom) && saved.zoom >= 100 && saved.zoom <= 300) savedZoom = saved.zoom;
    } catch {}
    const initial = validMushafPage(new URLSearchParams(window.location.search).get("page")) || savedPage || 1;
    setPage(initial);
    setPageInput(String(initial));
    setZoom(savedZoom);
    setReady(true);
    const onHistory = () => {
      const requested = validMushafPage(new URLSearchParams(window.location.search).get("page"));
      if (requested) {
        setPage(requested); setPageInput(String(requested)); setLoaded(false); setFailed(false);
      }
    };
    window.addEventListener("popstate", onHistory);
    return () => window.removeEventListener("popstate", onHistory);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(MUSHAF_STORAGE_KEY, JSON.stringify({ page, zoom })); } catch {}
    const url = new URL(window.location.href);
    url.searchParams.set("page", String(page));
    window.history.replaceState(window.history.state, "", url);
  }, [page, zoom, ready]);

  useEffect(() => {
    const onFull = () => setFull(document.fullscreenElement === container.current);
    document.addEventListener("fullscreenchange", onFull);
    return () => document.removeEventListener("fullscreenchange", onFull);
  }, []);

  useEffect(() => {
    // Cached images may complete before React attaches the load handler.
    if (image.current?.complete && image.current.naturalWidth > 0) setLoaded(true);
  }, [page, retry, ready]);

  function go(value: number) {
    const next = validMushafPage(value);
    if (next === null || next === page) return;
    setSelectedSurah(null); setPage(next); setPageInput(String(next)); setLoaded(false); setFailed(false); setInvalid(false); setRetry(0);
    viewport.current?.scrollTo({ top: 0, left: 0 });
  }
  async function toggleFull() {
    setFullError(false);
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (container.current?.requestFullscreen) await container.current.requestFullscreen();
      else setFullError(true);
    } catch { setFullError(true); }
  }

  return (
    <div ref={container} dir={rtl ? "rtl" : "ltr"} className="mx-auto max-w-5xl bg-[#f6f7f1] text-[#12352a]" style={full ? {height:"100dvh", overflowY:"auto"} : undefined}>
      <div className="rounded-2xl border border-[#c8ded4] bg-white p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-bold sm:text-3xl">{t("Arabic Mushaf", "अरबी मुशहफ़", "عربی مصحف")}</h1>
          <Link href="/quran" className={button}>{t("Translation & listening", "तर्जुमा और तिलावत", "ترجمہ اور تلاوت")}</Link>
        </div>
        <p className="mt-2 text-sm leading-relaxed">{t("Hafs · 604 pages · Original page images, without translation or audio. Your page is remembered on this browser.", "हफ़्स • 604 पन्ने • असली पन्नों की तस्वीरें, बिना तर्जुमे और ऑडियो के। इसी ब्राउज़र पर आपका पन्ना याद रखा जाता है।", "حفص • 604 صفحات • اصل صفحات کی تصاویر، بغیر ترجمے اور آڈیو کے۔ اسی براؤزر پر آپ کا صفحہ یاد رکھا جاتا ہے۔")}</p>
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer py-2 font-semibold">{t("Reading help & source", "पढ़ने की रहनुमाई और स्रोत", "پڑھنے کی رہنمائی اور ماخذ")}</summary>
          <p className="mt-2 leading-relaxed">{t("Use + to enlarge; scroll sideways to see the full line. Fit page resets zoom. You can also pinch to zoom on mobile. Page images need internet to load.", "+ से बड़ा करें; पूरी लाइन देखने के लिए दाएँ-बाएँ स्क्रॉल करें। पूरा पन्ना से ज़ूम रीसेट करें। मोबाइल पर दो उँगलियों से ज़ूम भी कर सकते हैं। पन्ने लोड करने के लिए इंटरनेट चाहिए।", "+ سے بڑا کریں؛ پوری سطر دیکھنے کے لیے دائیں بائیں اسکرول کریں۔ پورا صفحہ سے زوم ری سیٹ کریں۔ موبائل پر دو انگلیوں سے زوم بھی کر سکتے ہیں۔ صفحات لوڈ کرنے کے لیے انٹرنیٹ چاہیے۔")}</p>
          <p className="mt-2 leading-relaxed">{t("Images: King Saud University Ayat project, which credits the King Fahd Qur’an Printing Complex. Surah start pages: Quran.com Content API. NurulQuran displays the images unchanged.", "तस्वीरें: किंग सऊद यूनिवर्सिटी आयात प्रोजेक्ट, जो किंग फ़हद कुरआन प्रिंटिंग कॉम्प्लेक्स को स्रोत बताता है। सूरह के शुरुआती पन्ने: Quran.com Content API। तस्वीरें बिना बदलाव दिखाई जाती हैं।", "تصاویر: کنگ سعود یونیورسٹی آیات پروجیکٹ، جو کنگ فہد قرآن پرنٹنگ کمپلیکس کو ماخذ بتاتا ہے۔ سورت کے ابتدائی صفحات: Quran.com Content API۔ تصاویر بغیر تبدیلی دکھائی جاتی ہیں۔")}</p>
          <a href="https://quran.ksu.edu.sa/index.php?l=en" target="_blank" rel="noreferrer" className="mt-2 inline-block py-2 underline">{t("View source", "स्रोत देखें", "ماخذ دیکھیں")}</a>
        </details>
      </div>

      <div style={{top: full ? 0 : 144}} className="sticky z-20 mt-3 rounded-2xl border border-[#c8ded4] bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex min-w-0 flex-1 flex-col gap-1 text-sm font-semibold">
            {t("Choose surah", "सूरह चुनें", "سورت منتخب کریں")}
            <select aria-label={t("Choose surah", "सूरह चुनें", "سورت منتخب کریں")} value={selectedSurah ?? current.id} onChange={e => { const selected = MUSHAF_SURAHS.find(s => s.id === Number(e.target.value)); if (selected) { go(selected.page); setSelectedSurah(selected.id); } }} className="min-h-11 w-full min-w-0 rounded-xl border border-[#b9d8ca] bg-white px-2">
              {MUSHAF_SURAHS.map(s => <option key={s.id} value={s.id}>{s.id}. {s.name} — {s.arabic}</option>)}
            </select>
          </label>
          <form onSubmit={e => {e.preventDefault(); const value = validMushafPage(pageInput); setInvalid(value === null); if (value !== null) go(value);}} className="flex items-end gap-2">
            <label className="flex flex-col gap-1 text-sm font-semibold">
              {t("Page", "पन्ना", "صفحہ")}
              <input aria-label={t("Page number", "पन्ने का नंबर", "صفحہ نمبر")} aria-invalid={invalid} type="number" min={1} max={604} inputMode="numeric" value={pageInput} onChange={e => {setPageInput(e.target.value); setInvalid(false);}} className="min-h-11 w-20 rounded-xl border border-[#b9d8ca] bg-white px-2" />
            </label>
            <button type="submit" className={button}>{t("Go", "खोलें", "کھولیں")}</button>
          </form>
        </div>
        {invalid && <p role="alert" className="mt-2 text-sm text-red-700">{t("Enter a page from 1 to 604.", "1 से 604 के बीच पन्ना चुनें।", "1 سے 604 کے درمیان صفحہ منتخب کریں۔")}</p>}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2" dir="ltr">
            <button type="button" aria-label={t("Zoom out", "ज़ूम कम करें", "زوم کم کریں")} disabled={zoom <= 100} onClick={() => setZoom(z => Math.max(100, z - 25))} className={button}>−</button>
            <output aria-label={t("Zoom level", "ज़ूम स्तर", "زوم کی سطح")} className="w-14 text-center text-sm">{zoom}%</output>
            <button type="button" aria-label={t("Zoom in", "ज़ूम बढ़ाएँ", "زوم بڑھائیں")} disabled={zoom >= 300} onClick={() => setZoom(z => Math.min(300, z + 25))} className={button}>+</button>
          </div>
          <button type="button" onClick={() => setZoom(100)} className={button}>{t("Fit page", "पूरा पन्ना", "پورا صفحہ")}</button>
          <button type="button" onClick={toggleFull} className={button}>{full ? t("Exit full screen", "पूरी स्क्रीन बंद करें", "پوری اسکرین بند کریں") : t("Full screen", "पूरी स्क्रीन", "پوری اسکرین")}</button>
        </div>
        {fullError && <p role="status" className="mt-2 text-sm">{t("Full screen is unavailable in this browser. Use zoom or turn your phone sideways.", "इस ब्राउज़र में पूरी स्क्रीन दस्तयाब नहीं है। ज़ूम करें या मोबाइल को आड़ा करें।", "اس براؤزر میں پوری اسکرین دستیاب نہیں۔ زوم کریں یا موبائل کو افقی کریں۔")}</p>}
      </div>

      <nav aria-label={t("Mushaf page navigation", "मुशहफ़ पन्नों की नेविगेशन", "مصحف صفحات کی رہنمائی")} className="my-3 flex items-center justify-between gap-2">
        <button type="button" onClick={() => go(page - 1)} disabled={page === 1} className={button}>{t("Previous page", "पिछला पन्ना", "پچھلا صفحہ")}</button>
        <p aria-live="polite" className="text-sm font-semibold" dir="ltr">{page} / {MUSHAF_PAGE_COUNT}</p>
        <button type="button" onClick={() => go(page + 1)} disabled={page === 604} className={button}>{t("Next page", "अगला पन्ना", "اگلا صفحہ")}</button>
      </nav>
      <div ref={viewport} tabIndex={0} role="region" aria-label={t("Arabic Mushaf page", "अरबी मुशहफ़ पन्ना", "عربی مصحف صفحہ")} onKeyDown={e => {if(e.key === "ArrowLeft") { e.preventDefault(); go(page + 1); } else if(e.key === "ArrowRight") { e.preventDefault(); go(page - 1); }}} className="relative overflow-auto rounded-xl border border-[#c8ded4] bg-white" style={{maxHeight:full ? "calc(100dvh - 230px)" : "78svh", touchAction:"pan-x pan-y pinch-zoom"}} dir="ltr">
        {!loaded && !failed && <p role="status" className="p-5 text-center">{t("Loading Mushaf page…", "मुशहफ़ पन्ना लोड हो रहा है…", "مصحف صفحہ لوڈ ہو رہا ہے…")}</p>}
        {failed ? <div role="alert" className="p-8 text-center"><p>{t("Page could not load. Check your internet connection and retry.", "पन्ना लोड नहीं हुआ। इंटरनेट जाँचें और फिर कोशिश करें।", "صفحہ لوڈ نہیں ہوا۔ انٹرنیٹ چیک کریں اور دوبارہ کوشش کریں۔")}</p><button type="button" className={button + " mt-4"} onClick={() => {setFailed(false);setLoaded(false);setRetry(n => n + 1);}}>{t("Retry", "फिर कोशिश करें", "دوبارہ کوشش کریں")}</button></div> :
          ready && <div style={{width:`${zoom}%`, minWidth:"100%"}}>
            <Image ref={image} key={`${page}-${retry}`} src={`/api/mushaf/${page}?retry=${retry}`} alt={t(`Arabic Hafs Mushaf, page ${page} of 604`, `अरबी हफ़्स मुशहफ़, पन्ना ${page} / 604`, `عربی حفص مصحف، صفحہ ${page} / 604`)} width={622} height={917} unoptimized priority onLoad={() => setLoaded(true)} onError={() => {setFailed(true);setLoaded(false);}} style={{display:"block",width:"100%",height:"auto"}} />
          </div>}
      </div>
      <div className="mt-3 flex justify-between gap-2">
        <button type="button" onClick={() => go(page - 1)} disabled={page === 1} className={button}>{t("Previous page", "पिछला पन्ना", "پچھلا صفحہ")}</button>
        <button type="button" onClick={() => go(page + 1)} disabled={page === 604} className={button}>{t("Next page", "अगला पन्ना", "اگلا صفحہ")}</button>
      </div>
    </div>
  );
}
