"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Send, User, Bot, X, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "model";
  content: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", content: "Assalamu Alaikum! I am your AI Quranic Guide. Ask me anything about the Quran, Tafsir, or Islamic concepts." },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#ai") {
        setIsOpen(true);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    if (window.location.hash === "#ai") setIsOpen(true);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "quran-assistant",
          prompt: newMessages
            .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
            .join("\n"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "AI request failed");
      }

      setMessages((prev) => [...prev, { role: "model", content: data?.text || "Insight unavailable." }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [...prev, { role: "model", content: "I apologize, but I encountered an error. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        id="ai"
        aria-label="Open AI Quranic Guide"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full gold-gradient flex items-center justify-center shadow-2xl shadow-gold/30 hover:scale-110 transition-transform z-40"
      >
        <Sparkles className="text-ink" size={28} />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-28 right-8 w-[90vw] md:w-[400px] h-[600px] glass rounded-[32px] overflow-hidden flex flex-col z-50 shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center">
                  <Bot size={20} className="text-ink" />
                </div>
                <div>
                  <h3 className="text-parchment font-display font-bold">AI Quranic Guide</h3>
                  <p className="text-[10px] text-gold uppercase tracking-widest">Powered by Gemini</p>
                </div>
              </div>
              <button aria-label="Close AI Quranic Guide" onClick={() => setIsOpen(false)} className="text-parchment/50 hover:text-parchment">
                <X size={24} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-white/10" : "gold-gradient"}`}>
                      {msg.role === "user" ? <User size={14} /> : <Bot size={14} className="text-ink" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-gold/20 text-parchment rounded-tr-none" : "bg-white/5 text-parchment/90 rounded-tl-none"}`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center">
                      <Loader2 size={14} className="text-ink animate-spin" />
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl rounded-tl-none">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce delay-100" />
                        <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-white/10">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask about a verse or concept..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-parchment focus:outline-none focus:border-gold/50 transition-colors"
                />
                <button
                  aria-label="Send AI question"
                  onClick={handleSend}
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl gold-gradient flex items-center justify-center text-ink hover:scale-105 transition-transform disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
