"use client";

import { usePathname } from "next/navigation";
import { useUILanguage } from "@/components/UILanguageProvider";
import { useEffect, useState } from "react";
import Image from "next/image";

interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function AppInstall() {
  const { t } = useUILanguage();
  const pathname = usePathname();
  const reading = pathname.startsWith("/quran/") || pathname === "/mushaf";
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(
    null,
  );
  const [installed, setInstalled] = useState(true);
  const [open, setOpen] = useState(false);
  const [ios, setIos] = useState(false);
  const [help, setHelp] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)");
    const inApp = () =>
      standalone.matches ||
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
    const rememberInstalled = () => {
      try {
        localStorage.setItem("nurulquran-app-installed", "1");
      } catch {
        /* Storage may be unavailable. */
      }
    };
    const isInstalled = () => {
      if (inApp()) {
        rememberInstalled();
        return true;
      }
      try {
        return localStorage.getItem("nurulquran-app-installed") === "1";
      } catch {
        return false;
      }
    };
    setInstalled(isInstalled());
    setIos(
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1),
    );

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as InstallPromptEvent);
    };
    const onInstalled = () => {
      rememberInstalled();
      setInstalled(true);
      setOpen(false);
      setPromptEvent(null);
    };
    const onDisplayChange = () => {
      const value = isInstalled();
      setInstalled(value);
      if (value) setOpen(false);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === "nurulquran-app-installed") onDisplayChange();
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    window.addEventListener("storage", onStorage);
    standalone.addEventListener("change", onDisplayChange);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* Reading remains available if registration fails. */
      });
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      window.removeEventListener("storage", onStorage);
      standalone.removeEventListener("change", onDisplayChange);
    };
  }, []);

  useEffect(() => {
    if (reading) {
      setOpen(false);
      return;
    }
    if (installed || pathname !== "/") return;
    try {
      if (sessionStorage.getItem("nurulquran-install-dismissed")) return;
    } catch {}
    const timer = setTimeout(() => setOpen(true), 45000);
    return () => clearTimeout(timer);
  }, [reading, installed, pathname]);

  function dismiss() {
    setOpen(false);
    try {
      sessionStorage.setItem("nurulquran-install-dismissed", "1");
    } catch {
      /* Storage may be unavailable. */
    }
  }

  async function install() {
    if (!promptEvent) {
      setHelp(true);
      return;
    }
    setBusy(true);
    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      setPromptEvent(null);
      if (choice.outcome === "accepted") dismiss();
      else setHelp(true);
    } catch {
      setPromptEvent(null);
      setHelp(true);
    } finally {
      setBusy(false);
    }
  }

  if (installed || reading) return null;
  return (
    <aside
      aria-label="Install NurulQuran app"
      style={{
        position: "fixed",
        bottom: "max(16px, env(safe-area-inset-bottom))",
        left: 16,
        zIndex: 110,
        maxWidth: "calc(100vw - 32px)",
      }}
    >
      {open ? (
        <section
          aria-labelledby="app-install-title"
          style={{
            width: 340,
            maxWidth: "calc(100vw - 32px)",
            borderRadius: 18,
            padding: 20,
            background: "#fff",
            color: "#12352a",
            boxShadow: "0 8px 40px #0005",
            border: "1px solid #d4af37",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <Image
              src="/nurulquran-logo.png"
              alt="NurulQuran"
              width={2172}
              height={724}
              style={{ width: 190, height: "auto" }}
            />
            <button
              type="button"
              aria-label="Dismiss install invitation"
              onClick={dismiss}
              style={{ padding: 8, fontSize: 24, lineHeight: 1 }}
            >
              ×
            </button>
          </div>
          <h2
            id="app-install-title"
            style={{ fontWeight: 700, marginTop: 12, fontSize: 18 }}
          >
            {t(
              "Install NurulQuran app",
              "नूरुल क़ुरआन ऐप जोड़ें",
              "نور القرآن ایپ شامل کریں",
            )}
          </h2>
          <p style={{ fontSize: 14, marginTop: 6 }}>
            {t(
              "Add NurulQuran to your home screen for easy reading and listening.",
              "आसानी से पढ़ने और सुनने के लिए नूरुल क़ुरआन को होम स्क्रीन पर जोड़ें।",
              "آسانی سے پڑھنے اور سننے کے لیے نور القرآن کو ہوم اسکرین پر شامل کریں۔",
            )}
          </p>
          {help && (
            <div
              role="status"
              style={{
                marginTop: 12,
                padding: 12,
                borderRadius: 10,
                background: "#eef7f1",
                fontSize: 14,
              }}
            >
              {ios
                ? t(
                    "Open in Safari. Tap Share → Add to Home Screen → Add.",
                    "Safari में खोलें। Share → Add to Home Screen → Add चुनें।",
                    "Safari میں کھولیں۔ Share → Add to Home Screen → Add منتخب کریں۔",
                  )
                : t(
                    "Open in Chrome or Edge. In the browser menu choose Install app or Add to Home screen. From WhatsApp, open the link in your browser first.",
                    "Chrome या Edge में खोलें। ब्राउज़र के मेनू में Install app या Add to Home screen चुनें। WhatsApp से आए हों तो लिंक पहले ब्राउज़र में खोलें।",
                    "Chrome یا Edge میں کھولیں۔ براؤزر کے مینو میں Install app یا Add to Home screen منتخب کریں۔ WhatsApp سے آئے ہوں تو لنک پہلے براؤزر میں کھولیں۔",
                  )}
            </div>
          )}
          <button
            type="button"
            disabled={busy}
            onClick={install}
            style={{
              width: "100%",
              background: "#075c3a",
              color: "#fff",
              borderRadius: 10,
              padding: "12px 16px",
              marginTop: 14,
              fontWeight: 700,
            }}
          >
            {busy
              ? t("Opening…", "खुल रहा है…", "کھل رہا ہے…")
              : promptEvent
                ? t("Install app", "ऐप जोड़ें", "ایپ شامل کریں")
                : t("How to install", "ऐप कैसे जोड़ें", "ایپ کیسے شامل کریں")}
          </button>
          <button
            type="button"
            onClick={dismiss}
            style={{ width: "100%", paddingTop: 10, fontSize: 13 }}
          >
            {t(
              "Continue on website",
              "वेबसाइट पर जारी रखें",
              "ویب سائٹ پر جاری رکھیں",
            )}
          </button>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => {
            setHelp(false);
            setOpen(true);
          }}
          style={{
            borderRadius: 24,
            padding: "10px 16px",
            background: "#fff",
            color: "#075c3a",
            border: "1px solid #d4af37",
            boxShadow: "0 3px 16px #0003",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          {t("Install app", "ऐप जोड़ें", "ایپ شامل کریں")}
        </button>
      )}
    </aside>
  );
}
