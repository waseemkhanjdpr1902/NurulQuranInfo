"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Atom,
  BookOpen,
  Compass,
  Eye,
  FlaskConical,
  Globe,
  Microscope,
  Search,
  ShieldAlert,
  Star,
} from "lucide-react";
import { Breadcrumbs, RelatedTools, ToolGuidance } from "@/components/tooling";

const topics = [
  {
    title: "Islam and the pursuit of knowledge",
    category: "Foundations",
    icon: BookOpen,
    summary:
      "Islamic learning joins revelation, reason, observation, and humility. The Quran repeatedly invites people to reflect on creation as signs of Allah.",
  },
  {
    title: "Quranic encouragement to observe",
    category: "Quranic Reflection",
    icon: Star,
    summary:
      "Verses call believers to look at the heavens, earth, life, history, and the self. Reflection should deepen faith and responsibility, not become sensational claims.",
  },
  {
    title: "Astronomy and Islamic civilization",
    category: "Astronomy",
    icon: Atom,
    summary:
      "Muslim astronomers improved star catalogues, observatories, calendar calculations, navigation, and prayer-time/qibla determination.",
  },
  {
    title: "Medicine and Muslim scholars",
    category: "Medicine",
    icon: FlaskConical,
    summary:
      "Scholars such as Ibn Sina and Al-Razi helped organize clinical observation, hospitals, pharmacology, and medical writing across centuries.",
  },
  {
    title: "Mathematics and algebra",
    category: "Mathematics",
    icon: Microscope,
    summary:
      "Al-Khwarizmi's works influenced algebra, algorithms, decimal notation, inheritance calculations, astronomy, trade, and engineering.",
  },
  {
    title: "Optics and Ibn al-Haytham",
    category: "Optics",
    icon: Eye,
    summary:
      "Ibn al-Haytham's experimental approach to light and vision shaped optics and scientific method discussions in later traditions.",
  },
  {
    title: "Geography and navigation",
    category: "Geography",
    icon: Globe,
    summary:
      "Geographers and navigators mapped routes, seas, climates, trade networks, and qibla directions using mathematics and field observation.",
  },
  {
    title: "Ethics of knowledge",
    category: "Ethics",
    icon: Compass,
    summary:
      "Knowledge should produce humility, justice, service, environmental care, and protection from harm. Not every possible use of science is ethical.",
  },
  {
    title: "Avoiding fake miracle claims",
    category: "Methodology",
    icon: ShieldAlert,
    summary:
      "This section avoids unsupported scientific miracle claims. Strong faith does not require weak evidence, forced interpretations, or viral misinformation.",
  },
];

const resources = [
  "Study the Quran with reliable tafsir before making scientific claims.",
  "Read history of science from academic sources and primary texts where possible.",
  "Learn biographies of Al-Khwarizmi, Ibn Sina, Al-Razi, Ibn al-Haytham, Al-Biruni, and Al-Battani.",
  "Consult qualified scholars when connecting religious interpretation with modern scientific theories.",
];

export default function IslamicScienceClient() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(topics.map((topic) => topic.category)))];
  const filteredTopics = useMemo(() => {
    const term = search.trim().toLowerCase();
    return topics.filter((topic) => {
      const matchesCategory = category === "All" || topic.category === category;
      const matchesSearch =
        !term ||
        [topic.title, topic.category, topic.summary].join(" ").toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  return (
    <>
      <header className="pt-40 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "Islamic Science" }]} />
          <span className="text-gold font-medium tracking-[0.4em] uppercase text-xs mb-6 block">
            Knowledge with humility
          </span>
          <h1 className="text-5xl md:text-8xl font-display text-parchment mb-8 leading-tight">
            Islamic <span className="text-gold italic">Science</span>
          </h1>
          <p className="text-parchment/50 text-lg md:text-xl font-light max-w-3xl mx-auto leading-relaxed">
            Explore how Muslim scholars studied creation, served society, and connected observation with worship, ethics, and intellectual honesty.
          </p>
        </motion.div>
      </header>

      <section className="px-6 pb-28">
        <div className="max-w-7xl mx-auto">
          <div className="glass p-6 md:p-8 rounded-[36px] border-gold/10 mb-12">
            <p className="text-gold font-bold mb-2">Educational disclaimer</p>
            <p className="text-parchment/55 leading-relaxed">
              This section is educational and should avoid unsupported scientific miracle claims.
            </p>
          </div>

          <div className="flex flex-col gap-5 mb-12">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-parchment/20" size={20} />
              <input
                aria-label="Search Islamic science topics"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search astronomy, medicine, algebra, optics, ethics..."
                className="w-full pl-16 pr-6 py-5 glass rounded-[32px] text-parchment placeholder:text-parchment/20 focus:outline-none focus:border-gold/50"
              />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                    category === item ? "gold-gradient text-ink" : "glass text-parchment/50 hover:text-gold"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTopics.map((topic, index) => {
              const Icon = topic.icon;
              return (
                <motion.article
                  key={topic.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.05, 0.2) }}
                  viewport={{ once: true }}
                  className="glass p-8 rounded-[36px] border-white/5 hover:border-gold/20 transition-all"
                >
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center text-gold shrink-0">
                      <Icon size={26} />
                    </div>
                    <div>
                      <p className="text-gold/60 text-[10px] uppercase tracking-[0.25em] font-bold mb-3">
                        {topic.category}
                      </p>
                      <h2 className="text-2xl md:text-3xl font-display text-parchment mb-4">
                        {topic.title}
                      </h2>
                      <p className="text-parchment/55 leading-relaxed">{topic.summary}</p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {filteredTopics.length === 0 && (
            <div className="text-center py-20 text-parchment/30 font-display text-2xl">
              No science topics match your search.
            </div>
          )}

          <div className="mt-16 glass p-8 md:p-12 rounded-[40px] border-white/5">
            <h2 className="text-3xl md:text-4xl font-display text-parchment mb-8">
              Recommended learning resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((resource) => (
                <div key={resource} className="p-5 rounded-2xl bg-white/5 text-parchment/60 leading-relaxed">
                  {resource}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <ToolGuidance
        title="Study science with humility"
        what="Islamic Science introduces scholarly contributions, Quranic encouragement to observe creation, and the ethics of knowledge while avoiding unsupported miracle claims."
        how={[
          "Search or filter by topic, such as astronomy, medicine, algebra, optics, or ethics.",
          "Use the resource notes to continue with reliable academic and Islamic sources.",
          "Avoid viral claims that force modern science into verses without sound scholarship.",
        ]}
      />
      <RelatedTools currentHref="/islamic-science" />
    </>
  );
}
