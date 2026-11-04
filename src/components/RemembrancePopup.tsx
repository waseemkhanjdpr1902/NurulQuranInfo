"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Bell, Brain, Check, X } from "lucide-react";
import { ALLAH_NAMES } from "@/data/names-of-allah";

type ReminderStatus = "idle" | "shown" | "unsupported" | "denied" | "error";
const REMINDER_KEY = "nurulquran.name-reminder-enabled";

function dailyName() {
  const now = new Date();
  const dayNumber = Math.floor(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000,
  );
  return ALLAH_NAMES[dayNumber % ALLAH_NAMES.length];
}

export default function RemembrancePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [reminderStatus, setReminderStatus] = useState<ReminderStatus>("idle");
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [currentName, setCurrentName] = useState<
    (typeof ALLAH_NAMES)[number] | null
  >(null);

  const dismiss = () => setIsVisible(false);

  useEffect(() => {
    const name = dailyName();
    setCurrentName(name);
    setIsVisible(true);
    try {
      const enabled = localStorage.getItem(REMINDER_KEY) === "true";
      setRemindersEnabled(enabled);
      if (enabled) {
        if (!("Notification" in window)) setReminderStatus("unsupported");
        else if (Notification.permission !== "granted") setReminderStatus("denied");
        else void deliverReminder(name).then(() => setReminderStatus("shown")).catch(() => setReminderStatus("error"));
      }
    } catch { /* Reading the name still works when storage is unavailable. */ }
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !window.isSecureContext) return;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .catch((error) => {
        console.error(
          "Notification service worker registration failed:",
          error,
        );
      });
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isVisible]);

  async function togglePhoneReminder() {
    if (!currentName) return;
    if (remindersEnabled) {
      try { localStorage.removeItem(REMINDER_KEY); } catch {}
      setRemindersEnabled(false);
      setReminderStatus("idle");
      return;
    }
    if (!("Notification" in window) || !("serviceWorker" in navigator) || !window.isSecureContext) {
      setReminderStatus("unsupported");
      return;
    }
    try {
      const permission = Notification.permission === "default"
        ? await Notification.requestPermission() : Notification.permission;
      if (permission !== "granted") { setReminderStatus("denied"); return; }
      await deliverReminder(currentName);
      try { localStorage.setItem(REMINDER_KEY, "true"); } catch {
        setReminderStatus("error"); return;
      }
      setRemindersEnabled(true);
      setReminderStatus("shown");
    } catch (error) {
      console.error("Unable to show Allah's Name notification:", error);
      setReminderStatus("error");
    }
  }

  return (
    <AnimatePresence>
      {isVisible && currentName ? (
        <motion.aside
          initial={{ opacity: 0, y: -24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="fixed left-4 right-4 top-24 z-[110] mx-auto w-auto max-w-sm md:bottom-8 md:left-auto md:right-8 md:top-auto md:mx-0"
          role="dialog"
          aria-label="Name of Allah memorisation card"
        >
          <div className="relative max-h-[calc(100dvh-8rem)] overflow-y-auto rounded-[30px] border border-emerald-300/40 bg-[#0b352d] p-5 text-[#f6f7f1] shadow-2xl shadow-black/45 sm:p-6">
            <button
              onClick={dismiss}
              className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white text-[#0b352d] shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#68d5b8]"
              aria-label="Close"
              title="Close"
            >
              <X size={23} strokeWidth={3} />
            </button>

            <div className="flex items-center gap-3 pr-12">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#68d5b8] text-[#0b352d]">
                <Brain size={20} />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#8ce5cf]">
                  Memorise a name
                </p>
                <p className="mt-1 text-xs text-white/60">
                  Today’s Name of Allah · {currentName.number} of 99
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/8 px-4 py-5 text-center">
              <p
                dir="rtl"
                lang="ar"
                className="font-arabic text-5xl leading-relaxed text-white"
              >
                {currentName.ar}
              </p>
              <h2 className="mt-2 font-display text-xl font-bold text-[#8ce5cf]">
                {currentName.en}
              </h2>
              <p className="mt-1 text-sm leading-6 text-white/75">
                {currentName.mean}
              </p>
            </div>

            <p className="mt-4 text-center text-xs font-semibold text-white/70">
              Look · pronounce · repeat three times
            </p>
            <button
              onClick={togglePhoneReminder}
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#68d5b8]/45 bg-[#68d5b8]/10 px-4 text-xs font-bold text-[#a8f0de] hover:bg-[#68d5b8]/20"
              aria-pressed={remindersEnabled}
            >
              {reminderStatus === "shown" ? (
                <Check size={17} />
              ) : (
                <Bell size={17} />
              )}{" "}
              {remindersEnabled ? "Turn off phone reminders" : "Enable phone reminders"}
            </button>
            <p className="mt-2 text-center text-xs leading-5 text-white/75">A reminder is sent when you open the app or website. It may appear on your lock screen if your phone allows notifications there. Reminders are not scheduled while the app is closed.</p>
            {reminderStatus === "shown" ? <p role="status" className="mt-2 text-center text-xs text-[#a8f0de]">Reminder sent. Check your phone’s notification settings if it is not visible.</p> : null}
            {reminderStatus === "error" ? <p role="alert" className="mt-2 text-center text-xs text-amber-200">Could not set the reminder. Check notification and browser settings and try again.</p> : null}
            {reminderStatus === "unsupported" ? (
              <p className="mt-2 text-center text-xs text-amber-200">
                Notifications are not supported in this browser.
              </p>
            ) : null}
            {reminderStatus === "denied" ? (
              <p className="mt-2 text-center text-xs text-amber-200">
                Allow notifications in your browser settings to use this option.
              </p>
            ) : null}
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}

async function deliverReminder(name: (typeof ALLAH_NAMES)[number]) {
  if (!("serviceWorker" in navigator) || !window.isSecureContext) throw new Error("Notifications unavailable");
  const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
  await navigator.serviceWorker.ready;
  await registration.showNotification(`${name.ar} · ${name.en}`, {
    body: `${name.mean}\nRepeat the name three times to help memorise it.`,
    lang: "en", tag: "nurulquran-name-reminder", data: { url: "/names-of-allah" },
  });
}
