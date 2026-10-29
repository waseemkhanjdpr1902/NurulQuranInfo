"use client";

import { useEffect, useRef, useState } from "react";
import { useUILanguage } from "@/components/UILanguageProvider";
import { MUSHAF_SURAHS } from "@/data/mushaf-surahs";
import { MUSHAF_PARAS } from "@/data/mushaf-paras";

const CACHE = "nurulquran-indopak-downloads-v1";
export default function MushafDownloads({page}: {page: number}) {
  const { t } = useUILanguage();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(0);
  const [bytes, setBytes] = useState(0);
  const [savedPages, setSavedPages] = useState<number[]>([]);
  const [progress, setProgress] = useState<{done: number; total: number} | null>(null);
  const [surahNumber, setSurahNumber] = useState(1);
  const [supported, setSupported] = useState(false);
  const cancelled = useRef(false);
  const paraIndex = MUSHAF_PARAS.reduce((last, para, index) => para.printedPage <= page + 1 ? index : last, 0);
  const para = MUSHAF_PARAS[Math.max(0, paraIndex)];
  async function refresh() {
    const cache = await caches.open(CACHE);
    const keys = await cache.keys();
    let size = 0;
    for (const key of keys) {
      const response = await cache.match(key);
      if (response) size += (await response.blob()).size;
    }
    setCount(keys.length); setBytes(size);
    setSavedPages(keys.map(key => Number(new URL(key.url).pathname.split("/").pop())));
  }
  useEffect(() => {
    const available = window.isSecureContext && "caches" in window && "serviceWorker" in navigator;
    setSupported(available);
    cancelled.current = false;
    if (available) refresh().catch(() => setSupported(false));
    return () => {cancelled.current = true;};
  }, []);
  async function download(kind: "page" | "para" | "surah") {
    if (busy) return;
    setBusy(true); setMessage(""); setProgress(null); cancelled.current = false;
    try {
      await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      const cache = await caches.open(CACHE);
      const surah = MUSHAF_SURAHS[surahNumber - 1];
      const start = kind === "para" ? para.printedPage - 1 : kind === "surah" ? surah.printedPage - 1 : page;
      // Include a shared boundary page so the final ayahs of this para remain available.
      const end = kind === "para" ? (MUSHAF_PARAS[paraIndex + 1]?.printedPage ?? 611) - 1 : kind === "surah" ? (MUSHAF_SURAHS[surahNumber]?.printedPage ?? 611) - 1 : page;
      setProgress({done: 0, total: end - start + 1});
      const shell = await fetch("/mushaf", {cache:"reload"});
      if (!shell.ok || !shell.headers.get("content-type")?.includes("text/html")) throw new Error();
      const html = await shell.clone().text();
      const assets = await caches.open("nurulquran-mushaf-assets-v1");
      const doc = new DOMParser().parseFromString(html, "text/html");
      const urls = new Set([...doc.querySelectorAll("script[src],link[href]")].map(el => el.getAttribute("src") || el.getAttribute("href") || "").filter(url => url.startsWith("/_next/static/")));
      for (const url of urls) {
        if (cancelled.current) break;
        if (!(await assets.match(url))) {
          const response = await fetch(url);
          if (!response.ok) throw new Error();
          await assets.put(url, response);
        }
      }
      await (await caches.open("nurulquran-mushaf-shell-v1")).put("/mushaf", shell);
      for (let current = start; current <= end; current++) {
        if (cancelled.current) break;
        const url = `/api/indopak-mushaf/${current}`;
        if (!(await cache.match(url))) {
          const response = await fetch(url);
          if (!response.ok || !response.headers.get("content-type")?.includes("image/jpeg")) throw new Error();
          await cache.put(url, response);
        }
        setProgress({done: current - start + 1, total: end - start + 1});
      }
      setMessage(cancelled.current ? t("Download stopped. Saved pages are kept.", "डाउनलोड रुका। सेव हुए पन्ने सुरक्षित हैं।", "ڈاؤن لوڈ رک گیا۔ محفوظ صفحات برقرار ہیں۔") : t("Pages saved. Offline reading is ready after this page has loaded online once.", "पन्ने सेव हैं। इस पेज को एक बार ऑनलाइन खुलने दें, फिर ऑफ़लाइन पढ़ें।", "صفحات محفوظ ہیں۔ اس صفحے کو ایک بار آن لائن لوڈ ہونے دیں، پھر آف لائن پڑھیں۔"));
    } catch {
      setMessage(t("Download incomplete. Check your connection or available storage, then retry. Previously saved pages are kept.", "डाउनलोड अधूरा है। इंटरनेट या खाली जगह जाँचकर फिर कोशिश करें। सेव पन्ने सुरक्षित हैं।", "ڈاؤن لوڈ نامکمل ہے۔ انٹرنیٹ یا خالی جگہ چیک کر کے دوبارہ کوشش کریں۔ محفوظ صفحات برقرار ہیں۔"));
    } finally {
      await refresh().catch(() => {}); setBusy(false);
    }
  }
  const button = "min-h-12 rounded-xl border border-[#b9d8ca] bg-white px-4 py-3 text-base font-semibold disabled:opacity-50";
  return <details className="mt-3 rounded-xl border border-[#c8ded4] bg-white p-4">
    <summary className="cursor-pointer py-2 text-lg font-semibold">{t("Offline reading downloads", "ऑफ़लाइन पढ़ने के लिए डाउनलोड", "آف لائن پڑھنے کے لیے ڈاؤن لوڈ")}</summary>
    <p className="my-3">{t("Save original Mushaf images on this device. Audio and translation are separate and are not included. Browser storage may be cleared by your device.", "असली मुशहफ़ के पन्ने इस डिवाइस पर सेव करें। ऑडियो और तर्जुमा शामिल नहीं हैं। डिवाइस ब्राउज़र का स्टोरेज साफ़ कर सकता है।", "اصل مصحف کے صفحات اس ڈیوائس پر محفوظ کریں۔ آڈیو اور ترجمہ شامل نہیں ہیں۔ ڈیوائس براؤزر کا ذخیرہ صاف کر سکتی ہے۔")}</p>
    <p className="my-3">{count} {t("saved pages", "सेव पन्ने", "محفوظ صفحات")} · {(bytes / 1048576).toFixed(1)} MB</p>
    <p className="my-3 font-semibold" role="status">{savedPages.includes(page) ? t("This page is available offline.", "यह पन्ना ऑफ़लाइन उपलब्ध है।", "یہ صفحہ آف لائن دستیاب ہے۔") : t("This page has not been downloaded.", "यह पन्ना डाउनलोड नहीं हुआ है।", "یہ صفحہ ڈاؤن لوڈ نہیں ہوا ہے۔")}</p>
    {progress && <div className="my-3"><progress aria-label={t("Download progress", "डाउनलोड की प्रगति", "ڈاؤن لوڈ کی پیش رفت")} max={progress.total} value={progress.done} className="w-full" /><p role="status">{progress.done} / {progress.total} {t("pages", "पन्ने", "صفحات")}</p></div>}
    {!supported ? <p>{t("Offline downloads are unavailable in this browser.", "इस ब्राउज़र में ऑफ़लाइन डाउनलोड उपलब्ध नहीं हैं।", "اس براؤزر میں آف لائن ڈاؤن لوڈ دستیاب نہیں ہیں۔")}</p> : <div className="flex flex-wrap gap-2">
      <button className={button} disabled={busy} onClick={() => download("page")}>{t("Save this page", "यह पन्ना सेव करें", "یہ صفحہ محفوظ کریں")}</button>
      <button className={button} disabled={busy} onClick={() => download("para")}>{t("Download para", "पारा डाउनलोड करें", "پارہ ڈاؤن لوڈ کریں")} {para.number}</button>
      <label className="flex flex-col gap-1">{t("Choose surah to download", "डाउनलोड के लिए सूरह चुनें", "ڈاؤن لوڈ کے لیے سورت منتخب کریں")}
        <select disabled={busy} value={surahNumber} onChange={event => setSurahNumber(Number(event.target.value))} className={button}>{MUSHAF_SURAHS.map(surah => <option key={surah.number} value={surah.number}>{surah.number}. {surah.name}</option>)}</select>
      </label>
      <button className={button} disabled={busy} onClick={() => download("surah")}>{t("Download surah", "सूरह डाउनलोड करें", "سورت ڈاؤن لوڈ کریں")}</button>
      {busy && <button className={button} onClick={() => {cancelled.current = true;}}>{t("Stop download", "डाउनलोड रोकें", "ڈاؤن لوڈ روکیں")}</button>}
      <button className={button} disabled={busy || count === 0} onClick={async () => {try {await caches.delete(CACHE); await refresh(); setMessage(t("Saved pages removed.", "सेव पन्ने हटा दिए।", "محفوظ صفحات ہٹا دیے گئے۔"));} catch {setMessage(t("Could not remove downloads. Try again.", "डाउनलोड नहीं हटे। फिर कोशिश करें।", "ڈاؤن لوڈ حذف نہیں ہوئے۔ دوبارہ کوشش کریں۔"));}}}>{t("Remove saved pages", "सेव पन्ने हटाएँ", "محفوظ صفحات حذف کریں")}</button>
    </div>}
    <p role="status" className="mt-3">{message}</p>
  </details>;
}
