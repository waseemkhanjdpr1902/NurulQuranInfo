"use client";

import { useUILanguage } from "@/components/UILanguageProvider";
import Link from "next/link";
import { motion } from "motion/react";
import { Play, ArrowRight, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

interface QuranCardProps {
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
    slug: string;
  };
}

export default function QuranCard({ surah }: QuranCardProps) {
  const { t } = useUILanguage();
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/quran/${surah.slug}`);
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/quran/${surah.slug}?autoplay=true`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={handleCardClick}
      className="group block p-6 glass rounded-3xl hover:border-gold/30 transition-all hover:translate-y-[-4px] cursor-pointer"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gold font-bold group-hover:bg-gold group-hover:text-ink transition-colors">
            {surah.number}
          </div>
          <button
            onClick={handlePlayClick}
            className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-ink transition-all"
            title={t("Listen now", "अभी सुनें", "ابھی سنیں")}
            aria-label={`${t("Listen to", "सुनें", "سنیں")} ${surah.englishName}`}
          >
            <Play size={16} className="ml-0.5" />
          </button>
        </div>
        <span className="text-gold font-arabic text-2xl">{surah.name}</span>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-display text-parchment group-hover:text-gold transition-colors">
          <Link
            href={`/quran/${surah.slug}`}
            onClick={(e) => e.stopPropagation()}
          >
            {surah.englishName}
          </Link>
        </h3>
        <p className="text-parchment/40 text-sm uppercase tracking-widest">
          {surah.englishNameTranslation}
        </p>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-white/5">
        <div className="flex gap-4 text-[10px] uppercase tracking-widest text-parchment/30">
          <span>
            {surah.numberOfAyahs} {t("Ayahs", "आयतें", "آیات")}
          </span>
          <span>•</span>
          <span>{surah.revelationType}</span>
        </div>
        <ArrowRight
          size={18}
          className="text-gold opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0"
        />
      </div>
    </motion.div>
  );
}
