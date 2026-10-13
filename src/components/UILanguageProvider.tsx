"use client";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
export type UILanguage = "en" | "hi" | "ur";
export type Translate = (
  english: string,
  hindi: string,
  urdu: string,
) => string;
const storageKey = "nurulquran.ui-language.v1";
const valid = (value: unknown): value is UILanguage =>
  value === "en" || value === "hi" || value === "ur";
const Context = createContext<{
  language: UILanguage;
  setLanguage: (value: UILanguage) => void;
  t: Translate;
  rtl: boolean;
} | null>(null);
export function UILanguageProvider({ children }: { children: ReactNode }) {
  const [language, change] = useState<UILanguage>("en");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("lang");
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(storageKey);
    } catch {}
    const browser = navigator.language.split("-")[0];
    change(
      valid(requested)
        ? requested
        : valid(saved)
          ? saved
          : valid(browser)
            ? browser
            : "en",
    );
    setReady(true);
    const sync = (e: StorageEvent) => {
      if (e.key === storageKey && valid(e.newValue)) change(e.newValue);
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = language;
    document.documentElement.dataset.uiLanguage = language;
    try {
      localStorage.setItem(storageKey, language);
    } catch {}
  }, [language, ready]);
  const setLanguage = useCallback((value: UILanguage) => {
    change(value);
  }, []);
  const t = useCallback<Translate>(
    (en, hi, ur) => (language === "hi" ? hi : language === "ur" ? ur : en),
    [language],
  );
  return (
    <Context.Provider
      value={{ language, setLanguage, t, rtl: language === "ur" }}
    >
      {children}
    </Context.Provider>
  );
}
export function useUILanguage() {
  const value = useContext(Context);
  if (!value) throw new Error("UI language provider missing");
  return value;
}
export function LanguageSelector() {
  const { language, setLanguage, t } = useUILanguage();
  return (
    <label className="flex shrink-0 items-center gap-1 text-parchment">
      <span className="sr-only">
        {t("Website language", "वेबसाइट की भाषा", "ویب سائٹ کی زبان")}
      </span>
      <select
        aria-label={t(
          "Website language",
          "वेबसाइट की भाषा",
          "ویب سائٹ کی زبان",
        )}
        value={language}
        onChange={(e) => {
          if (valid(e.target.value)) setLanguage(e.target.value);
        }}
        className="min-h-11 max-w-[105px] rounded-xl border border-gold/30 bg-white px-2 text-sm font-semibold text-parchment"
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
        <option value="ur">اردو</option>
      </select>
    </label>
  );
}
