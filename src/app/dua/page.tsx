"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Search, BookOpen, Sun, Moon, Sunrise, Sunset, CloudSun, Loader2, Copy, Share2, Volume2, VolumeX } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const DUAS = [
  {
    id: 1,
    category: "morning",
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
    translation: "O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the Final Return.",
    reference: "Abu Dawud 4/317",
  },
  {
    id: 2,
    category: "evening",
    arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
    translation: "O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and to You is the Final Return.",
    reference: "Abu Dawud 4/317",
  }
];

export default function DuaPage() {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [notice, setNotice] = useState("");
  const [favourites, setFavourites] = useState<number[]>([]);
  useEffect(() => {
    try { const saved = JSON.parse(localStorage.getItem("nurulquran.dua-favourites.v1") || "[]"); if (Array.isArray(saved)) setFavourites(saved.filter(id => DUAS.some(dua => dua.id === id))); } catch {}
    return () => { audioRef.current?.pause(); };
  }, []);
  const textFor = (dua: typeof DUAS[number]) => `${dua.arabic}\n${dua.translation}\n${dua.reference}`;
  const copyDua = async (dua: typeof DUAS[number]) => {
    try { await navigator.clipboard.writeText(textFor(dua)); setNotice("Dua copied."); }
    catch { setNotice("Copy is unavailable. Select the dua text to copy it."); }
  };
  const shareDua = async (dua: typeof DUAS[number]) => {
    try {
      if (navigator.share) await navigator.share({title: "Dua — NurulQuran", text: textFor(dua)});
      else await copyDua(dua);
    } catch (error) { if (!(error instanceof DOMException && error.name === "AbortError")) setNotice("Sharing is unavailable. Use Copy dua instead."); }
  };
  const toggleFavourite = (id: number) => {
    const next = favourites.includes(id) ? favourites.filter(value => value !== id) : [...favourites, id];
    setFavourites(next);
    try { localStorage.setItem("nurulquran.dua-favourites.v1", JSON.stringify(next)); setNotice("Favourites saved on this device."); }
    catch { setNotice("Favourite updated for this visit. Device storage is unavailable."); }
  };
  const toggleAudio = async (dua: typeof DUAS[number]) => {
    audioRef.current?.pause();
    if (playingId === dua.id) { setPlayingId(null); return; }
    const audio = new Audio(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(dua.arabic)}&tl=ar&client=tw-ob`);
    audioRef.current = audio;
    const failed = () => { if (audioRef.current === audio) { setPlayingId(null); setNotice("Audio is unavailable. You can still read and copy this dua."); } };
    audio.onended = () => { if (audioRef.current === audio) setPlayingId(null); };
    audio.onerror = failed;
    setPlayingId(dua.id);
    try { await audio.play(); } catch { failed(); }
  };

  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      
      <div className="pt-40 pb-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display text-parchment mb-6 tracking-tight"
          >
            Dua & <span className="text-gold italic">Adhkar</span>
          </motion.h1>
          <p className="text-parchment/40 text-lg max-w-2xl mx-auto leading-relaxed font-light">
            A curated collection of authentic supplications from the Quran and Sunnah. Audio uses computer-generated Arabic speech when available.
          </p>
        </div>

        <p role="status" className="mb-6 text-center text-parchment">{notice}</p>
        <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
          {DUAS.map((dua) => (
            <motion.div
              key={dua.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 md:p-12 rounded-[40px] border-white/5 hover:border-gold/20 transition-all group"
            >
              <div className="text-right mb-8">
                <p className="text-3xl md:text-5xl font-arabic text-parchment leading-relaxed">
                  {dua.arabic}
                </p>
              </div>
              
              <div className="space-y-4 mb-10">
                <p className="text-parchment/80 text-lg leading-relaxed">{dua.translation}</p>
                <div className="flex items-center gap-2 text-gold/40 text-xs font-bold uppercase tracking-[0.2em]">
                  <BookOpen size={14} /> {dua.reference}
                </div>
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <button 
                    aria-label={playingId === dua.id ? "Stop dua audio" : "Listen to dua"}
                    onClick={() => toggleAudio(dua)}
                    className={`p-4 rounded-2xl transition-all ${
                      playingId === dua.id 
                      ? "bg-gold text-ink scale-110 shadow-lg shadow-gold/20" 
                      : "glass text-parchment/30 hover:text-gold"
                    }`}
                  >
                    {playingId === dua.id ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <button aria-label="Copy dua" onClick={() => copyDua(dua)} className="p-4 glass rounded-2xl text-parchment/30 hover:text-gold transition-colors">
                    <Copy size={20} />
                  </button>
                  <button aria-label="Share dua" onClick={() => shareDua(dua)} className="p-4 glass rounded-2xl text-parchment/30 hover:text-gold transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>
                <button aria-label="Favourite dua" aria-pressed={favourites.includes(dua.id)} onClick={() => toggleFavourite(dua.id)} className={favourites.includes(dua.id) ? "text-rose-600" : "text-parchment/60 hover:text-rose-500 transition-colors"}>
                  <Heart size={24} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
