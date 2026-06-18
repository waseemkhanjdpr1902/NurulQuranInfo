"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Heart, Search, BookOpen, Sun, Moon, Shield, Home, Copy, Share2, Volume2, VolumeX } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Breadcrumbs, RelatedTools, ToolGuidance } from "@/components/tooling";

interface Dua {
  id: number;
  category: "morning" | "evening" | "protection" | "home";
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
}

const DUAS = [
  {
    id: 1,
    category: "morning",
    title: "Morning Remembrance",
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
    transliteration: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namut, wa ilaykan-nushur.",
    translation: "O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the Final Return.",
    reference: "Abu Dawud 4/317",
  },
  {
    id: 2,
    category: "evening",
    title: "Evening Remembrance",
    arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
    transliteration: "Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namut, wa ilaykal-masir.",
    translation: "O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and to You is the Final Return.",
    reference: "Abu Dawud 4/317",
  },
  {
    id: 3,
    category: "protection",
    title: "Protection from Harm",
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    transliteration: "Bismillahilladhi la yadurru ma'a ismihi shay'un fil-ardi wa la fis-sama'i wa huwas-sami'ul-'alim.",
    translation: "In the name of Allah, with whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, All-Knowing.",
    reference: "Abu Dawud 5088",
  },
  {
    id: 4,
    category: "protection",
    title: "Seeking Refuge",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    transliteration: "A'udhu bikalimatillahit-tammati min sharri ma khalaq.",
    translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
    reference: "Sahih Muslim 2708",
  },
  {
    id: 5,
    category: "home",
    title: "Before Entering Home",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلَجِ وَخَيْرَ الْمَخْرَجِ",
    transliteration: "Allahumma inni as'aluka khayral-mawlaji wa khayral-makhraj.",
    translation: "O Allah, I ask You for the best entry and the best exit.",
    reference: "Abu Dawud 5096",
  },
  {
    id: 6,
    category: "morning",
    title: "Contentment with Allah",
    arabic: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا",
    transliteration: "Raditu billahi rabba, wa bil-islami dina, wa bi Muhammadin sallallahu 'alayhi wa sallama nabiyya.",
    translation: "I am pleased with Allah as Lord, Islam as religion, and Muhammad (peace be upon him) as Prophet.",
    reference: "Abu Dawud 5072",
  },
  {
    id: 7,
    category: "evening",
    title: "Forgiveness and Wellbeing",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
    transliteration: "Allahumma inni as'alukal-'afiyata fid-dunya wal-akhirah.",
    translation: "O Allah, I ask You for wellbeing in this world and the Hereafter.",
    reference: "Ibn Majah 3871",
  },
  {
    id: 8,
    category: "home",
    title: "Leaving Home",
    arabic: "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    transliteration: "Bismillah, tawakkaltu 'alallah, wa la hawla wa la quwwata illa billah.",
    translation: "In the name of Allah, I place my trust in Allah, and there is no power nor strength except with Allah.",
    reference: "Abu Dawud 5095",
  },
] satisfies Dua[];

const categories = [
  { id: "all", label: "All", icon: BookOpen },
  { id: "morning", label: "Morning", icon: Sun },
  { id: "evening", label: "Evening", icon: Moon },
  { id: "protection", label: "Protection", icon: Shield },
  { id: "home", label: "Home", icon: Home },
] as const;

export default function DuaPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]["id"]>("all");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setFavorites(JSON.parse(window.localStorage.getItem("nurulquran.favoriteDuas") || "[]"));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("nurulquran.favoriteDuas", JSON.stringify(favorites));
  }, [favorites]);

  const filteredDuas = useMemo(() => {
    const term = search.trim().toLowerCase();
    return DUAS.filter((dua) => {
      const matchesCategory = category === "all" || dua.category === category;
      const matchesSearch = !term || [dua.title, dua.arabic, dua.transliteration, dua.translation, dua.reference]
        .join(" ")
        .toLowerCase()
        .includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 1800);
  };

  const duaText = (dua: Dua) => `${dua.title}\n\n${dua.arabic}\n\n${dua.transliteration}\n\n${dua.translation}\n\n${dua.reference}`;

  const toggleAudio = (dua: Dua) => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = "";
    }

    if (playingId === dua.id) {
      setPlayingId(null);
      setCurrentAudio(null);
      return;
    }

    const audio = new Audio(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(dua.arabic)}&tl=ar&client=tw-ob`);
    audio.onended = () => {
      setPlayingId(null);
      setCurrentAudio(null);
    };
    audio.play();
    setPlayingId(dua.id);
    setCurrentAudio(audio);
  };

  const copyDua = async (dua: Dua) => {
    await navigator.clipboard.writeText(duaText(dua));
    showToast("Dua copied");
  };

  const shareDua = async (dua: Dua) => {
    if (navigator.share) {
      await navigator.share({
        title: dua.title,
        text: duaText(dua),
        url: window.location.href,
      });
      return;
    }

    await navigator.clipboard.writeText(duaText(dua));
    showToast("Share text copied");
  };

  const toggleFavorite = (id: number) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      
      <div className="pt-40 pb-24 px-6 max-w-7xl mx-auto">
        <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "Duas" }]} />
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display text-parchment mb-6 tracking-tight"
          >
            Dua & <span className="text-gold italic">Adhkar</span>
          </motion.h1>
          <p className="text-parchment/40 text-lg max-w-2xl mx-auto leading-relaxed font-light">
            A curated collection of authentic supplications from the Quran and Sunnah. Now with audio recitation.
          </p>
        </div>

        <div className="flex flex-col gap-6 mb-16">
          <div className="relative max-w-2xl mx-auto w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-parchment/20" size={20} />
            <input
              aria-label="Search duas"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search dua, transliteration, translation, or reference..."
              className="w-full pl-16 pr-6 py-5 glass rounded-[32px] text-parchment placeholder:text-parchment/20 focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 justify-start md:justify-center">
            {categories.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCategory(item.id)}
                  className={`px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2 ${
                    category === item.id ? "gold-gradient text-ink" : "glass text-parchment/50 hover:text-gold"
                  }`}
                >
                  <Icon size={16} /> {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
          {filteredDuas.map((dua) => (
            <motion.div
              key={dua.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 md:p-12 rounded-[40px] border-white/5 hover:border-gold/20 transition-all group"
            >
              <div className="flex items-center justify-between gap-4 mb-8">
                <div>
                  <p className="text-gold/50 text-[10px] uppercase tracking-[0.25em] font-bold mb-2">{dua.category}</p>
                  <h2 className="text-2xl font-display text-parchment">{dua.title}</h2>
                </div>
                <button
                  aria-label={favorites.includes(dua.id) ? "Remove favorite dua" : "Favorite dua"}
                  onClick={() => toggleFavorite(dua.id)}
                  className={`text-parchment/20 hover:text-rose-500 transition-colors ${favorites.includes(dua.id) ? "text-rose-500" : ""}`}
                >
                  <Heart size={24} className={favorites.includes(dua.id) ? "fill-rose-500" : ""} />
                </button>
              </div>

              <div className="text-right mb-8">
                <p className="text-3xl md:text-5xl font-arabic text-parchment leading-relaxed">
                  {dua.arabic}
                </p>
              </div>
              
              <div className="space-y-4 mb-10">
                <p className="text-gold/70 italic leading-relaxed">{dua.transliteration}</p>
                <p className="text-parchment/80 text-lg leading-relaxed">{dua.translation}</p>
                <div className="flex items-center gap-2 text-gold/40 text-xs font-bold uppercase tracking-[0.2em]">
                  <BookOpen size={14} /> {dua.reference}
                </div>
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <button 
                    aria-label={playingId === dua.id ? "Stop dua audio" : "Play dua audio"}
                    onClick={() => toggleAudio(dua)}
                    className={`p-4 rounded-2xl transition-all ${
                      playingId === dua.id 
                      ? "bg-gold text-ink scale-110 shadow-lg shadow-gold/20" 
                      : "glass text-parchment/30 hover:text-gold"
                    }`}
                  >
                    {playingId === dua.id ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <button aria-label="Copy dua" onClick={() => copyDua(dua)} className="p-4 glass rounded-2xl text-parchment/30 hover:text-gold transition-colors">
                    <Copy size={20} />
                  </button>
                  <button aria-label="Share dua" onClick={() => shareDua(dua)} className="p-4 glass rounded-2xl text-parchment/30 hover:text-gold transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredDuas.length === 0 && (
          <div className="text-center py-24">
            <p className="text-parchment/30 font-display text-2xl">No duas match your search.</p>
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-5 py-3 rounded-full bg-gold text-ink text-xs font-bold shadow-2xl z-50">
          {toast}
        </div>
      )}

      <ToolGuidance
        title="Keep authentic duas close"
        what="The Duas tool collects supplications and adhkar with Arabic, transliteration, translation, audio, categories, search, copy, share, and favorites."
        how={[
          "Search or filter by category such as morning, evening, protection, or home.",
          "Read the Arabic and transliteration, then listen if you need pronunciation support.",
          "Favorite duas you use often and copy or share them when helpful.",
        ]}
      />
      <RelatedTools currentHref="/dua" />
      <Footer />
    </main>
  );
}
