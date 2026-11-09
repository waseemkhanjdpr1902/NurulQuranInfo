"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useUILanguage } from "@/components/UILanguageProvider";

type Dua = { id: string; topics: string[]; arabic: string; transliteration: string; meaning: string; reference: string; url: string; note?: string };
const topics = [
  { id: "health", en: "Health", hi: "सेहत", ur: "صحت" },
  { id: "rizq", en: "Rizq", hi: "रिज़्क़", ur: "رزق" },
  { id: "forgiveness", en: "Forgiveness", hi: "माफ़ी", ur: "استغفار" },
  { id: "study", en: "Exams & learning", hi: "पढ़ाई और इम्तिहान", ur: "پڑھائی اور امتحان" },
  { id: "business", en: "Business & work", hi: "कारोबार और काम", ur: "کاروبار اور کام" },
  { id: "worry", en: "Worry & hardship", hi: "परेशानी", ur: "پریشانی" },
  { id: "family", en: "Family & parents", hi: "परिवार और माता-पिता", ur: "گھر اور والدین" },
];
const duas: Dua[] = [
 { id:"health-ayyub", topics:["health","worry"], arabic:"أَنِّي مَسَّنِيَ الضُّرُّ وَأَنتَ أَرْحَمُ الرَّاحِمِينَ", transliteration:"Anni massaniyad-durru wa anta arhamur-rahimin.", meaning:"Indeed, adversity has touched me, and You are the Most Merciful of those who show mercy.", reference:"Qur’an 21:83", url:"https://quran.com/21/83", note:"The supplication of Prophet Ayyub (peace be upon him)." },
 { id:"health-cure", topics:["health"], arabic:"أَذْهِبِ الْبَاسَ رَبَّ النَّاسِ، اشْفِ وَأَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا", transliteration:"Adhhib il-ba'sa rabban-nas, ishfi wa antash-shafi, la shifa'a illa shifa'uka, shifa'an la yughadiru saqama.", meaning:"O Lord of humankind, remove the harm and grant healing. You are the Healer; there is no healing except Your healing, a healing that leaves no illness.", reference:"Sahih al-Bukhari 5675", url:"https://sunnah.com/bukhari:5675" },
 { id:"need", topics:["rizq","business"], arabic:"رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ", transliteration:"Rabbi inni lima anzalta ilayya min khayrin faqir.", meaning:"My Lord, I am truly in need of whatever good You send down to me.", reference:"Qur’an 28:24", url:"https://quran.com/28/24", note:"A general supplication for good, also relevant when seeking provision." },
 { id:"good", topics:["rizq","business","health","family"], arabic:"رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", transliteration:"Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina adhaban-nar.", meaning:"Our Lord, grant us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.", reference:"Qur’an 2:201", url:"https://quran.com/2/201", note:"A comprehensive prayer for good in this life and the next." },
 { id:"forgive", topics:["forgiveness"], arabic:"رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ", transliteration:"Rabbana zalamna anfusana wa in lam taghfir lana wa tarhamna lanakunanna minal-khasirin.", meaning:"Our Lord, we have wronged ourselves. If You do not forgive us and have mercy on us, we will surely be among the losers.", reference:"Qur’an 7:23", url:"https://quran.com/7/23" },
 { id:"yunus", topics:["forgiveness","worry"], arabic:"لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ", transliteration:"La ilaha illa anta subhanaka inni kuntu minaz-zalimin.", meaning:"There is no deity except You. Glory be to You; indeed, I was among the wrongdoers.", reference:"Qur’an 21:87", url:"https://quran.com/21/87", note:"The supplication of Prophet Yunus (peace be upon him)." },
 { id:"knowledge", topics:["study"], arabic:"رَّبِّ زِدْنِي عِلْمًا", transliteration:"Rabbi zidni ilma.", meaning:"My Lord, increase me in knowledge.", reference:"Qur’an 20:114", url:"https://quran.com/20/114", note:"A prayer for knowledge; useful while studying." },
 { id:"ease", topics:["study","business","worry"], arabic:"رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي يَفْقَهُوا قَوْلِي", transliteration:"Rabbishrah li sadri wa yassir li amri, wahlul uqdatan min lisani yafqahu qawli.", meaning:"My Lord, expand my chest, ease my task for me, and untie the knot from my tongue so that they may understand my speech.", reference:"Qur’an 20:25–28", url:"https://quran.com/20/25-28", note:"The supplication of Prophet Musa (peace be upon him) before his mission." },
 { id:"parents", topics:["family"], arabic:"رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا", transliteration:"Rabbir hamhuma kama rabbayani saghira.", meaning:"My Lord, have mercy on them as they raised me when I was small.", reference:"Qur’an 17:24", url:"https://quran.com/17/24", note:"A prayer for one’s parents." },
 { id:"family", topics:["family"], arabic:"رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا", transliteration:"Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin waj'alna lil-muttaqina imama.", meaning:"Our Lord, grant us comfort in our spouses and children, and make us an example for the mindful of Allah.", reference:"Qur’an 25:74", url:"https://quran.com/25/74" },
];

export default function DailyDuasPage() {
  const { t } = useUILanguage();
  const [topic, setTopic] = useState("health");
  const [positions, setPositions] = useState<Record<string, number>>({});
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const now = new Date();
    const day = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
    setPositions(Object.fromEntries(topics.map(item => [item.id, day])));
  }, []);
  const items = duas.filter(dua => dua.topics.includes(topic));
  const position = (positions[topic] || 0) % items.length;
  const dua = items[position];
  const currentTopic = topics.find(item => item.id === topic)!;
  return <main className="min-h-screen bg-ink"><Navbar />
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-36 sm:px-6">
      <Link href="/dua" className="text-sm font-semibold text-[#0d6658] underline">{t("← All duas and adhkar", "← सभी दुआएँ और अज़कार", "← تمام دعائیں اور اذکار")}</Link>
      <h1 className="mt-5 text-4xl font-display font-bold text-parchment sm:text-5xl">{t("Daily life duas", "रोज़मर्रा की दुआएँ", "روزمرہ کی دعائیں")} <span aria-label="new" className="text-[#b47800]">*</span></h1>
      <p className="mt-4 text-base leading-relaxed text-parchment">{t("Choose a concern, read a supplication, and explore another. Each dua includes its source.", "अपना विषय चुनें, दुआ पढ़ें और दूसरी दुआ देखें। हर दुआ का हवाला दिया गया है।", "اپنا موضوع منتخب کریں، دعا پڑھیں اور دوسری دعا دیکھیں۔ ہر دعا کا حوالہ موجود ہے۔")}</p>
      <p className="mt-2 text-sm text-parchment/80">{t("Topics are helpful suggestions, not a promise of a particular outcome. You may also ask Allah in your own words.", "विषय मार्गदर्शन के लिए हैं; आप अपने शब्दों में भी अल्लाह से दुआ कर सकते हैं।", "موضوعات رہنمائی کے لیے ہیں؛ آپ اپنے الفاظ میں بھی اللہ سے دعا کر سکتے ہیں۔")}</p>
      <h2 className="mt-8 text-xl font-bold text-parchment">{t("Choose a topic", "विषय चुनें", "موضوع منتخب کریں")}</h2>
      <div className="mt-3 flex flex-wrap gap-2" aria-label={t("Dua topics", "दुआ के विषय", "دعا کے موضوعات")}>
        {topics.map(item => <button key={item.id} type="button" aria-pressed={topic === item.id} onClick={() => { setTopic(item.id); setNotice(""); }} className={`min-h-12 rounded-xl border-2 px-4 py-2 text-sm font-bold focus-visible:outline focus-visible:outline-4 focus-visible:outline-[#b47800] ${topic === item.id ? "border-[#075c3a] bg-[#075c3a] text-white" : "border-[#8caf9b] bg-white text-[#123d2a]"}`}>{t(item.en,item.hi,item.ur)}</button>)}
      </div>
      <article className="mt-6 rounded-3xl border border-[#bfd9cb] bg-white p-5 text-[#173a2b] shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-xl font-bold">{t(currentTopic.en,currentTopic.hi,currentTopic.ur)}</h2><span className="text-sm font-semibold">{position + 1} / {items.length}</span></div>
        <p lang="ar" dir="rtl" className="mt-8 text-right font-arabic text-3xl leading-[2.2] sm:text-4xl">{dua.arabic}</p>
        <h3 className="mt-7 text-sm font-bold">{t("Pronunciation", "उच्चारण", "تلفظ")}</h3><p className="mt-1 text-base leading-relaxed">{dua.transliteration}</p>
        <h3 className="mt-5 text-sm font-bold">{t("Meaning in English", "अंग्रेज़ी में अर्थ", "انگریزی معنی")}</h3><p className="mt-1 text-base leading-relaxed">{dua.meaning}</p>
        {dua.note && <p className="mt-4 text-sm leading-relaxed">{dua.note}</p>}
        <a href={dua.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center font-bold text-[#075c3a] underline">{dua.reference} ↗</a>
        <div className="mt-5 flex flex-wrap gap-3 border-t border-[#d2e3d9] pt-5"><button type="button" onClick={() => setPositions(prev => ({...prev,[topic]:position + 1}))} disabled={items.length < 2} className="min-h-12 rounded-xl bg-[#075c3a] px-5 font-bold text-white disabled:opacity-50">{t("Show another dua", "दूसरी दुआ देखें", "دوسری دعا دیکھیں")}</button><button type="button" onClick={async () => { try { await navigator.clipboard.writeText(`${dua.arabic}\n${dua.transliteration}\n${dua.meaning}\n${dua.reference} ${dua.url}`); setNotice(t("Dua copied", "दुआ कॉपी हो गई", "دعا کاپی ہو گئی")); } catch { setNotice(t("Copy unavailable; select the text instead.", "कॉपी उपलब्ध नहीं; टेक्स्ट चुनें।", "کاپی دستیاب نہیں؛ متن منتخب کریں۔")); } }} className="min-h-12 rounded-xl border-2 border-[#075c3a] px-5 font-bold text-[#075c3a]">{t("Copy dua", "दुआ कॉपी करें", "دعا کاپی کریں")}</button></div><p aria-live="polite" className="mt-2 text-sm">{notice}</p>
      </article>
      <p className="mt-5 text-sm leading-relaxed text-parchment">{t("For health concerns, seek appropriate medical care alongside dua.", "सेहत के लिए दुआ के साथ उचित इलाज भी लें।", "صحت کے لیے دعا کے ساتھ مناسب طبی علاج بھی حاصل کریں۔")}</p>
    </div><Footer /></main>;
}
