import {
  Atom,
  BookOpen,
  Compass,
  FlaskConical,
  Globe,
  Microscope,
  Settings,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";

export interface ScienceTopic {
  id: string;
  title: string;
  category: string;
  icon: LucideIcon;
  summary: string;
  explanation: string;
  scholar: {
    name: string;
    period: string;
    region: string;
    biography: string;
    contribution: string;
    keyWorks: string[];
  };
  timeline: string[];
  whyItMatters: string;
  islamicReflection: string;
  warning: string;
  relatedTopics: string[];
  references: string[];
}

export const scienceTopics: ScienceTopic[] = [
  {
    id: "astronomy",
    title: "Astronomy",
    category: "Astronomy",
    icon: Atom,
    summary: "Study of celestial motion, calendars, navigation, prayer times, and Qibla direction.",
    explanation:
      "Astronomy flourished in Muslim civilization because accurate observation supported calendars, navigation, prayer times, and Qibla calculations. Scholars refined instruments, star catalogues, and mathematical models while remaining aware that creation points beyond itself to Allah.",
    scholar: {
      name: "Al-Biruni",
      period: "973-1048 CE",
      region: "Khwarazm / Ghazni",
      biography:
        "Al-Biruni was a polymath known for careful observation, mathematics, astronomy, geography, and comparative study. He wrote with unusual precision and often distinguished what he observed from what he only reported.",
      contribution:
        "He measured the earth's radius with impressive accuracy for his time, wrote on astronomy and calendars, and studied India with a disciplined comparative method.",
      keyWorks: ["The Canon Masudicus", "Chronology of Ancient Nations", "Tahqiq ma li-l-Hind"],
    },
    timeline: [
      "10th-11th century: observational astronomy and geography mature across the Islamic world.",
      "Al-Biruni combines mathematics, field observation, and critical comparison.",
      "Astronomical work supports calendars, navigation, and worship-related calculations.",
    ],
    whyItMatters:
      "It shows how precise observation and mathematics served both worldly needs and religious life without reducing faith to scientific claims.",
    islamicReflection:
      "The Quran repeatedly invites reflection on the heavens and alternation of night and day. This supports humility, observation, and gratitude rather than sensational miracle claims.",
    warning:
      "Avoid claiming that every modern astronomical discovery is explicitly predicted in scripture. Use reliable tafsir and academic history.",
    relatedTopics: ["Mathematics", "Geography", "Engineering"],
    references: ["Add academic history of astronomy source", "Add Al-Biruni primary/secondary source placeholder"],
  },
  {
    id: "medicine",
    title: "Medicine",
    category: "Medicine",
    icon: FlaskConical,
    summary: "Clinical observation, hospitals, pharmacology, medical ethics, and encyclopedic writing.",
    explanation:
      "Medicine in Muslim societies developed through hospitals, teaching, translation, observation, and medical encyclopedias. Physicians combined inherited Greek, Persian, Indian, and local knowledge with clinical experience.",
    scholar: {
      name: "Ibn Sina",
      period: "980-1037 CE",
      region: "Bukhara / Persia",
      biography:
        "Ibn Sina, known in Latin as Avicenna, was a physician and philosopher whose medical writings influenced medical education for centuries. His work organized diagnosis, treatment, and pharmacology in a systematic way.",
      contribution:
        "He wrote a major medical encyclopedia that synthesized earlier knowledge and clinical practice, becoming a reference in both Islamic and European contexts.",
      keyWorks: ["The Canon of Medicine", "The Book of Healing"],
    },
    timeline: [
      "9th-10th century: hospitals and medical teaching expand in major cities.",
      "11th century: Ibn Sina organizes medical knowledge into influential encyclopedic form.",
      "Later centuries: medical works circulate through Arabic, Persian, Latin, and other traditions.",
    ],
    whyItMatters:
      "It highlights service to human wellbeing, disciplined study, and the importance of ethics in caring for the sick.",
    islamicReflection:
      "Seeking treatment and preserving life align with Islamic values of mercy, responsibility, and care for the body as an amanah.",
    warning:
      "Avoid turning historical medical achievements into unsupported claims about modern cures or miracle medicine.",
    relatedTopics: ["Ethics", "Chemistry", "Philosophy of Science"],
    references: ["Add history of medicine source", "Add Ibn Sina biography source placeholder"],
  },
  {
    id: "optics",
    title: "Optics",
    category: "Optics",
    icon: BookOpen,
    summary: "Study of light, vision, lenses, reflection, refraction, and experimental method.",
    explanation:
      "Optics investigates how light behaves and how vision works. In the Islamic intellectual tradition, optics became an area where mathematics, experiment, and philosophical questions about perception came together.",
    scholar: {
      name: "Ibn al-Haytham",
      period: "965-1040 CE",
      region: "Basra / Cairo",
      biography:
        "Ibn al-Haytham was a mathematician and natural philosopher best known for his work on optics. He emphasized testing, observation, and careful reasoning about light and sight.",
      contribution:
        "He argued that vision occurs when light enters the eye and developed experimental approaches to reflection, refraction, and visual perception.",
      keyWorks: ["Book of Optics"],
    },
    timeline: [
      "10th-11th century: Ibn al-Haytham writes major works on optics and vision.",
      "Experiments with light, shadows, and camera obscura shape later discussions.",
      "His optical works influence later Arabic, Latin, and European scholarship.",
    ],
    whyItMatters:
      "It is a strong example of how careful observation, mathematics, and experiment contributed to scientific method.",
    islamicReflection:
      "Islam encourages honesty in testimony and observation. Studying perception reminds us to be humble about what we see and how we interpret it.",
    warning:
      "Do not claim that modern optics was fully completed in one era; present contributions as part of a long history of learning.",
    relatedTopics: ["Mathematics", "Philosophy of Science", "Engineering"],
    references: ["Add Book of Optics source placeholder", "Add history of optics source"],
  },
  {
    id: "mathematics",
    title: "Mathematics",
    category: "Mathematics",
    icon: Microscope,
    summary: "Algebra, algorithms, geometry, inheritance calculations, astronomy, trade, and engineering.",
    explanation:
      "Mathematics supported commerce, inheritance law, architecture, astronomy, surveying, and engineering. Muslim scholars refined algebraic methods and transmitted mathematical knowledge across languages.",
    scholar: {
      name: "Al-Khwarizmi",
      period: "c. 780-850 CE",
      region: "Khwarazm / Baghdad",
      biography:
        "Al-Khwarizmi worked in the scholarly environment of Abbasid Baghdad. His writings helped organize algebra and arithmetic in ways that shaped later mathematical traditions.",
      contribution:
        "He wrote foundational works on algebra and calculation, and his name is linked to the word algorithm.",
      keyWorks: ["Al-Kitab al-mukhtasar fi hisab al-jabr wal-muqabala", "Book of Indian Calculation"],
    },
    timeline: [
      "9th century: algebraic methods are systematized in Baghdad.",
      "Mathematical texts travel through Arabic, Latin, and other scholarly networks.",
      "Algebra supports inheritance, trade, engineering, and astronomy.",
    ],
    whyItMatters:
      "It shows how abstract knowledge can serve justice, commerce, worship needs, and practical problem-solving.",
    islamicReflection:
      "Order, proportion, and calculation can deepen appreciation for Allah's creation while also serving social responsibilities.",
    warning:
      "Avoid implying mathematics belongs to one civilization alone; acknowledge shared human transmission and development.",
    relatedTopics: ["Astronomy", "Engineering", "Geography"],
    references: ["Add Al-Khwarizmi biography source", "Add history of algebra source placeholder"],
  },
  {
    id: "geography",
    title: "Geography",
    category: "Geography",
    icon: Globe,
    summary: "Maps, travel writing, navigation, climates, trade routes, and descriptions of societies.",
    explanation:
      "Geography connected travel, trade, administration, navigation, and curiosity about Allah's earth. Muslim geographers produced maps, travel accounts, and descriptions of routes and cultures.",
    scholar: {
      name: "Al-Idrisi",
      period: "1100-1165 CE",
      region: "Ceuta / Sicily",
      biography:
        "Al-Idrisi was a geographer and cartographer who worked in Norman Sicily. He gathered geographical reports and produced influential maps and descriptions of regions.",
      contribution:
        "He created a major world map and geographical text that synthesized knowledge from travelers, merchants, and earlier scholars.",
      keyWorks: ["Tabula Rogeriana", "Nuzhat al-mushtaq"],
    },
    timeline: [
      "12th century: Al-Idrisi compiles geographical knowledge for Roger II of Sicily.",
      "Maps and descriptions support travel, trade, and administrative knowledge.",
      "Travel literature expands understanding of societies and routes.",
    ],
    whyItMatters:
      "It connects knowledge with movement, trade, cultural understanding, and awareness of the wider ummah and world.",
    islamicReflection:
      "The Quran invites people to travel through the earth and reflect on history, responsibility, and Allah's signs.",
    warning:
      "Historical maps are valuable but not identical to modern cartography; present them in context.",
    relatedTopics: ["Astronomy", "Mathematics", "Engineering"],
    references: ["Add Al-Idrisi source placeholder", "Add history of cartography source"],
  },
  {
    id: "chemistry",
    title: "Chemistry",
    category: "Chemistry",
    icon: FlaskConical,
    summary: "Laboratory practice, substances, distillation, materials, pharmacy, and early chemical traditions.",
    explanation:
      "Early chemical traditions included practical laboratory work, materials, medicines, perfumes, dyes, metals, and distillation. Later chemistry developed through many cultures and methods.",
    scholar: {
      name: "Jabir ibn Hayyan",
      period: "c. 8th-9th century CE",
      region: "Kufa / Abbasid world",
      biography:
        "Jabir ibn Hayyan is associated with a large body of writings on alchemy and practical laboratory processes. The historical details are complex, so his legacy should be presented carefully.",
      contribution:
        "The Jabirian corpus is linked with discussions of substances, distillation, crystallization, and laboratory techniques that influenced later traditions.",
      keyWorks: ["Jabirian corpus", "Kitab al-Kimya attribution"],
    },
    timeline: [
      "8th-9th century: Arabic writings on alchemy and substances expand.",
      "Laboratory techniques develop around medicines, materials, and crafts.",
      "Later chemistry separates from alchemy through new theories and methods.",
    ],
    whyItMatters:
      "It shows the importance of practical experimentation, craft knowledge, and careful historical interpretation.",
    islamicReflection:
      "Studying materials can encourage gratitude for the resources Allah placed in creation and responsibility in their use.",
    warning:
      "Avoid presenting alchemy as identical to modern chemistry or making exaggerated claims about single inventors.",
    relatedTopics: ["Medicine", "Engineering", "Philosophy of Science"],
    references: ["Add history of chemistry source", "Add Jabirian corpus source placeholder"],
  },
  {
    id: "engineering",
    title: "Engineering",
    category: "Engineering",
    icon: Settings,
    summary: "Mechanical devices, water systems, automata, clocks, irrigation, and practical design.",
    explanation:
      "Engineering in Muslim societies included water-raising machines, clocks, automata, irrigation, architecture, and practical mechanics. It joined design, mathematics, craft, and public benefit.",
    scholar: {
      name: "Al-Jazari",
      period: "1136-1206 CE",
      region: "Diyar Bakr / Artuqid court",
      biography:
        "Al-Jazari was an engineer and inventor known for documenting mechanical devices with illustrations and practical instructions.",
      contribution:
        "He described water clocks, automata, pumps, and mechanical controls that show sophisticated design and craftsmanship.",
      keyWorks: ["The Book of Knowledge of Ingenious Mechanical Devices"],
    },
    timeline: [
      "12th-13th century: Al-Jazari documents mechanical devices in detail.",
      "Water systems, clocks, and automata demonstrate applied mechanics.",
      "Engineering serves public use, timekeeping, irrigation, and design.",
    ],
    whyItMatters:
      "It highlights knowledge as service: solving practical problems and improving communal life.",
    islamicReflection:
      "Beneficial skill and craftsmanship can become service when guided by sincerity, justice, and public benefit.",
    warning:
      "Avoid overstating direct lines from medieval machines to every modern technology; explain influence carefully.",
    relatedTopics: ["Mathematics", "Astronomy", "Chemistry"],
    references: ["Add Al-Jazari source placeholder", "Add history of engineering source"],
  },
  {
    id: "philosophy-of-science",
    title: "Philosophy of Science",
    category: "Methodology",
    icon: Compass,
    summary: "Reasoning, causality, observation, ethics, logic, and the limits of human knowledge.",
    explanation:
      "The philosophy of science asks how we know, how we reason, how we interpret evidence, and how knowledge should be used. Muslim thinkers debated reason, revelation, causality, and ethics in sophisticated ways.",
    scholar: {
      name: "Ibn Rushd",
      period: "1126-1198 CE",
      region: "Cordoba / Marrakesh",
      biography:
        "Ibn Rushd, known in Latin as Averroes, was a jurist, physician, and philosopher. He wrote on law, medicine, logic, and the relationship between reason and revelation.",
      contribution:
        "He argued for disciplined reasoning and wrote influential commentaries that shaped later debates in Islamic and European intellectual history.",
      keyWorks: ["Fasl al-Maqal", "Kulliyat fi al-Tibb", "Commentaries on Aristotle"],
    },
    timeline: [
      "12th century: Ibn Rushd writes on law, philosophy, medicine, and logic.",
      "Reason/revelation debates shape intellectual life across traditions.",
      "Later readers engage his works in Arabic, Hebrew, Latin, and European contexts.",
    ],
    whyItMatters:
      "It reminds learners that facts, interpretation, ethics, and humility all matter in the pursuit of knowledge.",
    islamicReflection:
      "Islam values truthfulness, reflection, and humility. Sound reasoning should serve worship, justice, and moral responsibility.",
    warning:
      "Avoid framing Islamic intellectual history as a simple conflict between science and religion; the reality is richer and more nuanced.",
    relatedTopics: ["Optics", "Medicine", "Ethics"],
    references: ["Add Ibn Rushd source placeholder", "Add Islamic philosophy source"],
  },
];
