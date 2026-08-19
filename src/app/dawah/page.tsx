"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, Sparkles, HelpCircle, BookOpen, Compass, 
  MessageCircle, Info, Quote, CheckCircle2, X,
  ArrowRight, Globe, Shield, Heart
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const DAWAH_CONCEPTS = [
  {
    title: "One Creator",
    description: "The core belief in the absolute oneness of God (Tawhid).",
    icon: <Sparkles className="text-gold" />,
    detail: "Islam teaches that there is only one Creator who is all-knowing, all-powerful, and merciful."
  },
  {
    title: "Purpose of Life",
    description: "Understanding why we are here and where we are going.",
    icon: <Compass className="text-gold" />,
    detail: "Life is seen as a test and an opportunity to grow spiritually through worship and good deeds."
  },
  {
    title: "Final Revelation",
    description: "The Quran as the preserved word of God sent to mankind.",
    icon: <BookOpen className="text-gold" />,
    detail: "The Quran is the ultimate guide, confirming previous scriptures and providing a complete way of life."
  },
  {
    title: "Human Equality",
    description: "Islam removes barriers of race, status, and ethnicity.",
    icon: <Globe className="text-gold" />,
    detail: "In the sight of God, the most noble is the one most conscious of Him and best in character."
  }
];

const MYTHS = [
  {
    myth: "Islam was spread by the sword.",
    truth: "The Quran explicitly states: 'There is no compulsion in religion' (2:256). Historically, Islam spread through trade, character, and intellectual appeal."
  },
  {
    myth: "Muslims believe in a different God.",
    truth: "Muslims worship the God of Abraham, Moses, and Jesus. 'Allah' is simply the Arabic word for 'The God'."
  },
  {
    myth: "Women have no rights in Islam.",
    truth: "Islam granted women rights to inheritance, education, and property over 1,400 years ago, long before many modern Western legal systems."
  }
];

export default function DawahPage() {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { 
      role: 'ai', 
      content: "Assalamu Alaikum (Peace be upon you). I am your Dawah Companion. I'm here to answer any questions you have about Islam, its beliefs, or its practices with wisdom and kindness. How can I help you today?" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "dawah", messages: [{ role: "user", content: userMessage }] }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The study assistant is unavailable.");
      const aiContent = data.text || "I apologize, I'm having trouble processing that right now. Please try again.";
      setMessages(prev => [...prev, { role: 'ai', content: aiContent }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'ai', content: error instanceof Error ? error.message : "I encountered an error. Please try again shortly." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-ink">
      <Navbar />

      <header className="pt-40 pb-20 px-6 text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/20 bg-gold/5 mb-8">
            <Globe size={14} className="text-gold" />
            <span className="text-gold text-[10px] uppercase tracking-[0.2em] font-bold">Dawah & Outreach</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display text-parchment mb-8 tracking-tight">
            Invite to the Way of your <span className="text-gold">Lord</span>
          </h1>
          <p className="text-parchment/40 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto italic font-light">
            &quot;Invite to the way of your Lord with wisdom and good instruction, and argue with them in a way that is best.&quot; — An-Nahl 125
          </p>
        </motion.div>
      </header>

      {/* Interactive AI Companion Section */}
      <section className="px-6 mb-32">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-display text-parchment">
                Ask the <span className="text-gold">Companion</span>
              </h2>
              <p className="text-parchment/60 leading-relaxed">
                Whether you&apos;re a student of knowledge, a seeker of truth, or someone curious about Islam, 
                our AI Companion is trained to provide authentic insights into the faith.
              </p>
              
              <div className="space-y-4">
                {DAWAH_CONCEPTS.map((concept, i) => (
                  <motion.div
                    key={concept.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass p-6 rounded-3xl border border-white/5 hover:border-gold/30 transition-all cursor-help group"
                  >
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        {concept.icon}
                      </div>
                      <div>
                        <h3 className="text-parchment font-bold mb-1">{concept.title}</h3>
                        <p className="text-parchment/40 text-sm leading-relaxed">{concept.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="glass rounded-[40px] border border-gold/20 overflow-hidden h-[600px] flex flex-col shadow-2xl shadow-gold/5">
              <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gold animate-pulse" />
                  <span className="text-gold text-xs font-bold uppercase tracking-widest">Dawah AI active</span>
                </div>
                <Sparkles size={18} className="text-gold/40" />
              </div>

              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth"
              >
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] p-4 rounded-3xl ${
                      m.role === 'user' 
                      ? 'bg-gold text-ink font-medium rounded-tr-none' 
                      : 'glass border border-white/10 text-parchment/80 rounded-tl-none'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="glass border border-white/10 p-4 rounded-3xl rounded-tl-none flex gap-2">
                       <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" />
                       <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:0.2s]" />
                       <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-white/5 bg-ink/50 backdrop-blur-md">
                <div className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about Islam, Faith, or Purpose..."
                    className="w-full pl-6 pr-16 py-4 bg-white/5 border border-white/10 rounded-2xl text-parchment placeholder:text-parchment/20 focus:outline-none focus:border-gold/50 transition-all"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={isLoading || !input.trim()}
                    className="absolute right-2 top-2 w-12 h-12 gold-gradient rounded-xl flex items-center justify-center text-ink hover:scale-95 active:scale-90 transition-all disabled:opacity-50"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Myths vs Reality Section */}
      <section className="py-32 px-6 relative bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-display text-parchment mb-6">
              Myth vs <span className="text-gold italic">Reality</span>
            </h2>
            <p className="text-parchment/40 max-w-xl mx-auto">
              Addressing common misconceptions with clarity and evidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MYTHS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass p-8 rounded-[40px] border border-white/5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <HelpCircle size={64} />
                </div>
                <h3 className="text-gold font-bold mb-4 flex items-center gap-2">
                  <X className="text-rose-500" size={16} /> 
                  <span className="line-through opacity-50">Myth</span>
                </h3>
                <p className="text-parchment font-medium mb-8 leading-relaxed italic">&quot;{item.myth}&quot;</p>
                
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="text-emerald-500" size={16} /> Reality
                </h3>
                <p className="text-parchment/60 text-sm leading-relaxed">{item.truth}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-40 px-6 text-center overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-3xl mx-auto relative z-10">
          <Heart size={48} className="text-gold mx-auto mb-8 animate-pulse" />
          <h2 className="text-4xl md:text-6xl font-display text-parchment mb-8">
            Begin Your <span className="italic">Journey</span>
          </h2>
          <p className="text-parchment/60 text-xl leading-relaxed mb-12 font-light">
            Whether you want to read more, find a nearby mosque, or simply talk to a human, 
            we are here to support your spiritual growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="px-10 py-5 gold-gradient text-ink font-bold rounded-2xl hover:scale-105 transition-transform flex items-center justify-center gap-3">
              Request Info Materials <ArrowRight size={20} />
            </button>
            <button className="px-10 py-5 glass border border-gold/20 text-gold font-bold rounded-2xl hover:bg-gold/5 transition-colors">
              Talk to an Imam
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
