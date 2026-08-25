"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X, Heart } from "lucide-react";

interface AllahName {
  number: number;
  name: string;
  transliteration: string;
  en: {
    meaning: string;
  };
}

export default function RemembrancePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentName, setCurrentName] = useState<AllahName | null>(null);

  useEffect(() => {
    const fetchAndShow = async () => {
      try {
        const res = await fetch("https://api.aladhan.com/v1/asmaAlHusna");
        const data = await res.json();
        if (data.code === 200) {
          const names = data.data;
          // Use today's date to pick a consistent name for the day
          const today = new Date();
          const index = (today.getFullYear() + today.getMonth() + today.getDate()) % names.length;
          setCurrentName(names[index]);
          
          // Show after a short delay
          const timer = setTimeout(() => {
            const dismissedToday = localStorage.getItem(`remembrance_dismissed_${today.toDateString()}`);
            if (!dismissedToday) {
              setIsVisible(true);
            }
          }, 3000);
          
          return () => clearTimeout(timer);
        }
      } catch (err) {
        console.error("Popup fetch failed:", err);
      }
    };
    
    fetchAndShow();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleDismiss();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
    const today = new Date();
    localStorage.setItem(`remembrance_dismissed_${today.toDateString()}`, "true");
  };

  return (
    <AnimatePresence>
      {isVisible && currentName && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
          className="fixed left-4 right-4 top-24 z-[110] mx-auto w-auto max-w-sm md:bottom-8 md:left-auto md:right-8 md:top-auto md:mx-0"
          role="dialog"
          aria-label="Today's Name of Allah"
        >
          <div className="relative overflow-hidden rounded-[32px] border border-gold/40 bg-ink p-6 shadow-2xl shadow-black/60 group">
            <div className="absolute right-3 top-3 z-10">
              <button 
                onClick={handleDismiss}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 bg-gold text-ink shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parchment"
                title="Dismiss for today"
                aria-label="Close"
              >
                <X size={24} strokeWidth={3} />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-ink shrink-0">
                <Heart size={18} />
              </div>
              <div>
                <h4 className="text-gold font-bold text-xs uppercase tracking-widest leading-none mb-1">Remembrance</h4>
                <p className="text-parchment/40 text-[10px]">Today&apos;s Name of Allah</p>
              </div>
            </div>

            <div className="mb-4 rounded-2xl border border-white/10 bg-[#102f27] p-4 text-center">
              <h3 className="text-4xl font-arabic text-parchment mb-2 group-hover:text-gold transition-colors">
                {currentName.name}
              </h3>
              <p className="text-sm font-display text-gold mb-1">{currentName.transliteration}</p>
              <p className="text-xs text-parchment/60 font-light italic">&quot;{currentName.en.meaning}&quot;</p>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <Sparkles key={i} size={10} className="text-gold/40 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
              <button 
                onClick={handleDismiss}
                className="text-[10px] font-bold uppercase tracking-widest text-gold hover:text-parchment transition-colors"
              >
                Subhanallah
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
