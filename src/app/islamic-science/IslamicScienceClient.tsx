"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { BookOpen, MapPin, Search, ShieldAlert, Sparkles } from "lucide-react";
import { Breadcrumbs, RelatedTools, ToolGuidance } from "@/components/tooling";
import { scienceTopics } from "./topics";

const resources = [
  "Study the Quran with reliable tafsir before making scientific claims.",
  "Read history of science from academic sources and primary texts where possible.",
  "Learn biographies of Al-Khwarizmi, Ibn Sina, Al-Razi, Ibn al-Haytham, Al-Biruni, and Al-Battani.",
  "Consult qualified scholars when connecting religious interpretation with modern scientific theories.",
];

export default function IslamicScienceClient() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedTopicId, setSelectedTopicId] = useState(scienceTopics[0].id);
  const detailRef = useRef<HTMLElement | null>(null);

  const categories = ["All", ...Array.from(new Set(scienceTopics.map((topic) => topic.category)))];
  const filteredTopics = useMemo(() => {
    const term = search.trim().toLowerCase();
    return scienceTopics.filter((topic) => {
      const matchesCategory = category === "All" || topic.category === category;
      const matchesSearch =
        !term ||
        [
          topic.title,
          topic.category,
          topic.summary,
          topic.explanation,
          topic.scholar.name,
          topic.scholar.contribution,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const selectedTopic =
    scienceTopics.find((topic) => topic.id === selectedTopicId) || filteredTopics[0] || scienceTopics[0];

  const selectTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    window.setTimeout(() => {
      if (window.innerWidth < 1024) {
        detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  };

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
              This page is educational and historical. It avoids unsupported scientific miracle claims and does not replace scholarly Islamic or academic study.
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

          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.2fr] gap-8 items-start">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-5">
            {filteredTopics.map((topic, index) => {
              const Icon = topic.icon;
              const isSelected = selectedTopic.id === topic.id;
              return (
                <motion.button
                  key={topic.title}
                  type="button"
                  onClick={() => selectTopic(topic.id)}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.05, 0.2) }}
                  viewport={{ once: true }}
                  className={`glass p-6 rounded-[30px] text-left transition-all ${
                    isSelected ? "border-gold/60 bg-gold/10" : "border-white/5 hover:border-gold/20"
                  }`}
                >
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center text-gold shrink-0">
                      <Icon size={26} />
                    </div>
                    <div>
                      <p className="text-gold/60 text-[10px] uppercase tracking-[0.25em] font-bold mb-3">
                        {topic.category}
                      </p>
                      <h2 className="text-2xl font-display text-parchment mb-4">
                        {topic.title}
                      </h2>
                      <p className="text-parchment/55 leading-relaxed">{topic.summary}</p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
            </div>

            <TopicDetail topic={selectedTopic} onSelectTopic={selectTopic} detailRef={detailRef} />
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

function TopicDetail({
  topic,
  onSelectTopic,
  detailRef,
}: {
  topic: (typeof scienceTopics)[number];
  onSelectTopic: (topicId: string) => void;
  detailRef: React.MutableRefObject<HTMLElement | null>;
}) {
  const ScholarIcon = topic.icon;
  const related = topic.relatedTopics
    .map((title) => scienceTopics.find((item) => item.title === title || item.category === title))
    .filter(Boolean) as typeof scienceTopics;

  return (
    <section ref={detailRef} className="glass p-6 md:p-8 rounded-[36px] border-gold/20 scroll-mt-28">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-5 mb-8">
        <div>
          <p className="text-gold/60 text-[10px] uppercase tracking-[0.25em] font-bold mb-3">
            Selected topic
          </p>
          <h2 className="text-4xl md:text-5xl font-display text-parchment mb-4">{topic.title}</h2>
          <p className="text-parchment/55 leading-relaxed">{topic.explanation}</p>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
          <ScholarIcon size={30} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-8">
        <div className="p-6 rounded-[28px] bg-white/5 border border-white/5">
          <div className="flex items-center gap-3 mb-5">
            <BookOpen className="text-gold" size={22} />
            <h3 className="text-2xl font-display text-parchment">Scholar biography</h3>
          </div>
          <h4 className="text-xl font-bold text-gold mb-2">{topic.scholar.name}</h4>
          <div className="flex flex-wrap gap-3 text-xs text-parchment/40 mb-5">
            <span>{topic.scholar.period}</span>
            <span className="flex items-center gap-1"><MapPin size={12} /> {topic.scholar.region}</span>
          </div>
          <p className="text-parchment/60 leading-relaxed mb-5">{topic.scholar.biography}</p>
          <p className="text-parchment/60 leading-relaxed">
            <span className="text-gold font-bold">Contribution:</span> {topic.scholar.contribution}
          </p>
        </div>

        <div className="p-6 rounded-[28px] bg-white/5 border border-white/5">
          <div className="flex items-center gap-3 mb-5">
            <Sparkles className="text-gold" size={22} />
            <h3 className="text-2xl font-display text-parchment">Why this matters</h3>
          </div>
          <p className="text-parchment/60 leading-relaxed mb-6">{topic.whyItMatters}</p>
          <p className="text-gold/60 text-[10px] uppercase tracking-[0.25em] font-bold mb-3">Key works</p>
          <div className="flex flex-wrap gap-2">
            {topic.scholar.keyWorks.map((work) => (
              <span key={work} className="px-3 py-2 rounded-xl bg-gold/10 text-gold text-xs font-bold">
                {work}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        <div className="p-6 rounded-[28px] bg-white/5">
          <p className="text-gold/60 text-[10px] uppercase tracking-[0.25em] font-bold mb-4">Contribution timeline</p>
          <ol className="space-y-4">
            {topic.timeline.map((item, index) => (
              <li key={item} className="flex gap-4 text-parchment/60 leading-relaxed">
                <span className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center shrink-0 text-sm font-bold">
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="p-6 rounded-[28px] bg-white/5">
          <p className="text-gold/60 text-[10px] uppercase tracking-[0.25em] font-bold mb-4">Quranic reflection</p>
          <p className="text-parchment/60 leading-relaxed mb-5">{topic.islamicReflection}</p>
          <div className="flex gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <ShieldAlert className="text-amber-300 shrink-0 mt-1" size={18} />
            <p className="text-amber-100/80 text-sm leading-relaxed">{topic.warning}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="p-6 rounded-[28px] bg-white/5">
          <p className="text-gold/60 text-[10px] uppercase tracking-[0.25em] font-bold mb-4">Related topics</p>
          <div className="flex flex-wrap gap-2">
            {related.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectTopic(item.id)}
                className="px-4 py-2 rounded-xl bg-gold/10 text-gold text-xs font-bold hover:bg-gold hover:text-ink transition-colors"
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-[28px] bg-white/5">
          <p className="text-gold/60 text-[10px] uppercase tracking-[0.25em] font-bold mb-4">Sources / references</p>
          <ul className="space-y-2 text-parchment/55 text-sm leading-relaxed">
            {topic.references.map((reference) => (
              <li key={reference}>- {reference}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
