"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RotateCcw, Save, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Breadcrumbs, RelatedTools, ToolGuidance } from "@/components/tooling";

const REMEMBRANCES = [
  { ar: "سُبْحَانَ ٱللَّٰهِ", en: "SubhanAllah", mean: "Glory be to Allah", target: 33 },
  { ar: "ٱلْحَمْدُ لِلَّٰهِ", en: "Alhamdulillah", mean: "All praise is due to Allah", target: 33 },
  { ar: "ٱللَّٰهُ أَكْبَرُ", en: "Allahu Akbar", mean: "Allah is the Greatest", target: 34 },
];

export default function TasbihPage() {
  const [count, setCount] = useState(0);
  const [activeRemembrance, setActiveRemembrance] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [history, setHistory] = useState<{ name: string; count: number; savedAt: string }[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCount(Number(window.localStorage.getItem("tasbih.sessionCount") || 0));
    setTotalCount(Number(window.localStorage.getItem("tasbih.totalCount") || 0));
    setHistory(JSON.parse(window.localStorage.getItem("tasbih.history") || "[]"));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem("tasbih.sessionCount", String(count));
    window.localStorage.setItem("tasbih.totalCount", String(totalCount));
    window.localStorage.setItem("tasbih.history", JSON.stringify(history.slice(0, 10)));
  }, [count, totalCount, history, hydrated]);

  const increment = useCallback(() => {
    setCount(prev => prev + 1);
    setTotalCount(prev => prev + 1);
    
    // Add haptic feedback if available
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, []);

  const saveSession = () => {
    if (count === 0) return;
    setHistory((current) => [
      {
        name: REMEMBRANCES[activeRemembrance].en,
        count,
        savedAt: new Date().toISOString(),
      },
      ...current,
    ].slice(0, 10));
  };

  const reset = () => {
    saveSession();
    setCount(0);
  };

  const nextDhikir = () => {
    saveSession();
    setActiveRemembrance((prev) => (prev + 1) % REMEMBRANCES.length);
    setCount(0);
  };

  const current = REMEMBRANCES[activeRemembrance];
  const progress = Math.min((count / current.target) * 100, 100);

  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      
      <div className="pt-40 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center min-h-[80vh] select-none">
        <div className="w-full">
          <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "Tasbih Counter" }]} />
        </div>
        <div className="text-center mb-20 pointer-events-none">
          <motion.h1 className="text-4xl md:text-6xl font-display text-parchment/40 mb-6">Digital <span className="text-gold italic">Tasbih</span></motion.h1>
          <div className="flex items-center justify-center gap-4 text-gold/30 font-mono text-xs uppercase tracking-widest">
            <span>Session: {count}</span>
            <div className="w-1 h-1 bg-gold/20 rounded-full" />
            <span>Lifetime: {totalCount}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={increment}
          aria-label={`Count ${current.en}`}
          className="flex-1 w-full flex flex-col items-center justify-center gap-12 cursor-pointer rounded-[48px] focus:outline-none focus:ring-2 focus:ring-gold/40"
        >
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
              <p className="text-gold/40 text-[10px] uppercase tracking-[0.3em] font-bold mt-4">
                Target {current.target}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="relative">
            <motion.div 
              key={count}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-[12rem] md:text-[20rem] font-display text-parchment leading-none"
            >
              {count}
            </motion.div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gold/5 blur-[100px] rounded-full -z-10" />
          </div>
          <div className="w-full max-w-sm h-2 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full bg-gold transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </button>

        {/* Controls */}
        <div className="flex items-center gap-8 pb-20 relative z-20" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={saveSession}
            aria-label="Save current tasbih session"
            className="w-16 h-16 glass rounded-full flex items-center justify-center text-parchment/30 hover:text-gold transition-all"
          >
            <Save size={24} />
          </button>
          <button 
            onClick={reset}
            aria-label="Reset tasbih counter"
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

        {history.length > 0 && (
          <div className="w-full max-w-2xl glass p-6 rounded-[32px] border-white/5 mb-10">
            <h3 className="text-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-4">Saved History</h3>
            <div className="space-y-3">
              {history.slice(0, 5).map((item, index) => (
                <div key={`${item.savedAt}-${index}`} className="flex items-center justify-between text-sm">
                  <span className="text-parchment/60">{item.name}</span>
                  <span className="text-gold font-mono">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-parchment/10 text-[10px] uppercase tracking-[0.5em] font-bold pb-10 pointer-events-none">Tap the counter area to count</p>
      </div>

      <ToolGuidance
        title="Count dhikr with focus"
        what="The Tasbih Counter gives you a tap-friendly dhikr counter with session totals, lifetime totals, targets, and saved history."
        how={[
          "Choose a remembrance and tap the main counter area.",
          "Use Save before switching or resetting when you want to keep a session record.",
          "Review recent saved sessions below the controls.",
        ]}
      />
      <RelatedTools currentHref="/tasbih" />
      <Footer />
    </main>
  );
}
