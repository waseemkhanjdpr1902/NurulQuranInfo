"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, BookOpen, Info, Loader2, CheckCircle2, Copy, Share2, X, Heart, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Verse {
  id: number;
  verse_number: number;
  text_uthmani: string;
  translation: string;
  audio_url?: string;
}

const RECITERS = [
  { id: "ar.alafasy", name: "Mishary Rashid Alafasy" },
  { id: "ar.abdulsamad", name: "AbdulBaset AbdulSamad" },
  { id: "ar.abdurrahmaansudais", name: "Abdur-Rahman as-Sudais" },
  { id: "ar.shaatree", name: "Abu Bakr Ash-Shaatree" },
  { id: "ar.hanirifai", name: "Hani ar-Rifai" },
  { id: "ar.husary", name: "Mahmoud Al-Husary" },
  { id: "ar.abdullahbasfar", name: "Abdullah Basfar" },
  { id: "ar.ahmedajamy", name: "Ahmed ibn Ali al-Ajamy" },
  { id: "ar.hudhaify", name: "Ali al-Hudhaify" },
  { id: "ar.ibrahimakhbar", name: "Ibrahim Akhdar" },
  { id: "ar.mahermuaiqly", name: "Maher Al Muaiqly" },
  { id: "ar.muhammadayyoub", name: "Muhammad Ayyoub" },
  { id: "ar.muhammadjibreel", name: "Muhammad Jibreel" },
  { id: "ar.saoodshuraym", name: "Saood Ash-Shuraym" },
  { id: "ar.aymanswoaid", name: "Ayman Sowaid" },
  { id: "ar.parhizgar", name: "Shahriar Parhizgar" },
];

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

import AudioPlayer from "@/components/AudioPlayer/AudioPlayer";

export default function QuranReader({ 
  surah, 
  nextSlug, 
  prevSlug,
  autoplay = false
}: { 
  surah: Surah; 
  nextSlug?: string | null; 
  prevSlug?: string | null;
  autoplay?: boolean;
}) {
  const router = useRouter();
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [reciterId, setReciterId] = useState("ar.alafasy");
  const [playingVerseId, setPlayingVerseId] = useState<number | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [selectedTafsir, setSelectedTafsir] = useState<Verse | null>(null);
  const [tafsirContent, setTafsirContent] = useState<string | null>(null);
  const [loadingTafsir, setLoadingTafsir] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const [activeTab, setActiveTab] = useState<"tafsir" | "hadith" | "ai">("tafsir");
  const [hadithContent, setHadithContent] = useState<{ text: string, source: string }[]>([]);
  const [loadingHadith, setLoadingHadith] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const fetchTafsir = async (verse: Verse) => {
    setLoadingTafsir(true);
    setTafsirContent(null);
    setSelectedTafsir(verse);
    setActiveTab("tafsir");
    try {
      const verseKey = `${surah.number}:${verse.verse_number}`;
      const res = await fetch(`/api/tafsir?verse_key=${encodeURIComponent(verseKey)}`);
      if (!res.ok) {
        throw new Error(`Tafsir request failed with status ${res.status}`);
      }

      const data = await res.json();
      const tafsirText = data?.text;

      if (tafsirText) {
        setTafsirContent(tafsirText);
      } else {
        setTafsirContent("Tafsir Ibn Kathir not found for this verse.");
      }
    } catch (error) {
      console.error("Error fetching tafsir:", error);
      setTafsirContent("Failed to load tafsir. Please try again in a moment.");
    } finally {
      setLoadingTafsir(false);
    }
  };

  const fetchRelatedHadith = async (verse: Verse) => {
    setLoadingHadith(true);
    setActiveTab("hadith");
    try {
      // Basic fallback while AI generates
      setHadithContent([
        { 
          text: "The Prophet (ﷺ) said: 'The best among you are those who learn the Quran and teach it.'", 
          source: "Sahih Bukhari 5027" 
        }
      ]);
    } catch (error) {
      console.error("Error fetching hadith:", error);
    } finally {
      setLoadingHadith(false);
    }
  };

  const fetchAiInsight = async (verse: Verse) => {
    setLoadingAi(true);
    setAiInsight(null);
    setActiveTab("ai");
    try {
      const res = await fetch("/api/ai-insight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          surahName: surah.englishName,
          surahNumber: surah.number,
          verseNumber: verse.verse_number,
          arabic: verse.text_uthmani,
          translation: verse.translation,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "AI insight request failed");
      }

      setAiInsight(data?.text || "Insight unavailable at the moment.");
    } catch (error) {
      console.error("AI Insight Error:", error);
      setAiInsight("Unable to generate AI insights. Please check that the Gemini API key is configured in Vercel.");
    } finally {
      setLoadingAi(false);
    }
  };

  const playVerse = useCallback((verse: Verse) => {
    setPlayingVerseId(prevId => {
      // Toggle if already playing this verse
      if (prevId === verse.id) {
        setIsAudioPlaying(currentPlaying => {
          if (currentPlaying) {
            setAudioUrl(null);
            return false;
          } else {
            const fallbackAudio = `https://cdn.alquran.cloud/media/audio/ayah/${reciterId}/${verse.id}`;
            let finalAudio = verse.audio_url || fallbackAudio;
            if (finalAudio.startsWith("//")) finalAudio = `https:${finalAudio}`;
            setAudioUrl(finalAudio);
            return true;
          }
        });
        return prevId;
      } else {
        // Switch to new verse
        const fallbackAudio = `https://cdn.alquran.cloud/media/audio/ayah/${reciterId}/${verse.id}`;
        let finalAudio = verse.audio_url || fallbackAudio;
        if (finalAudio.startsWith("//")) finalAudio = `https:${finalAudio}`;
        
        setAudioUrl(finalAudio);
        setIsAudioPlaying(true);
        return verse.id;
      }
    });
  }, [reciterId]);

  useEffect(() => {
    const fetchVerses = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/editions/quran-uthmani,en.sahih,${reciterId}`);
        if (!res.ok) throw new Error("Failed to fetch verses");
        const data = await res.json();
        
        const arabicVerses = data.data[0].ayahs;
        const englishVerses = data.data[1].ayahs;
        const audioVerses = data.data[2].ayahs;
        
        const combinedVerses = arabicVerses.map((v: any, i: number) => {
          let audio = audioVerses[i].audio;
          if (audio && audio.startsWith("//")) {
            audio = `https:${audio}`;
          }
          return {
            id: v.number,
            verse_number: v.numberInSurah,
            text_uthmani: v.text,
            translation: englishVerses[i].text,
            audio_url: audio,
          };
        });
        
        setVerses(combinedVerses);
      } catch (error) {
        console.error("Error fetching verses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVerses();
  }, [surah.number, reciterId]);

  useEffect(() => {
    setAudioUrl(null);
    setPlayingVerseId(null);
    setIsAudioPlaying(false);
  }, [reciterId]);

  // Handle autoplay on mount
  const hasAutoplayed = useRef(false);
  useEffect(() => {
    if (autoplay && verses.length > 0 && !loading && !hasAutoplayed.current) {
      hasAutoplayed.current = true;
      playVerse(verses[0]);
    }
  }, [autoplay, loading, verses, playVerse]);

  // Auto-scroll to playing verse
  useEffect(() => {
    if (playingVerseId) {
      const playingVerse = verses.find(v => v.id === playingVerseId);
      if (playingVerse) {
        const element = document.getElementById(`verse-${playingVerse.verse_number}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
  }, [playingVerseId, verses]);

  const playNextVerse = useCallback(() => {
    if (playingVerseId === null) return;
    const currentIndex = verses.findIndex(v => v.id === playingVerseId);
    if (currentIndex !== -1 && currentIndex < verses.length - 1) {
      playVerse(verses[currentIndex + 1]);
    } else if (nextSlug) {
      router.push(`/quran/${nextSlug}?autoplay=true`);
    }
  }, [playingVerseId, verses, playVerse, nextSlug, router]);

  const playPrevVerse = useCallback(() => {
    if (playingVerseId === null) return;
    const currentIndex = verses.findIndex(v => v.id === playingVerseId);
    if (currentIndex !== -1 && currentIndex > 0) {
      playVerse(verses[currentIndex - 1]);
    } else if (prevSlug) {
      router.push(`/quran/${prevSlug}`);
    }
  }, [playingVerseId, verses, playVerse, prevSlug, router]);

  const copyVerse = (verse: Verse) => {
    const text = `${verse.text_uthmani}\n\n${verse.translation}\n\n(Quran ${surah.number}:${verse.verse_number})`;
    navigator.clipboard.writeText(text);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 2000);
  };

  const shareSurah = () => {
    if (navigator.share) {
      navigator.share({
        title: `Surah ${surah.englishName}`,
        text: `Read and listen to Surah ${surah.englishName} on NurulQuran`,
        url: window.location.href,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <Loader2 className="text-gold animate-spin" size={48} />
        <p className="text-parchment/40 font-display text-xl">Loading verses...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Reciter Selection & Info */}
      <div className="glass p-6 rounded-[32px] border-gold/20 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl gold-gradient flex items-center justify-center text-ink shadow-lg">
            <BookOpen size={24} />
          </div>
          <div>
            <h4 className="text-parchment font-bold">{surah.englishName}</h4>
            <select 
              value={reciterId}
              onChange={(e) => setReciterId(e.target.value)}
              className="bg-transparent text-gold/60 text-[10px] uppercase tracking-widest outline-none cursor-pointer hover:text-gold transition-colors"
            >
              {RECITERS.map(r => (
                <option key={r.id} value={r.id} className="bg-ink text-parchment">{r.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (verses.length > 0) {
                if (isAudioPlaying && playingVerseId !== null) {
                  setIsAudioPlaying(false);
                  setAudioUrl(null);
                } else {
                  playVerse(verses[0]);
                }
              }
            }}
            className={`px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${isAudioPlaying ? 'bg-gold text-ink shadow-lg shadow-gold/20' : 'glass text-parchment/60 hover:text-gold'}`}
          >
            {isAudioPlaying ? <Pause size={14} /> : <Play size={14} />} 
            {isAudioPlaying ? 'Stop Recitation' : 'Play All'}
          </button>
          <button 
            onClick={shareSurah}
            className="px-6 py-3 glass rounded-2xl text-parchment/60 text-[10px] font-bold uppercase tracking-widest hover:text-gold transition-all flex items-center gap-2"
          >
            <Share2 size={14} /> Share Surah
          </button>
        </div>
      </div>

      {/* Verses List */}
      <div className="space-y-16 mb-40">
        {verses.map((verse) => (
          <motion.div 
            key={verse.id} 
            id={`verse-${verse.verse_number}`}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`group relative scroll-mt-32 p-8 rounded-[32px] transition-all duration-700 ${playingVerseId === verse.id ? 'glass bg-gold/5 border-gold/10' : 'hover:bg-white/5'}`}
          >
            <div className={`hidden md:block absolute -left-12 top-10 font-display text-4xl transition-colors ${playingVerseId === verse.id ? 'text-gold' : 'text-gold/20 group-hover:text-gold/40'}`}>
              {verse.verse_number}
            </div>
            <div className="text-right mb-8">
              <p className="text-3xl md:text-6xl font-arabic text-parchment leading-[2.2] text-right selection:bg-gold/40">
                {verse.text_uthmani}
              </p>
            </div>
            <div className="pl-6 md:pl-8 border-l-2 border-gold/10 group-hover:border-gold/30 transition-colors">
              <p className="text-parchment/70 text-lg md:text-xl leading-relaxed font-light">
                {verse.translation}
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
              <button 
                onClick={() => playVerse(verse)}
                className={`flex items-center gap-2 transition-colors text-[10px] uppercase tracking-widest ${playingVerseId === verse.id && isAudioPlaying ? 'text-gold' : 'text-parchment/30 hover:text-gold'}`}
              >
                {playingVerseId === verse.id && isAudioPlaying ? <Pause size={14} /> : <Play size={14} />} 
                {playingVerseId === verse.id && isAudioPlaying ? 'Playing' : 'Play Verse'}
              </button>
              <button 
                onClick={() => copyVerse(verse)}
                className="flex items-center gap-2 text-parchment/30 hover:text-gold transition-colors text-[10px] uppercase tracking-widest"
              >
                <Copy size={14} /> Copy
              </button>
              <button 
                onClick={() => fetchTafsir(verse)}
                className="flex items-center gap-2 text-parchment/30 hover:text-gold transition-colors text-[10px] uppercase tracking-widest"
              >
                <Info size={14} /> Tafsir
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Persistent Audio Player */}
      <AudioPlayer 
        audioUrl={audioUrl}
        title={surah.englishName}
        subtitle={RECITERS.find(r => r.id === reciterId)?.name || ""}
        autoPlay={autoplay}
        onPlayRequest={() => {
          if (verses.length > 0) {
            playVerse(verses[0]);
          }
        }}
        onNext={playNextVerse}
        onPrev={playPrevVerse}
        onPlayStateChange={setIsAudioPlaying}
      />

      {/* Copy Toast */}
      <AnimatePresence>
        {showCopyToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-gold text-ink rounded-full font-bold text-xs shadow-2xl"
          >
            Verse copied to clipboard
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tafsir Modal */}
      <AnimatePresence>
        {selectedTafsir && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedTafsir(null);
                setTafsirContent(null);
              }}
              className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl glass p-8 md:p-12 rounded-[40px] border-gold/20 shadow-2xl max-h-[85vh] flex flex-col"
            >
              <button 
                onClick={() => {
                  setSelectedTafsir(null);
                  setTafsirContent(null);
                }}
                className="absolute top-8 right-8 text-parchment/30 hover:text-gold transition-colors z-10"
              >
                <X size={24} />
              </button>
              
              <div className="overflow-y-auto pr-4 custom-scrollbar">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-display text-gold">Verse {selectedTafsir.verse_number} Study</h3>
                  <div className="flex gap-2 p-1 glass rounded-2xl">
                    {[
                      { id: 'tafsir', label: 'Tafsir', icon: <BookOpen size={14} />, action: () => fetchTafsir(selectedTafsir) },
                      { id: 'hadith', label: 'Hadith', icon: <Heart size={14} />, action: () => fetchRelatedHadith(selectedTafsir) },
                      { id: 'ai', label: 'AI Study', icon: <Sparkles size={14} />, action: () => fetchAiInsight(selectedTafsir) }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id as any);
                          tab.action();
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-gold text-ink' : 'text-parchment/40 hover:text-gold'}`}
                      >
                        {tab.icon} {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="glass p-6 rounded-3xl bg-white/5 border-white/5 text-right">
                    <p className="text-2xl font-arabic text-parchment leading-loose">{selectedTafsir.text_uthmani}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-gold/60 text-[10px] uppercase tracking-widest mb-2 font-bold">English Sahih Translation</h4>
                    <p className="text-parchment/70 leading-relaxed italic border-l-2 border-gold/20 pl-4">&quot;{selectedTafsir.translation}&quot;</p>
                  </div>
                  
                  <div className="pt-8 border-t border-white/5">
                    {activeTab === 'tafsir' && (
                      loadingTafsir ? (
                        <div className="flex flex-col items-center py-12 gap-4">
                          <Loader2 className="text-gold animate-spin" size={32} />
                          <p className="text-parchment/30 text-xs animate-pulse">Fetching Ibn Kathir&apos;s Wisdom...</p>
                        </div>
                      ) : (
                        <div className="prose prose-invert prose-gold max-w-none">
                          <p className="text-gold/40 text-[10px] uppercase tracking-widest mb-6">Authoritative Commentary: Ibn Kathir</p>
                          <div 
                            className="text-parchment/70 leading-relaxed space-y-4 tafsir-content text-sm md:text-base"
                            dangerouslySetInnerHTML={{ __html: tafsirContent || "" }}
                          />
                        </div>
                      )
                    )}

                    {activeTab === 'hadith' && (
                      loadingHadith ? (
                        <div className="flex flex-col items-center py-12 gap-4">
                          <Loader2 className="text-gold animate-spin" size={32} />
                          <p className="text-parchment/30 text-xs animate-pulse">Searching Prophetic Traditions...</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                           {hadithContent.map((h, i) => (
                             <div key={i} className="glass p-8 rounded-[32px] border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-gold/20 group-hover:bg-gold transition-colors" />
                                <p className="text-parchment/70 leading-relaxed italic mb-4">&quot;{h.text}&quot;</p>
                                <div className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">— {h.source}</div>
                             </div>
                           ))}
                           <p className="text-parchment/40 text-xs italic mt-8">Note: In Study Mode, use the AI Study tab for comprehensive Hadith connections to this specific verse.</p>
                        </div>
                      )
                    )}

                    {activeTab === 'ai' && (
                      loadingAi ? (
                        <div className="flex flex-col items-center py-12 gap-4">
                          <Loader2 className="text-gold animate-spin" size={32} />
                          <Sparkles className="text-gold/20 absolute animate-ping" size={48} />
                          <p className="text-parchment/30 text-xs animate-pulse font-display italic">Gemini is synthesizing Quran & Sunnah insights...</p>
                        </div>
                      ) : (
                        <div className="glass p-10 rounded-[40px] border-gold/10 bg-gold/5">
                           <div className="flex items-center gap-3 mb-8">
                             <Sparkles className="text-gold" size={24} />
                             <h4 className="text-xl font-display text-parchment">AI Spiritual Companion</h4>
                           </div>
                           <div className="prose prose-invert prose-gold max-w-none text-parchment/80 text-base leading-relaxed space-y-4 whitespace-pre-wrap font-light">
                             {aiInsight}
                           </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
