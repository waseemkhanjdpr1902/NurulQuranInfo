"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUILanguage } from "@/components/UILanguageProvider";
import { MUSHAF_PAGE_COUNT, MUSHAF_STORAGE_KEY, validMushafPage } from "@/lib/mushaf";

export default function MushafReader() {
  const { t, rtl } = useUILanguage();
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState("2");
  const [zoom, setZoom] = useState(100);
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [showIndex, setShowIndex] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [full, setFull] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);
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
    setPageInput(String(initial + 1));
    setZoom(savedZoom);
    setReady(true);
    const onHistory = () => {
      const requested = validMushafPage(new URLSearchParams(window.location.search).get("page"));
      if (requested) {
        setPage(requested); setPageInput(String(requested + 1)); setLoaded(false); setFailed(false);
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
    if (next === null) return;
    setShowIndex(false);
    if (next === page) return;
    setPage(next); setPageInput(String(next + 1)); setLoaded(false); setFailed(false); setInvalid(false); setRetry(0);
    viewport.current?.scrollTo({ top: 0, left: 0 });
  }
  async function toggleFull() {
    if (full && !document.fullscreenElement) { setFull(false); return; }
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (container.current?.requestFullscreen) await container.current.requestFullscreen();
      else setFull(true);
    } catch {
      // iPhone and embedded browsers may reject native fullscreen; provide a clean in-page reading view.
      setFull(true);
    }
  }

  return (
    <div ref={container} dir={rtl ? "rtl" : "ltr"} className="mx-auto max-w-5xl bg-[#f6f7f1] text-[#12352a]" style={full ? {position:"fixed", inset:0, zIndex:200, maxWidth:"none", height:"100dvh", overflowY:"auto", padding:8} : undefined}>
      <div hidden={full} className="rounded-2xl border border-[#c8ded4] bg-white p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-bold sm:text-3xl">{t("Indian Mushaf", "भारतीय मुशहफ़", "ہندوستانی مصحف")}</h1>
          <Link href="/quran" className={button}>{t("Translation & listening", "तर्जुमा और तिलावत", "ترجمہ اور تلاوت")}</Link>
        </div>
        <p className="mt-2 text-sm leading-relaxed">{t("Indian script · Hafs · 610 reading pages · Original page images, without translation or audio. Your page is remembered on this browser.", "भारतीय ख़त • हफ़्स • 610 पन्ने • असली पन्नों की तस्वीरें, बिना तर्जुमे और ऑडियो के। इसी ब्राउज़र पर आपका पन्ना याद रखा जाता है।", "ہندوستانی رسم الخط • حفص • 610 صفحات • اصل صفحات کی تصاویر، بغیر ترجمے اور آڈیو کے۔ اسی براؤزر پر آپ کا صفحہ یاد رکھا جاتا ہے۔")}</p>
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer py-2 font-semibold">{t("Reading help & source", "पढ़ने की रहनुमाई और स्रोत", "پڑھنے کی رہنمائی اور ماخذ")}</summary>
          <p className="mt-2 leading-relaxed">{t("Use + to enlarge; scroll sideways to see the full line. Fit page resets zoom. You can also pinch to zoom on mobile. Page images need internet to load.", "+ से बड़ा करें; पूरी लाइन देखने के लिए दाएँ-बाएँ स्क्रॉल करें। पूरा पन्ना से ज़ूम रीसेट करें। मोबाइल पर दो उँगलियों से ज़ूम भी कर सकते हैं। पन्ने लोड करने के लिए इंटरनेट चाहिए।", "+ سے بڑا کریں؛ پوری سطر دیکھنے کے لیے دائیں بائیں اسکرول کریں۔ پورا صفحہ سے زوم ری سیٹ کریں۔ موبائل پر دو انگلیوں سے زوم بھی کر سکتے ہیں۔ صفحات لوڈ کرنے کے لیے انٹرنیٹ چاہیے۔")}</p>
          <p className="mt-2 leading-relaxed">{t("King Fahd Qur’an Printing Complex, Nasta’liq edition. Original scans are displayed unchanged. Reading page 1 is printed page 2; reading page 610 is printed page 611. The surah index below is the publisher’s own index. Enter its printed page number in the page box.", "किंग फ़हद कुरआन प्रिंटिंग कॉम्प्लेक्स का नस्तालीक़ मुशहफ़। असली स्कैन बिना बदलाव दिखाए जाते हैं। पहला पढ़ने वाला पन्ना किताब का पन्ना 2 है और आख़िरी 611 है। नीचे प्रकाशक की असली सूरह फ़ेहरिस्त है। उसमें दिया पन्ना नंबर पन्ने के बॉक्स में डालें।", "کنگ فہد قرآن پرنٹنگ کمپلیکس کا نستعلیق مصحف۔ اصل اسکین بغیر تبدیلی دکھائے جاتے ہیں۔ پہلا پڑھنے والا صفحہ کتاب کا صفحہ 2 اور آخری 611 ہے۔ نیچے ناشر کی اصل سورتوں کی فہرست ہے۔ اس کا صفحہ نمبر صفحے کے خانے میں درج کریں۔")}</p>
          <a href="https://qurancomplex.gov.sa/wp-content/uploads/isdarat/hafs/nastaleeq-1.pdf" target="_blank" rel="noreferrer" className="mt-2 inline-block py-2 underline">{t("Publisher’s Mushaf PDF", "प्रकाशक का मुशहफ़ PDF", "ناشر کا مصحف PDF")}</a>
          <Link href="/sources" className="ms-4 inline-block py-2 underline">{t("Source details", "स्रोत की तफ़सील", "ماخذ کی تفصیل")}</Link>
        </details>
      </div>

      <div style={{top: full ? 0 : 144}} className="sticky z-20 mt-3 rounded-2xl border border-[#c8ded4] bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-end gap-3">
          <button type="button" aria-expanded={showIndex} onClick={() => setShowIndex(!showIndex)} className={button}>{t(showIndex ? "Close surah index" : "Surah index", showIndex ? "सूरह फ़ेहरिस्त बंद करें" : "सूरह फ़ेहरिस्त", showIndex ? "سورتوں کی فہرست بند کریں" : "سورتوں کی فہرست")}</button>
          <form onSubmit={e => {e.preventDefault(); const value = validMushafPage(Number(pageInput) - 1); setInvalid(value === null); if (value !== null) go(value);}} className="flex items-end gap-2">
            <label className="flex flex-col gap-1 text-sm font-semibold">
              {t("Printed page", "किताब का पन्ना", "کتاب کا صفحہ")}
              <input aria-label={t("Printed page number", "किताब के पन्ने का नंबर", "کتاب کا صفحہ نمبر")} aria-invalid={invalid} type="number" min={2} max={611} inputMode="numeric" value={pageInput} onChange={e => {setPageInput(e.target.value); setInvalid(false);}} className="min-h-11 w-20 rounded-xl border border-[#b9d8ca] bg-white px-2" />
            </label>
            <button type="submit" className={button}>{t("Go", "खोलें", "کھولیں")}</button>
          </form>
        </div>
        {invalid && <p role="alert" className="mt-2 text-sm text-red-700">{t("Enter a printed page from 2 to 611.", "2 से 611 के बीच पन्ना चुनें।", "2 سے 611 کے درمیان صفحہ منتخب کریں۔")}</p>}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2" dir="ltr">
            <button type="button" aria-label={t("Zoom out", "ज़ूम कम करें", "زوم کم کریں")} disabled={zoom <= 100} onClick={() => setZoom(z => Math.max(100, z - 25))} className={button}>−</button>
            <output aria-label={t("Zoom level", "ज़ूम स्तर", "زوم کی سطح")} className="w-14 text-center text-sm">{zoom}%</output>
            <button type="button" aria-label={t("Zoom in", "ज़ूम बढ़ाएँ", "زوم بڑھائیں")} disabled={zoom >= 300} onClick={() => setZoom(z => Math.min(300, z + 25))} className={button}>+</button>
          </div>
          <button type="button" onClick={() => setZoom(100)} className={button}>{t("Fit page", "पूरा पन्ना", "پورا صفحہ")}</button>
          <button type="button" onClick={toggleFull} className={button}>{full ? t("Exit full screen", "पूरी स्क्रीन बंद करें", "پوری اسکرین بند کریں") : t("Full screen", "पूरी स्क्रीन", "پوری اسکرین")}</button>
        </div>

      </div>

      {showIndex && <section aria-label={t("Publisher surah index", "प्रकाशक की सूरह फ़ेहरिस्त", "ناشر کی سورتوں کی فہرست")} className="mt-3 rounded-xl border border-[#c8ded4] bg-white p-3">
        <p className="mb-3 text-sm">{t("Find your surah in the original index. Type its printed page number above and press Go. Tap an index image to enlarge it.", "असली फ़ेहरिस्त में सूरह ढूँढें। उसका पन्ना नंबर ऊपर डालें और खोलें दबाएँ। तस्वीर बड़ी करने के लिए उस पर टैप करें।", "اصل فہرست میں سورت تلاش کریں۔ اس کا صفحہ نمبر اوپر درج کریں اور کھولیں دبائیں۔ تصویر بڑی کرنے کے لیے اس پر ٹیپ کریں۔")}</p>
        <div className="grid gap-3 sm:grid-cols-2">{[620, 621].map((scan, i) => <a key={scan} href={`https://raw.githubusercontent.com/1uc1d23/IndoPak-15-Line-Naskh-Mushaf-Page-Images/a93e8947229889a2e486d9b414fe94e69c72c6e4/original_pages/${scan}.jpg`} target="_blank" rel="noreferrer"><Image src={`https://raw.githubusercontent.com/1uc1d23/IndoPak-15-Line-Naskh-Mushaf-Page-Images/a93e8947229889a2e486d9b414fe94e69c72c6e4/original_pages/${scan}.jpg`} alt={t(`Original surah index, part ${i + 1}`, `असली सूरह फ़ेहरिस्त, हिस्सा ${i + 1}`, `اصل سورتوں کی فہرست، حصہ ${i + 1}`)} width={1915} height={2736} unoptimized style={{width:"100%",height:"auto"}} /></a>)}</div>
      </section>}
      <nav aria-label={t("Mushaf page navigation", "मुशहफ़ पन्नों की नेविगेशन", "مصحف صفحات کی رہنمائی")} className="my-3 flex items-center justify-between gap-2">
        <button type="button" onClick={() => go(page - 1)} disabled={page === 1} className={button}>{t("Previous page", "पिछला पन्ना", "پچھلا صفحہ")}</button>
        <p aria-live="polite" className="text-sm font-semibold" dir="ltr">{page + 1} / {MUSHAF_PAGE_COUNT + 1}</p>
        <button type="button" onClick={() => go(page + 1)} disabled={page === 610} className={button}>{t("Next page", "अगला पन्ना", "اگلا صفحہ")}</button>
      </nav>
      <div ref={viewport} tabIndex={0} role="region" aria-label={t("Arabic Mushaf page", "अरबी मुशहफ़ पन्ना", "عربی مصحف صفحہ")} onKeyDown={e => {if(e.key === "ArrowLeft") { e.preventDefault(); go(page + 1); } else if(e.key === "ArrowRight") { e.preventDefault(); go(page - 1); }}} className="relative overflow-auto rounded-xl border border-[#c8ded4] bg-white" style={{maxHeight:full ? "calc(100dvh - 230px)" : "78svh", touchAction:"pan-x pan-y pinch-zoom"}} dir="ltr">
        {!loaded && !failed && <p role="status" className="p-5 text-center">{t("Loading Mushaf page…", "मुशहफ़ पन्ना लोड हो रहा है…", "مصحف صفحہ لوڈ ہو رہا ہے…")}</p>}
        {failed ? <div role="alert" className="p-8 text-center"><p>{t("Page could not load. Check your internet connection and retry.", "पन्ना लोड नहीं हुआ। इंटरनेट जाँचें और फिर कोशिश करें।", "صفحہ لوڈ نہیں ہوا۔ انٹرنیٹ چیک کریں اور دوبارہ کوشش کریں۔")}</p><button type="button" className={button + " mt-4"} onClick={() => {setFailed(false);setLoaded(false);setRetry(n => n + 1);}}>{t("Retry", "फिर कोशिश करें", "دوبارہ کوشش کریں")}</button></div> :
          ready && <div style={{width:`${zoom}%`, minWidth:"100%"}}>
            <Image ref={image} key={`${page}-${retry}`} src={`/api/indopak-mushaf/${page}?retry=${retry}`} alt={t(`Indian Hafs Mushaf, printed page ${page + 1}`, `अरबी हफ़्स मुशहफ़, किताब का पन्ना ${page + 1}`, `عربی حفص مصحف، کتاب کا صفحہ ${page + 1}`)} width={1915} height={2736} unoptimized priority onLoad={() => setLoaded(true)} onError={() => {setFailed(true);setLoaded(false);}} style={{display:"block",width:"100%",height:"auto"}} />
          </div>}
      </div>
      <div className="mt-3 flex justify-between gap-2">
        <button type="button" onClick={() => go(page - 1)} disabled={page === 1} className={button}>{t("Previous page", "पिछला पन्ना", "پچھلا صفحہ")}</button>
        <button type="button" onClick={() => go(page + 1)} disabled={page === 610} className={button}>{t("Next page", "अगला पन्ना", "اگلا صفحہ")}</button>
      </div>
    </div>
  );
}
