"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Book, Bookmark, Share2, Sparkles, Loader2, ChevronRight, X } from "lucide-react";
import Link from "next/link";

interface HadithCardProps {
  hadith: {
    collection: string;
    number: string;
    text: string;
    narrator?: string;
  };
  onSave?: () => void;
}

export default function HadithCard({ hadith, onSave }: HadithCardProps) {
  const [showAiContext, setShowAiContext] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const hadithText = `"${hadith.text}"\n\n${hadith.collection} #${hadith.number}`;

  const fetchAiContext = async () => {
    if (aiInsight) {
      setShowAiContext(true);
      return;
    }
    
    setLoadingAi(true);
    setShowAiContext(true);
    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "hadith-context",
          prompt: `Hadith: "${hadith.text}". Source: ${hadith.collection} ${hadith.number}. Provide related Quran themes, meanings, and study insights.`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "AI context request failed");
      }

      setAiInsight(data?.text || "Insight unavailable.");
    } catch (error) {
      console.error("AI Context Error:", error);
      setAiInsight("Unable to load spiritual context at this time. Please check your connectivity.");
    } finally {
      setLoadingAi(false);
    }
  };

  const saveHadith = () => {
    setSaved((current) => !current);
    onSave?.();
  };

  const shareHadith = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${hadith.collection} #${hadith.number}`,
        text: hadithText,
        url: window.location.href,
      });
      return;
    }

    await navigator.clipboard.writeText(hadithText);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass p-8 md:p-10 rounded-[40px] border-white/5 hover:border-gold/20 transition-all group bg-gradient-to-br from-white/[0.02] to-transparent h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold shadow-lg shadow-gold/5 group-hover:scale-110 transition-transform">
            <Book size={24} />
          </div>
          <div>
            <h4 className="text-parchment font-bold text-sm uppercase tracking-widest">{hadith.collection}</h4>
            <p className="text-gold/60 text-[10px] uppercase tracking-[0.2em] font-bold">Hadith #{hadith.number}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            aria-label={saved ? "Remove saved hadith" : "Save hadith"}
            onClick={saveHadith}
            className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold/10 transition-all ${saved ? "text-gold" : "text-parchment/30 hover:text-gold"}`}
          >
            <Bookmark size={18} className={saved ? "fill-gold" : ""} />
          </button>
          <button
            aria-label="Share hadith"
            onClick={shareHadith}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-parchment/30 hover:text-gold hover:bg-gold/10 transition-all"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-6 flex-grow">
        {hadith.narrator && (
          <p className="text-gold/80 font-medium text-sm italic border-l-2 border-gold/20 pl-4">
            Narrated by {hadith.narrator}:
          </p>
        )}
        <p className="text-parchment/70 leading-relaxed text-lg font-light selection:bg-gold/30">
          &quot;{hadith.text}&quot;
        </p>
      </div>

      <div className="mt-10 pt-8 border-t border-white/5 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.3em] text-parchment/20 font-bold">Authentic Tradition</span>
          <button 
            onClick={fetchAiContext}
            aria-label="Study hadith with Quran"
            className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${showAiContext ? 'bg-gold text-ink' : 'glass text-gold/60 hover:text-gold'}`}
          >
            {loadingAi ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} 
            Study with Quran
          </button>
        </div>

        <AnimatePresence>
          {showAiContext && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: 10 }}
              className="overflow-hidden"
            >
              <div className="p-8 rounded-[32px] bg-gold/5 border border-gold/10 mt-2 relative">
                <button 
                  aria-label="Close hadith study context"
                  onClick={() => setShowAiContext(false)}
                  className="absolute top-4 right-4 text-parchment/20 hover:text-gold transition-colors"
                >
                  <X size={16} />
                </button>
                
                {loadingAi ? (
                  <div className="flex flex-col items-center justify-center py-8 gap-4">
                    <Loader2 size={24} className="text-gold animate-spin" />
                    <p className="text-parchment/30 text-[10px] uppercase tracking-[0.3em] font-bold animate-pulse">Mapping Quranic Connections...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-gold">
                       <Sparkles size={16} />
                       <span className="text-[10px] uppercase tracking-widest font-bold">Spiritual Context</span>
                    </div>
                    <div className="prose prose-invert prose-gold max-w-none text-sm text-parchment/60 leading-relaxed whitespace-pre-wrap font-light italic">
                      {aiInsight}
                    </div>
                    <div className="pt-6 border-t border-white/5">
                      <Link href="/quran" className="flex items-center gap-2 text-gold text-[10px] font-bold uppercase tracking-widest hover:underline group/link">
                        Open Digital Quran to Ponder <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
