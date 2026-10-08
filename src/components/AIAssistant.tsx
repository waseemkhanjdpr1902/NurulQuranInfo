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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: "quran",
          messages: newMessages.filter((message, index) => index > 0).slice(-8),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "AI guide unavailable");
      const text = data.text;
      
      if (text) {
        setMessages((prev) => [...prev, { role: "model", content: text }]);
      } else {
        throw new Error("Empty response from AI");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "The AI guide could not connect. Please try again.";
      setMessages((prev) => [...prev, { role: "model", content: message }]);
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
        className="fixed bottom-6 right-4 sm:right-8 h-14 px-5 rounded-full bg-[#d4af37] text-[#101b18] flex items-center gap-2 shadow-2xl hover:scale-105 transition-transform z-[120]"
      >
        <Sparkles className="text-[#101b18]" size={24} /><span className="font-bold text-sm">AI Guide</span>
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            role="dialog"
            aria-label="AI Quranic Guide"
            className="fixed bottom-24 right-4 sm:right-8 w-[calc(100vw-32px)] md:w-[400px] h-[min(600px,calc(100dvh-120px))] bg-[#101b18] border border-[#d4af37] text-[#faf7ef] rounded-3xl overflow-hidden flex flex-col z-[130] shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#20312a]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#d4af37] flex items-center justify-center">
                  <Bot size={20} className="text-[#101b18]" />
                </div>
                <div>
                  <h3 className="text-[#faf7ef] font-sans text-lg font-bold">AI Quranic Guide</h3>
                  <p className="text-xs text-[#e8cf78] uppercase tracking-widest">Powered by Gemini</p>
                </div>
              </div>
              <button aria-label="Close AI Quranic Guide" onClick={() => setIsOpen(false)} className="text-[#d6e4dd] hover:text-white">
                <X size={24} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-white/10" : "bg-[#d4af37]"}`}>
                      {msg.role === "user" ? <User size={14} /> : <Bot size={14} className="text-[#101b18]" />}
                    </div>
                    <div dir="auto" style={{ fontFamily: "var(--font-sans), var(--font-arabic), system-ui, sans-serif" }} className={`p-4 rounded-2xl text-base leading-7 whitespace-pre-wrap break-words ${msg.role === "user" ? "bg-[#3b3420] text-[#faf7ef] rounded-tr-none" : "bg-[#20312a] text-[#faf7ef] rounded-tl-none"}`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#d4af37] flex items-center justify-center">
                      <Loader2 size={14} className="text-[#101b18] animate-spin" />
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl rounded-tl-none">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-bounce delay-100" />
                        <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-bounce delay-200" />
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
                  aria-label="Ask the AI Quranic Guide"
                  placeholder="Ask about a verse or concept..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-[#faf7ef] focus:outline-none focus:border-gold/50 transition-colors"
                />
                <button
                  aria-label="Send question"
                  onClick={handleSend}
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-[#d4af37] flex items-center justify-center text-[#101b18] hover:scale-105 transition-transform disabled:opacity-50"
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
