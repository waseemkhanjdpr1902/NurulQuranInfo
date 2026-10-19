"use client";

import { useUILanguage } from "@/components/UILanguageProvider";
import { fetchWithTimeout } from "@/lib/fetch-with-timeout";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Send, User, Bot, X, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "model";
  content: string;
  references?: string[];
  links?: { label: string; href: string }[];
}

export default function AIAssistant() {
  const { t, language } = useUILanguage();
  const [error, setError] = useState<"busy" | "unavailable" | null>(null);
  const [retryMessages, setRetryMessages] = useState<Message[] | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const busyRef = useRef(false);
  useEffect(() => () => requestRef.current?.abort(), []);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
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

  const requestAnswer = async (conversation: Message[]) => {
    if (busyRef.current) return;
    busyRef.current = true;
    const controller = new AbortController();
    requestRef.current = controller;
    setError(null);
    setIsLoading(true);
    setRetryMessages(null);
    try {
      const response = await fetchWithTimeout(
        "/api/ai-chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            intent: "quran",
            language,
            messages: conversation.slice(-8),
          }),
          signal: controller.signal,
        },
        35000,
      );
      if (!response.ok) {
        setError(response.status === 429 ? "busy" : "unavailable");
        setRetryMessages(conversation);
        return;
      }
      const data = await response.json();
      if (typeof data.text !== "string" || !data.text.trim())
        throw new Error("Empty response");
      if (!controller.signal.aborted)
        setMessages([
          ...conversation,
          {
            role: "model",
            content: data.text,
            links: Array.isArray(data.links) ? data.links.filter((link: {href?: unknown; label?: unknown}) => typeof link.href === "string" && /^\/(?!\/)/.test(link.href) && typeof link.label === "string") : [],
            references: Array.isArray(data.references)
              ? data.references.filter(
                  (ref: unknown) =>
                    typeof ref === "string" && /^\d{1,3}:\d{1,3}$/.test(ref),
                )
              : [],
          },
        ]);
    } catch {
      if (!controller.signal.aborted) {
        setError("unavailable");
        setRetryMessages(conversation);
      }
    } finally {
      busyRef.current = false;
      if (!controller.signal.aborted) setIsLoading(false);
    }
  };
  const handleSend = () => {
    if (!input.trim() || busyRef.current) return;
    const conversation: Message[] = [
      ...messages,
      { role: "user", content: input.trim() },
    ];
    setInput("");
    setMessages(conversation);
    void requestAnswer(conversation);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        id="ai"
        aria-label="Open website guide"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-4 sm:right-8 h-14 px-5 rounded-full bg-[#d4af37] text-[#101b18] flex items-center gap-2 shadow-2xl hover:scale-105 transition-transform z-[120]"
      >
        <Sparkles className="text-[#101b18]" size={24} />
        <span className="font-bold text-sm">
          {t("Website guide", "वेबसाइट रहनुमा", "ویب سائٹ رہنما")}
        </span>
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            role="dialog"
            aria-label="Website guide"
            className="fixed bottom-24 right-4 sm:right-8 w-[calc(100vw-32px)] md:w-[400px] h-[min(600px,calc(100dvh-120px))] bg-[#101b18] border border-[#d4af37] text-[#faf7ef] rounded-3xl overflow-hidden flex flex-col z-[130] shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#20312a]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#d4af37] flex items-center justify-center">
                  <Bot size={20} className="text-[#101b18]" />
                </div>
                <div>
                  <h3 className="text-[#faf7ef] font-sans text-lg font-bold">
                    {t("NurulQuran guide", "नूरुलकुरआन रहनुमा", "نورالقرآن رہنما")}
                  </h3>
                  <p className="text-xs text-[#e8cf78] uppercase tracking-widest">
                    {t(
                      "Navigation & existing sources only",
                      "रहनुमाई और मौजूदा मआख़िज़",
                      "رہنمائی اور موجودہ ماخذ",
                    )}
                  </p>
                </div>
              </div>
              <button
                aria-label="Close website guide"
                onClick={() => setIsOpen(false)}
                className="text-[#d6e4dd] hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6"
            >
              <p
                dir="auto"
                className="rounded-2xl bg-[#20312a] p-4 text-sm leading-relaxed"
              >
                {t(
                  "Assalamu Alaikum! Find a surah, website feature or existing topic summary with references. Try “Surah 36”, “patience” or “Mushaf”. No generated religious advice.",
                  "अस्सलामु अलैकुम! सूरह, वेबसाइट का फ़ीचर या हवालों के साथ मौजूदा मौज़ू ढूँढें। “Surah 36”, “सब्र” या “मुशहफ़” लिखें। नई दीनी सलाह नहीं दी जाती।",
                  "السلام علیکم! سورت، ویب سائٹ کی سہولت یا حوالوں کے ساتھ موجودہ موضوع تلاش کریں۔ “Surah 36”، “صبر” یا “مصحف” لکھیں۔ نئی دینی نصیحت نہیں دی جاتی۔",
                )}
              </p>
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-amber-200 p-4 text-sm text-amber-100"
                >
                  <p>
                    {error === "busy"
                      ? t(
                          "The service is busy. Wait a moment and retry.",
                          "सेवा व्यस्त है। थोड़ी देर बाद फिर कोशिश करें।",
                          "سروس مصروف ہے۔ کچھ دیر بعد دوبارہ کوشش کریں۔",
                        )
                      : t(
                          "The guide could not connect. You can keep reading the Qur’an and tafsir, or retry your search.",
                          "AI सहायक से संपर्क नहीं हुआ। आप क़ुरआन और तफ़सीर पढ़ सकते हैं या सवाल के लिए फिर कोशिश कर सकते हैं।",
                          "AI معاون سے رابطہ نہیں ہوا۔ آپ قرآن اور تفسیر پڑھ سکتے ہیں یا سوال کے لیے دوبارہ کوشش کر سکتے ہیں۔",
                        )}
                  </p>
                  <button
                    disabled={isLoading}
                    onClick={() => {
                      if (retryMessages) void requestAnswer(retryMessages);
                    }}
                    className="mt-3 min-h-11 rounded-xl border border-amber-200 px-4"
                  >
                    {t(
                      "Retry question",
                      "सवाल फिर भेजें",
                      "سوال دوبارہ بھیجیں",
                    )}
                  </button>
                </div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-white/10" : "bg-[#d4af37]"}`}
                    >
                      {msg.role === "user" ? (
                        <User size={14} />
                      ) : (
                        <Bot size={14} className="text-[#101b18]" />
                      )}
                    </div>
                    <div
                      dir="auto"
                      style={{
                        fontFamily:
                          "var(--font-sans), var(--font-arabic), system-ui, sans-serif",
                      }}
                      className={`p-4 rounded-2xl text-base leading-7 whitespace-pre-wrap break-words ${msg.role === "user" ? "bg-[#3b3420] text-[#faf7ef] rounded-tr-none" : "bg-[#20312a] text-[#faf7ef] rounded-tl-none"}`}
                    >
                      {msg.content}
                      {msg.links && msg.links.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{msg.links.map(link => <a key={link.href} href={link.href} className="inline-flex min-h-11 items-center rounded-lg border border-amber-200 px-3 py-2 text-amber-100 underline">{link.label}</a>)}</div>}
                      {msg.references && msg.references.length > 0 && (
                        <div className="mt-3 border-t border-white/20 pt-3 text-sm">
                          <p>
                            {t(
                              "Related verses for further study (selected by the website)",
                              "आगे पढ़ने के लिए संबंधित आयतें (वेबसाइट द्वारा चुनी गई)",
                              "مزید مطالعے کے لیے متعلقہ آیات (ویب سائٹ کی منتخب کردہ)",
                            )}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {msg.references.map((ref) => (
                              <a
                                key={ref}
                                href={`https://quran.com/${ref.replace(":", "/")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-lg border border-amber-200 px-3 py-2 text-amber-100 underline"
                              >
                                {ref}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div
                  role="status"
                  aria-label={t(
                    "Preparing a response…",
                    "जवाब तैयार हो रहा है…",
                    "جواب تیار ہو رہا ہے…",
                  )}
                  className="flex justify-start"
                >
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#d4af37] flex items-center justify-center">
                      <Loader2
                        size={14}
                        className="text-[#101b18] animate-spin"
                      />
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
                  aria-label={t(
                    "Ask the website guide",
                    "वेबसाइट रहनुमा से पूछें",
                    "ویب سائٹ رہنما سے پوچھیں",
                  )}
                  placeholder={t(
                    "Find a surah, topic or feature…",
                    "सूरह, मौज़ू या फ़ीचर ढूँढें…",
                    "سورت، موضوع یا سہولت تلاش کریں…",
                  )}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-[#faf7ef] focus:outline-none focus:border-gold/50 transition-colors"
                />
                <button
                  aria-label={t("Send question", "सवाल भेजें", "سوال بھیجیں")}
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
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
