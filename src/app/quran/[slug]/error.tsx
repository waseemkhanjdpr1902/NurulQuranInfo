"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useUILanguage } from "@/components/UILanguageProvider";
export default function SurahError({ reset }: { reset: () => void }) {
  const { t } = useUILanguage();
  return (
    <main>
      <Navbar />
      <section
        role="alert"
        className="mx-auto max-w-2xl px-5 pb-20 pt-48 text-center"
      >
        <h1 className="text-3xl font-semibold">
          {t(
            "This surah could not load",
            "यह सूरह लोड नहीं हुई",
            "یہ سورت لوڈ نہیں ہوئی",
          )}
        </h1>
        <p className="mt-4">
          {t(
            "Check your connection and retry. You can also return to the surah list.",
            "इंटरनेट कनेक्शन जाँचें और फिर कोशिश करें। आप सूरहों की सूची पर भी लौट सकते हैं।",
            "انٹرنیٹ کنکشن چیک کریں اور دوبارہ کوشش کریں۔ آپ سورتوں کی فہرست پر بھی واپس جا سکتے ہیں۔",
          )}
        </p>
        <button
          onClick={reset}
          className="mt-5 min-h-12 rounded-xl bg-gold px-5 text-white"
        >
          {t("Retry", "फिर कोशिश करें", "دوبارہ کوشش کریں")}
        </button>
        <Link
          href="/quran"
          className="mx-3 mt-5 inline-flex min-h-12 items-center rounded-xl border border-gold/30 px-5"
        >
          {t("All surahs", "सभी सूरहें", "تمام سورتیں")}
        </Link>
      </section>
      <Footer />
    </main>
  );
}
