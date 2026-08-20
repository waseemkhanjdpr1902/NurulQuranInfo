"use client";

import { motion } from "motion/react";
import { Search, BookOpen, Sparkles, MessageSquare, Info, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function TafseerPage() {
  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      
      <div className="pt-40 pb-24 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold font-medium tracking-[0.4em] uppercase text-xs mb-6 block"
          >
            Deep Contemplation
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-display text-parchment mb-8 leading-tight"
          >
            Quranic <span className="text-gold italic">Tafseer</span>
          </motion.h1>
          <p className="text-parchment/40 text-lg max-w-2xl mx-auto leading-relaxed font-light">
            Unlock the deeper meanings of the Holy Quran through classical and 
            contemporary scholarly explanations.
          </p>
        </div>

        {/* AI Tafseer Feature */}
        <div className="mb-32">
          <div className="glass p-12 md:p-24 rounded-[60px] border-gold/10 relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-full bg-gold/5 blur-[120px] pointer-events-none" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Sparkles className="text-gold mx-auto mb-8" size={64} />
              <h2 className="text-4xl md:text-6xl font-display text-parchment mb-8">AI-Powered <span className="text-gold">Insights</span></h2>
              <p className="text-parchment/50 mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
                Our advanced AI assistant can provide instant linguistic analysis, 
                historical context, and spiritual reflections for any verse you choose.
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <Link href="/#ai" className="w-full md:w-auto px-12 py-5 gold-gradient text-ink font-bold rounded-full hover:scale-105 transition-transform flex items-center justify-center gap-3">
                  Try AI Tafseer <MessageSquare size={20} />
                </Link>
                <Link href="/quran" className="w-full md:w-auto px-12 py-5 glass text-parchment font-bold rounded-full hover:bg-gold/5 transition-colors flex items-center justify-center gap-3">
                  Browse Classical Tafseer <BookOpen size={20} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Classical Works */}
        <div className="space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-display text-parchment">Classical <span className="text-gold">Works</span></h2>
            <Link href="/quran" className="text-gold text-[10px] font-bold uppercase tracking-widest hover:underline flex items-center gap-2">
              Select Surah to Begin <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                title: "Tafsir Ibn Kathir", 
                author: "Imam Ibn Kathir", 
                period: "14th Century", 
                desc: "The most widely accepted explanation based on Hadith. Available for every verse in our Digital Quran study mode.",
                href: "/quran"
              },
              { title: "Tafsir Al-Jalalayn", author: "Al-Mahalli & Al-Suyuti", period: "15th Century", desc: "A concise and highly influential commentary known for its brevity and clarity.", href: "/quran" },
              { title: "Tafsir Al-Tabari", author: "Imam Al-Tabari", period: "9th Century", desc: "The 'Mother of Tafsirs', providing exhaustive linguistic and historical documentation.", href: "/quran" },
            ].map((work, i) => (
              <Link key={i} href={work.href} className="glass p-8 rounded-[32px] border-white/5 hover:border-gold/20 transition-all group block">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gold mb-6 group-hover:bg-gold group-hover:text-ink transition-colors">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-xl font-display text-parchment mb-2">{work.title}</h3>
                <p className="text-gold/60 text-[10px] uppercase tracking-widest mb-4">{work.author} • {work.period}</p>
                <p className="text-parchment/40 text-sm leading-relaxed mb-8">{work.desc}</p>
                <div className="text-gold text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  Start Study <Info size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
