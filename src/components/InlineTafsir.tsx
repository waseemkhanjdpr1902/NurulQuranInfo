"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, ChevronDown, Loader2 } from "lucide-react";
import { TAFSIR_EDITIONS, type TafsirLanguage } from "@/lib/tafsir-editions";

type Tafsir = { text: string; language: TafsirLanguage; resourceName: string; author: string; sourceUrl: string };

export default function InlineTafsir({ verseKey, language }: { verseKey: string; language: TafsirLanguage }) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<Tafsir | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [retry, setRetry] = useState(0);
  const cache = useRef<Record<string, Tafsir>>({});
  const contentKey = `${verseKey}:${language}`;

  useEffect(() => {
    if (!open) return;
    const cached = cache.current[contentKey];
    setContent(cached || null);
    setError("");
    setLoading(!cached);
    if (cached) return;
    const controller = new AbortController();
    const load = async () => {
      try {
        const response = await fetch(`/api/tafsir?verse_key=${encodeURIComponent(verseKey)}&language=${language}`, { signal: controller.signal });
        const data = await response.json();
        if (!response.ok || !data?.text || data.language !== language) throw new Error(data?.error || "Tafsir could not be loaded. Please try again.");
        if (controller.signal.aborted) return;
        cache.current[contentKey] = data;
        setContent(data);
      } catch (cause) {
        if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Tafsir could not be loaded. Please try again.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    void load();
    return () => controller.abort();
  }, [open, contentKey, verseKey, language, retry]);

  // Hide the old edition immediately when the reader changes language.
  const currentContent = content?.language === language ? content : null;
  return (
    <details name="ayah-tafsir" className="group/tafsir mt-6 rounded-2xl border border-gold/25 bg-white/70" onToggle={event => setOpen(event.currentTarget.open)}>
      <summary aria-label={`Tafsir for ayah ${verseKey}`} className="flex min-h-12 cursor-pointer list-none flex-wrap items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-[#0d6658] [&::-webkit-details-marker]:hidden">
        <BookOpen size={18} aria-hidden="true" /> Tafsir
        <span className="ml-auto text-xs font-normal">{TAFSIR_EDITIONS[language].label}</span>
        <ChevronDown size={18} aria-hidden="true" className="transition-transform group-open/tafsir:rotate-180" />
      </summary>
      {open && <div className="border-t border-gold/20 p-4 sm:p-6">
        {loading ? <p role="status" className="flex items-center gap-2 text-sm text-parchment"><Loader2 size={18} className="animate-spin" /> Loading {TAFSIR_EDITIONS[language].name}…</p>
          : error ? <div role="alert" className="space-y-3 text-sm text-parchment"><p>{error}</p><button onClick={() => setRetry(value => value + 1)} className="min-h-11 rounded-xl bg-gold px-4 font-semibold text-white">Retry tafsir</button></div>
          : currentContent ? <>
            <p className="mb-4 text-sm text-gold">{currentContent.resourceName} · {currentContent.author}
              <a href={currentContent.sourceUrl} target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex min-h-11 items-center underline">View source</a>
            </p>
            <div lang={language} dir={language === "ur" ? "rtl" : "ltr"} className={`whitespace-pre-line text-parchment ${language === "ur" ? "text-xl leading-loose" : "text-base leading-relaxed"}`}>{currentContent.text}</div>
          </> : null}
      </div>}
    </details>
  );
}
