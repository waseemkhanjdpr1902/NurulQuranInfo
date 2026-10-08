"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function AppInstall() {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(true);
  const [open, setOpen] = useState(false);
  const [ios, setIos] = useState(false);
  const [help, setHelp] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)");
    const isInstalled = () => standalone.matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
    setInstalled(isInstalled());
    setIos(/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
    try { if (!isInstalled() && !sessionStorage.getItem("nurulquran-install-dismissed")) setOpen(true); } catch { if (!isInstalled()) setOpen(true); }
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as InstallPromptEvent);
    };
    const onInstalled = () => { setInstalled(true); setOpen(false); setPromptEvent(null); };
    const onDisplayChange = () => setInstalled(isInstalled());
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    standalone.addEventListener("change", onDisplayChange);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => { /* Reading remains available if registration fails. */ });
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      standalone.removeEventListener("change", onDisplayChange);
    };
  }, []);

  function dismiss() {
    setOpen(false);
    try { sessionStorage.setItem("nurulquran-install-dismissed", "1"); } catch { /* Storage may be unavailable. */ }
  }

  async function install() {
    if (!promptEvent) { setHelp(true); return; }
    setBusy(true);
    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      setPromptEvent(null);
      if (choice.outcome === "accepted") dismiss();
      else setHelp(true);
    } catch { setPromptEvent(null); setHelp(true); }
    finally { setBusy(false); }
  }

  if (installed) return null;
  return (
    <aside aria-label="Install NurulQuran app" style={{ position: "fixed", bottom: "max(16px, env(safe-area-inset-bottom))", left: 16, zIndex: 110, maxWidth: "calc(100vw - 32px)" }}>
      {open ? (
        <section aria-labelledby="app-install-title" style={{ width: 340, maxWidth: "calc(100vw - 32px)", borderRadius: 18, padding: 20, background: "#fff", color: "#12352a", boxShadow: "0 8px 40px #0005", border: "1px solid #d4af37" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <Image src="/nurulquran-logo.png" alt="NurulQuran" width={2172} height={724} style={{ width: 190, height: "auto" }} />
            <button type="button" aria-label="Dismiss install invitation" onClick={dismiss} style={{ padding: 8, fontSize: 24, lineHeight: 1 }}>×</button>
          </div>
          <h2 id="app-install-title" style={{ fontWeight: 700, marginTop: 12, fontSize: 18 }}>Install NurulQuran app</h2>
          <p style={{ fontSize: 14, marginTop: 6 }}>Add NurulQuran to your home screen for easy access to reading, recitation and tafseer.</p>
          {help && <div role="status" style={{ marginTop: 12, padding: 12, borderRadius: 10, background: "#eef7f1", fontSize: 14 }}>
            {ios ? "Open this website in Safari, tap Share, then Add to Home Screen and Add." : "Open this website in Chrome or Edge. Open the browser menu and choose Install app or Add to Home screen. If you opened a link inside WhatsApp or another app, open it in your browser first."}
          </div>}
          <button type="button" disabled={busy} onClick={install} style={{ width: "100%", background: "#075c3a", color: "#fff", borderRadius: 10, padding: "12px 16px", marginTop: 14, fontWeight: 700 }}>{busy ? "Opening…" : promptEvent ? "Install app" : "How to install"}</button>
          <button type="button" onClick={dismiss} style={{ width: "100%", paddingTop: 10, fontSize: 13 }}>Continue on website</button>
        </section>
      ) : (
        <button type="button" onClick={() => { setHelp(false); setOpen(true); }} style={{ borderRadius: 24, padding: "10px 16px", background: "#fff", color: "#075c3a", border: "1px solid #d4af37", boxShadow: "0 3px 16px #0003", fontWeight: 700, fontSize: 14 }}>Install app</button>
      )}
    </aside>
  );
}
