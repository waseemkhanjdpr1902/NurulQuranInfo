"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RotateCcw, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const REMEMBRANCES = [
  { ar: "سُبْحَانَ ٱللَّٰهِ", en: "SubhanAllah", mean: "Glory be to Allah", target: 33 },
  { ar: "ٱلْحَمْدُ لِلَّٰهِ", en: "Alhamdulillah", mean: "All praise is due to Allah", target: 33 },
  { ar: "ٱللَّٰهُ أَكْبَرُ", en: "Allahu Akbar", mean: "Allah is the Greatest", target: 34 },
];

export default function TasbihPage() {
  const [count, setCount] = useState(0);
  const [activeRemembrance, setActiveRemembrance] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("nurulquran.tasbih.v1") || "null");
      if (saved && Number.isSafeInteger(saved.count) && saved.count >= 0 && Number.isSafeInteger(saved.totalCount) && saved.totalCount >= saved.count && Number.isInteger(saved.activeRemembrance) && saved.activeRemembrance >= 0 && saved.activeRemembrance < REMEMBRANCES.length) {
        setCount(saved.count); setTotalCount(saved.totalCount); setActiveRemembrance(saved.activeRemembrance);
      }
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) { try { localStorage.setItem("nurulquran.tasbih.v1", JSON.stringify({count, totalCount, activeRemembrance})); } catch {} }
  }, [ready, count, totalCount, activeRemembrance]);

  const increment = useCallback(() => {
    setCount(prev => prev + 1);
    setTotalCount(prev => prev + 1);
    
    // Add haptic feedback if available
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, []);

  const reset = () => {
    setCount(0);
  };

  const nextDhikir = () => {
    setActiveRemembrance((prev) => (prev + 1) % REMEMBRANCES.length);
    setCount(0);
  };

  const current = REMEMBRANCES[activeRemembrance];

  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      
      <div className="pt-40 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center min-h-[80vh] select-none">
        <div className="text-center mb-20 pointer-events-none">
          <motion.h1 className="text-4xl md:text-6xl font-display text-parchment/40 mb-6">Digital <span className="text-gold italic">Tasbih</span></motion.h1>
          <div className="flex items-center justify-center gap-4 text-gold/30 font-mono text-xs uppercase tracking-widest">
            <span>Session: {count}</span>
            <div className="w-1 h-1 bg-gold/20 rounded-full" />
            <span>Lifetime: {totalCount}</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-12 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeRemembrance}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <p className="text-5xl md:text-8xl font-arabic text-gold mb-6">{current.ar}</p>
              <h2 className="text-2xl font-bold text-parchment mb-2">{current.en}</h2>
              <p className="text-parchment/40 text-sm italic">{current.mean}</p>
            </motion.div>
          </AnimatePresence>

          <button type="button" onClick={increment} aria-label="Count dhikr" className="relative rounded-3xl px-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold pointer-events-auto touch-manipulation">
            <motion.div 
              key={count}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-[12rem] md:text-[20rem] font-display text-parchment leading-none"
            >
              {count}
            </motion.div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gold/5 blur-[100px] rounded-full -z-10" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-8 pb-20 relative z-20" onClick={(e) => e.stopPropagation()}>
          <button 
            aria-label="Reset session count"
            onClick={reset}
            className="w-16 h-16 glass rounded-full flex items-center justify-center text-parchment/30 hover:text-gold transition-all"
          >
            <RotateCcw size={24} />
          </button>
          <div className="h-12 w-px bg-white/10" />
          <button 
            onClick={nextDhikir}
            className="px-8 py-4 glass text-gold font-bold text-xs uppercase tracking-widest rounded-2xl flex items-center gap-3 hover:bg-gold/10 transition-all"
          >
            Switch Dhikr <ChevronRight size={18} />
          </button>
        </div>

        <p className="text-parchment/10 text-[10px] uppercase tracking-[0.5em] font-bold pb-10 pointer-events-none">Tap the number to count · Enter or Space on keyboard</p>
      </div>

      <Footer />
    </main>
  );
}
