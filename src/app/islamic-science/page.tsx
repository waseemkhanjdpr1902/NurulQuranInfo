"use client";

import { motion } from "motion/react";
import { Atom, Compass, FlaskConical, Globe, BookOpen, Star, ArrowRight, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function IslamicSciencePage() {
  const contributions = [
    {
      title: "Algebra & Mathematics",
      scientist: "Al-Khwarizmi",
      desc: "Known as the father of Algebra. He introduced the decimal positional number system to the Western world.",
      icon: <Atom className="text-gold" size={32} />
    },
    {
      title: "Modern Medicine",
      scientist: "Ibn Sina (Avicenna)",
      desc: "Author of 'The Canon of Medicine', which remained the standard medical text in Europe and the Islamic world for centuries.",
      icon: <FlaskConical className="text-gold" size={32} />
    },
    {
      title: "Optics & Vision",
      scientist: "Ibn al-Haytham",
      desc: "The father of modern optics. He proved that light travels in straight lines and explained how vision works.",
      icon: <Star className="text-gold" size={32} />
    },
    {
      title: "Navigation & Astronomy",
      scientist: "Al-Battani",
      desc: "Improved the calculation of the solar year and revolutionized trigonometric measurements used in navigation.",
      icon: <Compass className="text-gold" size={32} />
    }
  ];

  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      
      <header className="pt-40 pb-24 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="max-w-4xl mx-auto relative z-10"
        >
          <span className="text-gold font-medium tracking-[0.4em] uppercase text-xs mb-6 block">Legacy of Wisdom</span>
          <h1 className="text-5xl md:text-8xl font-display text-parchment mb-8 leading-tight">
            Islamic <span className="text-gold italic">Science</span>
          </h1>
          <p className="text-parchment/40 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
            Exploring the profound contributions of Islamic scholars to modern science, 
            mathematics, and philosophy during the Golden Age.
          </p>
        </motion.div>
      </header>

      <section className="px-6 pb-40">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contributions.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass p-10 md:p-16 rounded-[60px] border-white/5 hover:border-gold/20 transition-all group flex flex-col md:flex-row gap-12 items-start"
              >
                <div className="w-20 h-20 rounded-3xl bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold group-hover:text-ink transition-all">
                  {item.icon}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-gold text-[10px] font-bold uppercase tracking-widest">{item.scientist}</span>
                    <div className="h-px flex-1 bg-gold/20" />
                  </div>
                  <h3 className="text-3xl font-display text-parchment mb-4">{item.title}</h3>
                  <p className="text-parchment/60 leading-relaxed text-lg font-light mb-8">{item.desc}</p>
                  <span className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-widest">
                    Historical contribution <ArrowRight size={14} />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-32 glass p-12 md:p-24 rounded-[60px] border-gold/20 bg-gold/5 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold/10 blur-[100px] rounded-full" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-8">
                   <Sparkles className="text-gold" size={24} />
                   <span className="text-gold font-bold uppercase tracking-widest text-xs">AI Research Companion</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-display text-parchment mb-8 leading-tight">
                  Bridging Revelation <br/><span className="text-gold italic">& Discovery</span>
                </h2>
                <p className="text-parchment/60 text-lg leading-relaxed mb-12 font-light">
                  Use our AI study tools in the Digital Quran to explore how scientific 
                  concepts mentioned in the revelation align with modern discoveries. 
                  Ancient wisdom meets today&apos;s technology.
                </p>
                <Link href="/quran" className="px-10 py-5 gold-gradient text-ink font-bold rounded-2xl inline-flex items-center gap-3 hover:scale-105 transition-transform shadow-xl shadow-gold/20">
                  Try AI Study Mode <ArrowRight size={20} />
                </Link>
              </div>
              <div className="relative">
                <div className="aspect-square glass rounded-[60px] border-white/5 flex items-center justify-center p-12">
                   <div className="w-full h-full rounded-full border border-gold/20 animate-[spin_20s_linear_infinite] flex items-center justify-center relative">
                      <div className="absolute w-4 h-4 bg-gold rounded-full -top-2 left-1/2 -translate-x-1/2" />
                      <div className="w-4/5 h-4/5 rounded-full border border-gold/10 animate-[spin_15s_linear_infinite_reverse] flex items-center justify-center">
                         <div className="absolute w-3 h-3 bg-gold/40 rounded-full top-1/2 -left-1.5 -translate-y-1/2" />
                         <Atom size={64} className="text-gold animate-pulse" />
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
