"use client";

import { motion } from "motion/react";
import { 
  Sparkles, BookOpen, Clock, Heart, 
  Shield, Globe, Zap, ArrowRight, 
  CheckCircle2, HelpCircle, Landmark,
  Compass, Atom, MessageSquare
} from "lucide-react";
import Link from "next/link";
import BuyMeCoffeeCard from "@/components/BuyMeCoffeeCard";
import { tools as allTools } from "@/lib/tools";
import { ToolIcon } from "@/components/tooling";

export default function HomeSections() {
  const features = [
    {
      title: "AI Spiritual Study",
      desc: "Connect verses with authentic Hadith and spiritual insights using state-of-the-art AI.",
      icon: <Sparkles className="text-gold" />
    },
    {
      title: "Multi-Reciter Audio",
      desc: "Listen to the Quran in beautiful voices from 16 world-renowned reciters.",
      icon: <Zap className="text-gold" />
    },
    {
      title: "Authentic Library",
      desc: "Browse selected hadiths from Sahih Bukhari, Sahih Muslim, and other major collections.",
      icon: <Shield className="text-gold" />
    }
  ];

  const priorityToolNames = [
    "Zakat Calculator",
    "Halal Stock Finder",
    "Tasbih Counter",
    "Asmaul Husna",
    "Duas",
    "Prayer Times",
    "Islamic Finance",
    "Qibla Finder",
  ];
  const tools = priorityToolNames
    .map((name) => allTools.find((tool) => tool.name === name))
    .filter(Boolean) as typeof allTools;

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
      a: "Core pages are lightweight, but Quran audio, prayer times, hadith data, and AI study currently require an active internet connection."
    }
  ];

  return (
    <div className="space-y-40 pb-40">
      
      {/* Features Section */}
      <section id="features" className="px-6 scroll-mt-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-6 block"
            >
              Why NurulQuran?
            </motion.span>
            <h2 className="text-4xl md:text-7xl font-display text-parchment leading-tight">
              Crafting a <span className="text-gold italic">Brighter</span> Faith
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
                className="glass p-12 rounded-[40px] border-white/5 hover:border-gold/20 transition-all group"
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

      {/* Explore Islamic Tools Section */}
      <section id="tools" className="px-6 scroll-mt-32 relative py-40 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-24">
            <div className="max-w-2xl">
              <span className="text-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-6 block">Explore Islamic Tools</span>
              <h2 className="text-4xl md:text-6xl font-display text-parchment leading-tight">
                Useful tools for <br/> <span className="text-gold italic">daily worship</span>
              </h2>
            </div>
            <Link href="/tools" className="px-8 py-4 glass text-gold font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-gold/10 transition-all flex items-center gap-3">
              View All Tools <ArrowRight size={18} />
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
                  className="glass flex flex-col items-center justify-center p-12 rounded-[40px] border-white/5 hover:border-gold/30 hover:bg-white/5 transition-all aspect-square group text-center"
                >
                  <div className="text-gold/60 mb-6 group-hover:scale-110 group-hover:text-gold transition-all duration-500">
                    <ToolIcon name={t.icon} size={24} />
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

      {/* Buy Me a Coffee Support Section */}
      <section className="px-6 relative py-20">
        <div className="max-w-5xl mx-auto">
          <BuyMeCoffeeCard />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 pb-40">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-24">
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
                className="glass p-8 md:p-12 rounded-[40px] border-white/5"
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
