"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ANALYTICS_ID, CONSENT_EVENT, CONSENT_KEY, readAnalyticsConsent, setAnalyticsConsent, type AnalyticsConsent } from "@/lib/privacy";
import { useUILanguage } from "@/components/UILanguageProvider";

type AnalyticsWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };

export default function PrivacyAnalytics() {
  const pathname = usePathname();
  const { t } = useUILanguage();
  const [choice, setChoice] = useState<AnalyticsConsent>(null);
  const [ready, setReady] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  useEffect(() => {
    const apply = (value: AnalyticsConsent) => {
      (window as unknown as Record<string, unknown>)[`ga-disable-${ANALYTICS_ID}`] = value !== "granted";
      setChoice(value);
    };
    const onStorage = (event: StorageEvent) => { if (event.key === CONSENT_KEY || event.key === null) apply(readAnalyticsConsent()); };
    const onChoice = (event: Event) => apply((event as CustomEvent<AnalyticsConsent>).detail);
    apply(readAnalyticsConsent()); setReady(true);
    window.addEventListener("storage", onStorage); window.addEventListener(CONSENT_EVENT, onChoice);
    return () => { window.removeEventListener("storage", onStorage); window.removeEventListener(CONSENT_EVENT, onChoice); };
  }, []);

  useEffect(() => {
    if (!scriptReady || choice !== "granted") return;
    const analytics = window as AnalyticsWindow;
    analytics.dataLayer = analytics.dataLayer || [];
    analytics.gtag = analytics.gtag || function () { analytics.dataLayer!.push(arguments); };
    analytics.gtag("js", new Date());
    analytics.gtag("config", ANALYTICS_ID, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
  }, [scriptReady, choice]);

  useEffect(() => {
    if (!scriptReady || choice !== "granted") return;
    // Do not send query parameters or fragments, which could contain a reader's input.
    (window as AnalyticsWindow).gtag?.("event", "page_view", { page_location: `${window.location.origin}${pathname}`, page_path: pathname });
  }, [pathname, scriptReady, choice]);

  const showPrompt = ready && choice === null && pathname === "/";
  return <>
    {ready && choice === "granted" && <Script id="nurulquran-optional-analytics" src={`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`} strategy="afterInteractive" onReady={() => setScriptReady(true)} />}
    {showPrompt && <aside aria-label={t("Optional analytics", "वैकल्पिक एनालिटिक्स", "اختیاری تجزیات")} className="fixed bottom-4 left-4 right-4 z-[65] max-h-[45svh] overflow-y-auto rounded-2xl border border-gold/30 bg-white p-4 text-parchment shadow-xl sm:left-auto sm:max-w-md">
      <p className="font-semibold">{t("Your privacy choice", "आपकी निजता का चुनाव", "آپ کی رازداری کا انتخاب")}</p>
      <p className="mt-2 text-sm leading-6">{t("Allow optional visit analytics to help improve NurulQuran? Reading and listening work with either choice.", "NurulQuran को बेहतर बनाने के लिए विज़िट का वैकल्पिक विश्लेषण चालू करें? पढ़ना और सुनना दोनों विकल्पों में काम करेंगे।", "NurulQuran کو بہتر بنانے کے لیے اختیاری تجزیات کی اجازت دیں؟ پڑھنا اور سننا دونوں صورتوں میں دستیاب رہیں گے۔")}</p>
      <div className="mt-3 flex flex-wrap gap-3">
        <button type="button" onClick={() => setAnalyticsConsent("granted")} className="min-h-11 rounded-xl border border-gold px-4 font-semibold">{t("Allow", "अनुमति दें", "اجازت دیں")}</button>
        <button type="button" onClick={() => setAnalyticsConsent("denied")} className="min-h-11 rounded-xl border border-gold px-4 font-semibold">{t("Decline", "मना करें", "اجازت نہ دیں")}</button>
        <Link href="/privacy#privacy-choices" className="inline-flex min-h-11 items-center px-1 text-sm underline">{t("Privacy details", "निजता की जानकारी", "رازداری کی تفصیل")}</Link>
      </div>
    </aside>}
  </>;
}
