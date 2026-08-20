"use client";

import { motion } from "motion/react";
import { ArrowRight, BookOpen, ChevronDown, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-[92svh] flex flex-col items-center justify-center pt-28 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald/5 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 text-center px-5 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-9"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-2 text-gold font-semibold tracking-[0.2em] uppercase text-[10px] sm:text-xs mb-7">
            <Sparkles size={14} aria-hidden="true" /> Read · Reflect · Remember
          </span>
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display text-parchment leading-[0.94] mb-7 tracking-tight">
            Nurul<span className="text-gold">Quran</span>
          </h1>
          <p className="text-parchment/65 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
            A calm, accessible space to read the Holy Quran, explore tafseer,
            remember Allah, and use practical Islamic tools in everyday life.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 max-w-md sm:max-w-none mx-auto"
        >
          <Link
            href="/quran"
            className="min-h-14 px-8 py-4 gold-gradient text-ink font-bold rounded-2xl hover:-translate-y-0.5 transition-transform shadow-xl shadow-gold/20 inline-flex items-center justify-center gap-3"
          >
            <BookOpen size={19} aria-hidden="true" /> Start Reading <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Link
            href="/tafseer"
            className="min-h-14 px-8 py-4 glass text-parchment font-semibold rounded-2xl hover:bg-white/10 transition-colors inline-flex items-center justify-center"
          >
            Explore Tafseer
          </Link>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gold/50"
      >
        <ChevronDown size={32} />
      </motion.div>
    </section>
  );
}
