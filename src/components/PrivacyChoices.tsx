"use client";

import { useEffect, useState } from "react";
import { CONSENT_EVENT, isReadingDataKey, readAnalyticsConsent, setAnalyticsConsent, type AnalyticsConsent } from "@/lib/privacy";

export default function PrivacyChoices() {
  const [choice, setChoice] = useState<AnalyticsConsent>(null);
  const [ready, setReady] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const sync = () => setChoice(readAnalyticsConsent());
    const onChoice = (event: Event) => setChoice((event as CustomEvent<AnalyticsConsent>).detail);
    sync(); setReady(true);
    window.addEventListener("storage", sync);
    window.addEventListener(CONSENT_EVENT, onChoice);
    return () => { window.removeEventListener("storage", sync); window.removeEventListener(CONSENT_EVENT, onChoice); };
  }, []);

  function choose(value: "granted" | "denied") {
    setAnalyticsConsent(value);
    setMessage(`Optional analytics ${value === "granted" ? "enabled" : "disabled"} for this browser. Reading and listening remain available.`);
  }

  async function clearReadingData() {
    if (!confirmed || busy) return;
    setBusy(true); setMessage("");
    try {
      const keys = Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i)).filter((key): key is string => Boolean(key));
      for (const key of keys) if (isReadingDataKey(key)) localStorage.removeItem(key);
      // Revoking analytics is intentional; never clear authentication tokens or unrelated storage.
      setAnalyticsConsent("denied");
      if ("caches" in window) {
        const names = await caches.keys();
        await Promise.all(names.filter(name => name.startsWith("nurulquran-")).map(name => caches.delete(name)));
      }
      setConfirmed(false);
      setMessage("Reading progress, reflections, saved Mushaf position and offline caches were cleared on this browser. Optional analytics is off. Your account and cloud data were not deleted; signed-in data can return when you sync. Use the deletion request below for cloud data.");
    } catch {
      setMessage("Some browser storage could not be cleared. Use your browser’s site-data settings for nurulquran.info, or contact support. Your account has not been deleted.");
    } finally { setBusy(false); }
  }

  return <section aria-labelledby="privacy-choices-title" id="privacy-choices">
    <h2 id="privacy-choices-title">Your privacy choices</h2>
    <p>Optional Google Analytics helps us understand page visits and improve the service. It stays off until you choose to allow it. You can change this choice here at any time.</p>
    <p className="mt-3 font-semibold">{ready ? `Current choice: ${choice === "granted" ? "allowed" : choice === "denied" ? "declined" : "not chosen — analytics is off"}.` : "Loading your browser preference…"}</p>
    <div className="my-4 flex flex-wrap gap-3">
      <button type="button" disabled={!ready} aria-pressed={choice === "granted"} onClick={() => choose("granted")} className="min-h-12 rounded-xl border border-gold px-5 font-semibold disabled:opacity-50">Allow analytics</button>
      <button type="button" disabled={!ready} aria-pressed={choice === "denied"} onClick={() => choose("denied")} className="min-h-12 rounded-xl border border-gold px-5 font-semibold disabled:opacity-50">Decline analytics</button>
    </div>
    <p className="text-sm">This choice is specific to this browser and website origin. It does not remove hosting/security logs or previously collected analytics. Your browser may store the installed app’s data. You can also revoke location and notification permissions in your browser or Android settings.</p>
    <h3>Clear reading data on this browser</h3>
    <p>This removes local reading progress, reflections, your saved Mushaf page and downloaded offline pages. It does not delete your account, cloud-synced data, or data on other devices. Cloud data can return after sign-in or synchronization.</p>
    <label className="my-4 flex items-start gap-3 leading-7"><input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)} className="mt-1.5 h-5 w-5 shrink-0" />I understand that unsynced notes and offline downloads on this browser will be removed.</label>
    <button type="button" disabled={!confirmed || busy} onClick={clearReadingData} className="min-h-12 rounded-xl border border-red-700 px-5 font-semibold text-red-800 disabled:opacity-50">{busy ? "Clearing…" : "Clear local reading data"}</button>
    <p role="status" aria-live="polite" className="mt-4 font-medium">{message}</p>
  </section>;
}
