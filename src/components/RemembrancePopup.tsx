"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Bell, Brain, Check, X } from "lucide-react";
import { ALLAH_NAMES } from "@/data/names-of-allah";

type ReminderStatus = "idle" | "shown" | "unsupported" | "denied";

function dailyName() {
  const now = new Date();
  const dayNumber = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
  return ALLAH_NAMES[dayNumber % ALLAH_NAMES.length];
}

export default function RemembrancePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [reminderStatus, setReminderStatus] = useState<ReminderStatus>("idle");
  const [currentName, setCurrentName] = useState<(typeof ALLAH_NAMES)[number] | null>(null);

  const dismiss = () => {
    setIsVisible(false);
    localStorage.setItem(`remembrance_seen_${new Date().toDateString()}`, "true");
  };

  useEffect(() => {
    setCurrentName(dailyName());
    const todayKey = `remembrance_seen_${new Date().toDateString()}`;
    if (localStorage.getItem(todayKey)) return;
    const showTimer = window.setTimeout(() => setIsVisible(true), 1200);
    return () => window.clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !window.isSecureContext) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch((error) => {
      console.error("Notification service worker registration failed:", error);
    });
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const hideTimer = window.setTimeout(dismiss, 5000);
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") dismiss(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => { window.clearTimeout(hideTimer); window.removeEventListener("keydown", closeOnEscape); };
  }, [isVisible]);

  async function showPhoneReminder() {
    if (!currentName) return;
    if (!("Notification" in window)) { setReminderStatus("unsupported"); return; }
    const permission = Notification.permission === "default" ? await Notification.requestPermission() : Notification.permission;
    if (permission !== "granted") { setReminderStatus("denied"); return; }
    try {
      const title = `${currentName.ar} · ${currentName.en}`;
      const options: NotificationOptions = {
        body: `${currentName.mean}\nRepeat the name three times to help memorise it.`,
        lang: "en",
        tag: `nurulquran-name-${currentName.number}`,
        requireInteraction: false,
        data: { url: "/names-of-allah" },
      };

      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, options);
        window.setTimeout(async () => {
          const notifications = await registration.getNotifications({ tag: options.tag });
          notifications.forEach(notification => notification.close());
        }, 5000);
      } else {
        const notification = new Notification(title, options);
        window.setTimeout(() => notification.close(), 5000);
      }
      setReminderStatus("shown");
    } catch (error) {
      console.error("Unable to show Allah's Name notification:", error);
      setReminderStatus("unsupported");
    }
  }

  return <AnimatePresence>
    {isVisible && currentName ? <motion.aside
      initial={{ opacity: 0, y: -24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className="fixed left-4 right-4 top-24 z-[110] mx-auto w-auto max-w-sm md:bottom-8 md:left-auto md:right-8 md:top-auto md:mx-0"
      role="dialog"
      aria-label="Five-second Name of Allah memorisation card"
    >
      <div className="relative overflow-hidden rounded-[30px] border border-emerald-300/40 bg-[#0b352d] p-5 text-[#f6f7f1] shadow-2xl shadow-black/45 sm:p-6">
        <div className="absolute inset-x-0 top-0 h-1 bg-white/15"><motion.div className="h-full bg-[#68d5b8]" initial={{ width: "100%" }} animate={{ width: "0%" }} transition={{ duration: 5, ease: "linear" }}/></div>
        <button onClick={dismiss} className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white text-[#0b352d] shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#68d5b8]" aria-label="Close" title="Close"><X size={23} strokeWidth={3}/></button>

        <div className="flex items-center gap-3 pr-12">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#68d5b8] text-[#0b352d]"><Brain size={20}/></span>
          <div><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#8ce5cf]">5-second memorisation</p><p className="mt-1 text-xs text-white/60">Today’s Name of Allah · {currentName.number} of 99</p></div>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/8 px-4 py-5 text-center">
          <p dir="rtl" lang="ar" className="font-arabic text-5xl leading-relaxed text-white">{currentName.ar}</p>
          <h2 className="mt-2 font-display text-xl font-bold text-[#8ce5cf]">{currentName.en}</h2>
          <p className="mt-1 text-sm leading-6 text-white/75">{currentName.mean}</p>
        </div>

        <p className="mt-4 text-center text-xs font-semibold text-white/70">Look · pronounce · repeat three times</p>
        <button onClick={showPhoneReminder} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#68d5b8]/45 bg-[#68d5b8]/10 px-4 text-xs font-bold text-[#a8f0de] hover:bg-[#68d5b8]/20" aria-label="Show a five-second phone notification preview">
          {reminderStatus === "shown" ? <Check size={17}/> : <Bell size={17}/>} {reminderStatus === "shown" ? "Phone reminder shown" : "Try lock-screen notification"}
        </button>
        {reminderStatus === "unsupported" ? <p className="mt-2 text-center text-xs text-amber-200">Notifications are not supported in this browser.</p> : null}
        {reminderStatus === "denied" ? <p className="mt-2 text-center text-xs text-amber-200">Allow notifications in your browser settings to use this option.</p> : null}
      </div>
    </motion.aside> : null}
  </AnimatePresence>;
}
