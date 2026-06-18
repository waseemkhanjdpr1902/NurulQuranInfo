"use client";

import { motion } from "motion/react";
import { Copy, Heart, Search, Share2, Volume2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ALLAH_NAMES, type AllahName } from "@/lib/names-of-allah";

const STORAGE_KEY = "nurulquran.favoriteAllahNames";

export default function NamesOfAllahPage() {
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const filteredNames = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return ALLAH_NAMES;

    return ALLAH_NAMES.filter((name) =>
      [name.arabic, name.transliteration, name.meaning]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [search]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 1800);
  };

  const toggleFavorite = (id: number) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const getNameText = (name: AllahName) =>
    `${name.arabic}\n${name.transliteration}\n${name.meaning}\n\nReflect on Allah as ${name.meaning.toLowerCase()} and call upon Him with humility.`;

  const copyName = async (name: AllahName) => {
    await navigator.clipboard.writeText(getNameText(name));
    showToast(`${name.transliteration} copied`);
  };

  const shareName = async (name: AllahName) => {
    const text = getNameText(name);

    if (navigator.share) {
      await navigator.share({
        title: `${name.transliteration} - Names of Allah`,
        text,
        url: window.location.href,
      });
      return;
    }

    await navigator.clipboard.writeText(text);
    showToast("Share text copied");
  };

  const playPronunciation = (name: AllahName) => {
    const audio = new Audio(
      `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(name.arabic)}&tl=ar&client=tw-ob`
    );
    audio.play().catch(() => showToast("Audio could not be played"));
  };

  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      
      <div className="pt-40 pb-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold font-medium tracking-[0.4em] uppercase text-xs mb-6 block"
          >
            Divine Attributes
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-display text-parchment mb-8 leading-tight"
          >
            99 Names of <br/><span className="text-gold italic">Allah</span>
          </motion.h1>
          <p className="text-parchment/40 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            &quot;To Allah belong the best names, so invoke Him by them.&quot; — Al-A&apos;raf 180
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-20">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-parchment/20" size={20} />
            <input 
              type="text" 
              aria-label="Search Names of Allah"
              placeholder="Search Arabic, transliteration, or meaning..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-16 pr-8 py-5 glass rounded-[32px] text-parchment placeholder:text-parchment/20 focus:outline-none focus:border-gold/50 transition-colors shadow-2xl"
            />
          </div>
          <p className="text-center text-parchment/30 text-xs mt-4">
            Showing {filteredNames.length} of {ALLAH_NAMES.length} names
          </p>
        </div>

        {filteredNames.length === 0 ? (
          <div className="glass p-12 rounded-[40px] text-center border-white/5">
            <p className="text-parchment/40">No names match your search.</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNames.map((name, i) => (
            <motion.div
              key={name.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(i * 0.01, 0.2) }}
              viewport={{ once: true }}
              className="glass p-8 rounded-[40px] border-white/5 hover:border-gold/30 hover:bg-white/5 transition-all group flex flex-col"
            >
              <div className="flex items-start justify-between gap-4 mb-8">
                <span className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-bold">
                  {name.id}
                </span>
                <button
                  aria-label={favorites.includes(name.id) ? "Remove favorite" : "Add favorite"}
                  onClick={() => toggleFavorite(name.id)}
                  className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center transition-colors ${favorites.includes(name.id) ? "text-rose-400" : "text-parchment/30 hover:text-rose-400"}`}
                >
                  <Heart size={18} className={favorites.includes(name.id) ? "fill-rose-400" : ""} />
                </button>
              </div>
              <div className="text-center flex-1">
                <div className="text-4xl md:text-5xl font-arabic text-gold mb-6 group-hover:scale-105 transition-transform duration-500">
                  {name.arabic}
                </div>
                <h3 className="text-parchment font-bold mb-2 tracking-tight">{name.transliteration}</h3>
                <p className="text-gold/70 text-[10px] uppercase font-bold tracking-[0.2em] mb-5">{name.meaning}</p>
                <p className="text-parchment/45 text-sm leading-relaxed">
                  Reflect on Allah as {name.meaning.toLowerCase()} and call upon Him through this beautiful name with hope and humility.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-3">
                <button aria-label={`Play pronunciation for ${name.transliteration}`} onClick={() => playPronunciation(name)} className="p-3 glass rounded-2xl text-parchment/40 hover:text-gold transition-colors">
                  <Volume2 size={18} />
                </button>
                <button aria-label={`Copy ${name.transliteration}`} onClick={() => copyName(name)} className="p-3 glass rounded-2xl text-parchment/40 hover:text-gold transition-colors">
                  <Copy size={18} />
                </button>
                <button aria-label={`Share ${name.transliteration}`} onClick={() => shareName(name)} className="p-3 glass rounded-2xl text-parchment/40 hover:text-gold transition-colors">
                  <Share2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-5 py-3 rounded-full bg-gold text-ink text-xs font-bold shadow-2xl z-50">
          {toast}
        </div>
      )}

      <Footer />
    </main>
  );
}
