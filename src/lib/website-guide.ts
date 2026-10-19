import { MUSHAF_SURAHS } from "@/data/mushaf-surahs";
import { QURAN_TOPICS } from "@/data/quran-topics";

export type GuideLink = { label: string; href: string };
export function websiteGuide(question: string, language = "en") {
  const lang = language === "ur" || language === "hi" ? language : /[\u0600-\u06ff]/u.test(question) ? "ur" : /[\u0900-\u097f]/u.test(question) ? "hi" : "en";
  const t = (en: string, hi: string, ur: string) => lang === "hi" ? hi : lang === "ur" ? ur : en;
  const normalize = (value: string) => value.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/[أإآٱ]/g, "ا").replace(/[^\p{L}\p{N}]/gu, "");
  const query = normalize(question);
  const result = (text: string, links: GuideLink[], references: string[] = []) => ({ text, links, references, source: "reviewed-site-content" });
  const homeLinks = [
    { label: t("Read Quran", "कुरआन पढ़ें", "قرآن پڑھیں"), href: "/quran" },
    { label: t("Browse topics", "मौज़ू देखें", "موضوعات دیکھیں"), href: "/quran-topics" },
    { label: t("How to use the website", "वेबसाइट की रहनुमाई", "ویب سائٹ کی رہنمائی"), href: "/#quick-guide" },
  ];
  // Never generate prescriptions or personal rulings, even if a reviewed topic matches.
  if (/waz[i e]*fa|fatwa|halal|haram|permissib|guarantee|how many|how often|\d+\s*times|repetition|count|वज़ीफ़|वजीफ|फ़तवा|फतवा|कितनी बार|कितने|हराम|हलाल|وظیف|فتو|کتنی بار|کتنے|حرام|حلال/i.test(question))
    return result(t("This guide does not prescribe wazifas, repetition counts, promised outcomes or personal religious rulings. Please consult a qualified scholar. You can browse the website’s dua collection and published sources below.", "यह रहनुमा वज़ीफ़े, पढ़ने की तादाद, नतीजों की गारंटी या निजी फ़तवे नहीं देता। किसी मुस्तनद आलिम से पूछें। नीचे दुआओं और मआख़िज़ के पेज खोल सकते हैं।", "یہ رہنما وظائف، پڑھنے کی تعداد، نتائج کی ضمانت یا ذاتی فتوے نہیں دیتا۔ کسی مستند عالم سے پوچھیں۔ نیچے دعاؤں اور ماخذ کے صفحات کھول سکتے ہیں۔"), [{label:t("Dua collection", "दुआओं का मजमूआ", "دعاؤں کا مجموعہ"),href:"/dua"},{label:t("Sources", "मआख़िज़", "ماخذ"),href:"/sources"}]);
  const features = [
    { pattern: /mushaf|मुशह|مصحف|zoom|ज़ूम|زوم/i, href: "/mushaf", label: t("Indian Mushaf", "भारतीय मुशहफ़", "ہندوستانی مصحف"), help: t("Open the Mushaf, tap Surah index, then choose a surah. Use + to enlarge the page and Fit page to reset zoom.", "मुशहफ़ खोलें, सूरह फ़ेहरिस्त दबाएँ और सूरह चुनें। + से पन्ना बड़ा करें; पूरा पन्ना से ज़ूम रीसेट करें।", "مصحف کھولیں، سورتوں کی فہرست دبائیں اور سورت منتخب کریں۔ + سے صفحہ بڑا کریں؛ پورا صفحہ سے زوم ری سیٹ کریں۔") },
    { pattern: /listen|audio|recit|translation|tafs[i e]*r|सुन|तिलावत|तर्जु|तफ़सीर|تلاوت|ترجم|تفسیر/i, href: "/quran", label: t("Quran: translation & listening", "कुरआन: तर्जुमा और तिलावत", "قرآن: ترجمہ اور تلاوت"), help: t("Choose a surah. Select written translation and tafsir at the top. For listening, tap Play and choose Arabic only or Arabic + Urdu. These are separate settings.", "सूरह चुनें। ऊपर लिखित तर्जुमा और तफ़सीर की ज़बान चुनें। सुनने के लिए Play दबाएँ और अरबी या अरबी + उर्दू चुनें। ये अलग विकल्प हैं।", "سورت منتخب کریں۔ اوپر تحریری ترجمے اور تفسیر کی زبان منتخب کریں۔ سننے کے لیے Play دبائیں اور عربی یا عربی + اردو منتخب کریں۔ یہ الگ اختیارات ہیں۔") },
    { pattern: /prayer|namaz|salah|qibla|नमाज़|नमाज|क़िब्ला|نماز|قبلہ/i, href: "/prayer-times", label: t("Prayer times", "नमाज़ के वक़्त", "نماز کے اوقات"), help: t("Open Prayer times and choose your city or allow location access to see local times.", "नमाज़ के वक़्त खोलें और अपना शहर चुनें या लोकेशन की इजाज़त दें।", "نماز کے اوقات کھولیں اور اپنا شہر منتخب کریں یا مقام کی اجازت دیں۔") },
    { pattern: /reflect|tadabbur|तदब्बुर|تدبر/i, href: "/quran-reflection", label: t("Quran reflection", "कुरआन पर तदब्बुर", "قرآن پر تدبر"), help: t("Open the reflection planner to choose an ayah, read its translation and record a reflection and daily action.", "तदब्बुर प्लानर में आयत चुनें, तर्जुमा पढ़ें और अपनी सोच व रोज़ाना अमल लिखें।", "تدبر پلانر میں آیت منتخب کریں، ترجمہ پڑھیں اور اپنی سوچ اور روزانہ عمل لکھیں۔") },
    { pattern: /dua|supplication|दुआ|دعا/i, href: "/dua", label: t("Duas", "दुआएँ", "دعائیں"), help: t("Open the dua library to browse the published supplications and their references.", "दुआ लाइब्रेरी में मौजूद दुआएँ और उनके हवाले देखें।", "دعا لائبریری میں موجود دعائیں اور ان کے حوالے دیکھیں۔") },
    { pattern: /journey|bookmark|progress|प्रगति|बुकमार्क|پیش رفت|بک مارک/i, href: "/my-quran-journey", label: t("My Quran journey", "मेरा कुरआन सफ़र", "میرا قرآنی سفر"), help: t("Journey shows your recorded reading progress and bookmarks. Sign in if you want to synchronize across devices.", "अपने पढ़ने की प्रगति और बुकमार्क Journey में देखें। दूसरे डिवाइस पर सिंक करने के लिए साइन इन करें।", "پڑھنے کی پیش رفت اور بک مارکس Journey میں دیکھیں۔ دوسرے آلات پر ہم آہنگی کے لیے سائن اِن کریں۔") },
    { pattern: /dawah|दावत|دعوت/i, href: "/dawah", label: t("Dawah", "दावत", "دعوت"), help: t("The Dawah page provides introductory reading and Quran references. Its AI chat is disabled.", "दावत पेज पर बुनियादी बातें और कुरआन के हवाले हैं। इसका AI चैट बंद है।", "دعوت کے صفحے پر بنیادی باتیں اور قرآنی حوالے ہیں۔ اس کی AI چیٹ بند ہے۔") },
  ];
  const feature = features.find(item => item.pattern.test(question));
  if (feature) return result(feature.help, [{label:feature.label,href:feature.href}]);
  const surah = MUSHAF_SURAHS.find(item => normalize(item.name).length > 3 && query.includes(normalize(item.name)) || query.includes(normalize(item.arabic)));
  const number = question.match(/(?:surah|sura|सूरह|سور[ۃتہ]?)\s*(\d{1,3})/i)?.[1];
  const selected = surah || MUSHAF_SURAHS.find(item => item.number === Number(number));
  if (selected) return result(t(`Open ${selected.name} using the links below.`, `नीचे दिए लिंक से ${selected.name} खोलें।`, `نیچے دیے گئے لنکس سے ${selected.name} کھولیں۔`), [{label:`${selected.number}. ${selected.name}`,href:`/mushaf?page=${selected.printedPage - 1}`},{label:t("Translation & listening", "तर्जुमा और तिलावत", "ترجمہ اور تلاوت"),href:"/quran"}]);
  const aliases = [
    { pattern: /sabr|patience|hardship|صبر|सब्र|धैर्य/i, slug: "patience-during-hardship" },
    { pattern: /tawbah|istighfar|forgive|repent|توبہ|استغفار|तौबा|इस्ति.*फ़ार|माफ़ी/i, slug: "tawbah-and-forgiveness" },
    { pattern: /mercy|hope|رحمت|امید|रहमत|उम्मीद/i, slug: "hope-and-mercy" },
    { pattern: /rizq|provision|رزق|रिज़्क़|रिज्क/i, slug: "rizq-and-contentment" },
    { pattern: /gratitude|shukr|شکر|शुक्र/i, slug: "gratitude" },
  ];
  const topic = QURAN_TOPICS.find(item => item.slug === aliases.find(item => item.pattern.test(question))?.slug || query.includes(normalize(item.title)));
  if (topic) return result(t("From the website’s existing topic summary (English):\n", "वेबसाइट के मौजूदा मौज़ू का ख़ुलासा (अंग्रेज़ी):\n", "ویب سائٹ کے موجودہ موضوع کا خلاصہ (انگریزی):\n") + topic.introduction, [{label:topic.title,href:`/quran-topics/${topic.slug}`},{label:t("Source details", "मआख़िज़ की तफ़सील", "ماخذ کی تفصیل"),href:"/sources"}], topic.ayahs.map(item => `${item.surah}:${item.ayah}`));
  return result(t("I can help you find surahs, website features and existing topic summaries with references. Try ‘Surah 36’, ‘patience’, ‘Mushaf’, ‘translation’ or ‘prayer times’. I do not generate religious advice or personal rulings.", "मैं सूरह, वेबसाइट के फ़ीचर और हवालों के साथ मौजूदा मौज़ू ढूँढने में मदद कर सकता हूँ। ‘Surah 36’, ‘सब्र’, ‘मुशहफ़’, ‘तर्जुमा’ या ‘नमाज़’ लिखें। मैं नई दीनी सलाह या निजी फ़तवे नहीं देता।", "میں سورتیں، ویب سائٹ کی سہولتیں اور حوالوں کے ساتھ موجودہ موضوعات تلاش کرنے میں مدد کر سکتا ہوں۔ ‘Surah 36’، ‘صبر’، ‘مصحف’، ‘ترجمہ’ یا ‘نماز’ لکھیں۔ میں نئی دینی نصیحت یا ذاتی فتوے نہیں دیتا۔"), homeLinks);
}
