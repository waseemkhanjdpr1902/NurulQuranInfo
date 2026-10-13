"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { useUILanguage } from "@/components/UILanguageProvider";
import { fetchWithTimeout } from "@/lib/fetch-with-timeout";
import { Search, Loader2 } from "lucide-react";
import QuranCard from "@/components/QuranCard/QuranCard";

export default function SurahGrid({ limit }: { limit?: number }) {
  const { t, rtl } = useUILanguage();
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [search, setSearch] = useState("");
  const [surahs, setSurahs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const fetchSurahs = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetchWithTimeout(
          "https://api.alquran.cloud/v1/surah",
          { signal: controller.signal },
        );

        if (!res.ok) {
          throw new Error(`Server returned ${res.status}: Not Found`);
        }

        const data = await res.json();
        if (data.data && Array.isArray(data.data)) {
          setSurahs(
            data.data.map((c: any) => ({
              number: c.number,
              name: c.name,
              englishName: c.englishName,
              englishNameTranslation: c.englishNameTranslation,
              numberOfAyahs: c.numberOfAyahs,
              revelationType: c.revelationType,
              slug: c.englishName
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, ""),
            })),
          );
        } else {
          throw new Error("Invalid data format from API");
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        setError(true);
        console.error("Error fetching surahs:", error);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    fetchSurahs();
    return () => controller.abort();
  }, [retry]);

  const filteredSurahs = surahs.filter(
    (s) =>
      s.englishName.toLowerCase().includes(search.toLowerCase()) ||
      s.number.toString() === search ||
      s.name.includes(search),
  );

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Loader2 className="text-gold animate-spin" size={32} />
        <p role="status">
          {t(
            "Loading surahs…",
            "सूरहें लोड हो रही हैं…",
            "سورتیں لوڈ ہو رہی ہیں…",
          )}
        </p>
      </div>
    );
  }

  if (error)
    return (
      <div
        role="alert"
        className="mx-auto max-w-3xl rounded-2xl border border-gold/25 bg-white p-6 text-center"
      >
        <p>
          {t(
            "The surah list could not load. Check your connection and try again.",
            "सूरहों की सूची लोड नहीं हुई। इंटरनेट कनेक्शन जाँचें और फिर कोशिश करें।",
            "سورتوں کی فہرست لوڈ نہیں ہوئی۔ انٹرنیٹ کنکشن چیک کریں اور دوبارہ کوشش کریں۔",
          )}
        </p>
        <button
          className="mt-4 min-h-11 rounded-xl bg-gold px-5 text-white"
          onClick={() => setRetry((n) => n + 1)}
        >
          {t("Retry", "फिर कोशिश करें", "دوبارہ کوشش کریں")}
        </button>
      </div>
    );
  const visible =
    limit && !search.trim() ? filteredSurahs.slice(0, limit) : filteredSurahs;
  return (
    <section
      id="surahs"
      dir={rtl ? "rtl" : "ltr"}
      className="py-12 px-6 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <h2 className="text-4xl md:text-5xl font-display text-parchment mb-4">
            {t("Browse surahs", "सूरहें देखें", "سورتیں دیکھیں")}
          </h2>
          <p className="text-parchment/50 max-w-md">
            {t(
              "Choose from all 114 surahs with translations and recitation.",
              "अनुवाद और तिलावत के साथ सभी 114 सूरहों में से चुनें।",
              "ترجمے اور تلاوت کے ساتھ تمام 114 سورتوں میں سے منتخب کریں۔",
            )}
          </p>
        </div>

        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-parchment/30"
            size={20}
          />
          <input
            type="text"
            aria-label={t("Search surahs", "सूरह खोजें", "سورت تلاش کریں")}
            placeholder={t(
              "Search by name or number…",
              "नाम या संख्या से खोजें…",
              "نام یا نمبر سے تلاش کریں…",
            )}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 glass rounded-2xl text-parchment placeholder:text-parchment/20 focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map((surah) => (
          <QuranCard key={surah.number} surah={surah} />
        ))}
      </div>

      {limit && !search.trim() && (
        <Link
          href="/quran"
          className="mt-6 inline-flex min-h-12 items-center rounded-xl border border-gold/30 bg-white px-5 font-semibold text-gold"
        >
          {t(
            "View all 114 surahs",
            "सभी 114 सूरहें देखें",
            "تمام 114 سورتیں دیکھیں",
          )}
        </Link>
      )}
      {filteredSurahs.length === 0 && (
        <div className="text-center py-20">
          <p className="text-parchment/30 text-xl font-display italic">
            {t(
              "No surahs match. Try the surah number or its English/Arabic name.",
              "कोई सूरह नहीं मिली। सूरह की संख्या या अंग्रेज़ी/अरबी नाम लिखें।",
              "کوئی سورت نہیں ملی۔ سورت کا نمبر یا انگریزی/عربی نام لکھیں۔",
            )}
          </p>
        </div>
      )}
    </section>
  );
}
