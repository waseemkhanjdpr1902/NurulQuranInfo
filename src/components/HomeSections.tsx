"use client";

import { motion } from "motion/react";
import { 
  Sparkles, BookOpen, Clock, Heart, 
  Shield, Globe, Zap, ArrowRight, 
  CheckCircle2, HelpCircle, Landmark,
  Compass, Atom, MessageSquare
} from "lucide-react";
import Link from "next/link";

export default function HomeSections() {
  const features = [
    {
      title: "AI Spiritual Study",
      desc: "Explore verses alongside guided study insights, with clear reminders to verify religious rulings with qualified scholars.",
      icon: <Sparkles className="text-gold" />
    },
    {
      title: "Quran Listening",
      desc: "Listen while you read and keep Arabic text and translation together in one focused experience.",
      icon: <Zap className="text-gold" />
    },
    {
      title: "Islamic Library",
      desc: "Browse Quran study, hadith, duas and spiritual learning resources from a single, simple interface.",
      icon: <Shield className="text-gold" />
    }
  ];

  const tools = [
    { name: "Prayer Times", href: "/prayer-times", icon: <Clock size={24} /> },
    { name: "Zakat Calc", href: "/zakat", icon: <Landmark size={24} /> },
    { name: "Dua Library", href: "/dua", icon: <Heart size={24} /> },
    { name: "Qibla Finder", href: "/prayer-times", icon: <Compass size={24} /> },
    { name: "Islamic Science", href: "/islamic-science", icon: <Atom size={24} /> },
    { name: "Names of Allah", href: "/names-of-allah", icon: <BookOpen size={24} /> },
    { name: "Qur’an Reflection", href: "/quran-reflection", icon: <Sparkles size={24} /> },
    { name: "AI Dawah", href: "/dawah", icon: <MessageSquare size={24} /> },
    { name: "Tasbih Counter", href: "/tasbih", icon: <Zap size={24} /> },
  ];

  const faqs = [
    { 
      q: "How accurate are the AI insights?", 
      a: "Our AI is strictly instructed to ground its answers in traditional Tafsir (like Ibn Kathir) and Sahih Hadith. However, it should be used as a study companion, with final rulings sought from qualified scholars." 
    },
    { 
      q: "Is NurulQuran free to use?", 
      a: "Yes, all core spiritual tools, the Quran reader, and basic AI features are completely free. We are supported by members who believe in our mission." 
    },
    { 
      q: "Can I use it offline?", 
      a: "The Quran text is cached for basic offline reading, but audio recitation and AI features require an active internet connection." 
    }
  ];

  return (
    <div className="space-y-24 md:space-y-36 pb-24 md:pb-36">
      
      {/* Features Section */}
      <section id="features" className="px-6 scroll-mt-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 md:mb-20">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-6 block"
            >
              Why NurulQuran?
            </motion.span>
            <h2 className="text-4xl md:text-6xl font-display text-parchment leading-tight">
              Designed for <span className="text-gold italic">meaningful</span> study
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass p-7 md:p-10 rounded-3xl border-white/5 hover:border-gold/25 hover:-translate-y-1 transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-display text-parchment mb-4">{f.title}</h3>
                <p className="text-parchment/40 leading-relaxed font-light">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid Section */}
      <section id="tools" className="px-5 sm:px-6 scroll-mt-32 relative py-20 md:py-28 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14 md:mb-20">
            <div className="max-w-2xl">
              <span className="text-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-6 block">Unified Experience</span>
              <h2 className="text-4xl md:text-6xl font-display text-parchment leading-tight">
                Every Tool for <br/> <span className="text-gold italic">Your Journey</span>
              </h2>
            </div>
            <Link href="/quran" className="px-8 py-4 glass text-gold font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-gold/10 transition-all flex items-center gap-3">
              Explore All <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <Link 
                  href={t.href}
                  className="glass flex flex-col items-center justify-center p-5 sm:p-8 rounded-3xl border-white/5 hover:border-gold/30 hover:bg-white/5 transition-all min-h-40 sm:aspect-square group text-center"
                >
                  <div className="text-gold/60 mb-6 group-hover:scale-110 group-hover:text-gold transition-all duration-500">
                    {t.icon}
                  </div>
                  <span className="text-parchment text-xs font-bold uppercase tracking-widest leading-relaxed">
                    {t.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-6 relative py-20">
        <div className="max-w-4xl mx-auto glass p-8 sm:p-12 md:p-20 rounded-[36px] md:rounded-[52px] border-gold/20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gold/5 pointer-events-none" />
          <div className="relative z-10">
            <span className="text-gold text-[10px] uppercase tracking-[0.35em] font-bold mb-5 block">Our mission</span>
            <h2 className="text-4xl md:text-6xl font-display text-parchment mb-8">Knowledge made <span className="italic text-gold">accessible</span></h2>
            <p className="text-parchment/60 text-lg leading-relaxed mb-12 max-w-2xl mx-auto font-light">
              NurulQuran is dedicated to serving the Ummah. Access to 
              sacred texts and essential tools will always remain free.
            </p>
            <Link href="/quran" className="px-9 py-4 gold-gradient text-ink font-bold rounded-2xl inline-flex items-center justify-center gap-3 hover:-translate-y-0.5 transition-transform">
              Open the Quran <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 pb-20 md:pb-32">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14 md:mb-20">
             <HelpCircle size={48} className="text-gold mx-auto mb-8" />
             <h2 className="text-4xl md:text-5xl font-display text-parchment">Common Questions</h2>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass p-6 md:p-9 rounded-3xl border-white/5"
              >
                <div className="flex items-start gap-6">
                  <span className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-ink shrink-0 font-bold">
                    Q
                  </span>
                  <div>
                    <h4 className="text-xl font-display text-parchment mb-4">{faq.q}</h4>
                    <p className="text-parchment/40 leading-relaxed font-light">{faq.a}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
