"use client";

import {
  LanguageSelector,
  useUILanguage,
} from "@/components/UILanguageProvider";
import { PrayerBanner } from "@/components/PrayerTimesProvider";
import { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Sparkles,
  Menu,
  X,
  LogIn,
  Book,
  Landmark,
  Compass,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { createClient, isSupabaseConfigured } from "@/services/supabase";

export default function Navbar() {
  const { t } = useUILanguage();
  const navigation = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = navigation.current;
    if (!element) return;
    const update = () => document.documentElement.style.setProperty("--navigation-height", `${element.getBoundingClientRect().height}px`);
    update();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    supabase.auth
      .getSession()
      .then(({ data }) => setIsAuthenticated(Boolean(data.session)));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const navLinks = [
    { name: t("Dawah", "दावत", "دعوت"), href: "/dawah", icon: Sparkles },
    { name: t("Quick guide", "रहनुमाई", "رہنمائی"), href: "/#quick-guide", icon: Compass },
    { name: t("Quran", "क़ुरआन", "قرآن"), href: "/quran", icon: Book },
    {
      name: t("Topics", "विषय", "موضوعات"),
      href: "/quran-topics",
      icon: Compass,
    },
    {
      name: t("Reflect", "चिंतन", "غور و فکر"),
      href: "/quran-reflection",
      icon: Sparkles,
    },
    {
      name: t("Journey", "मेरी प्रगति", "میری پیش رفت"),
      href: "/my-quran-journey",
      icon: BookOpen,
    },
    { name: t("Hadith", "हदीस", "حدیث"), href: "/hadith", icon: BookOpen },
    {
      name: t("Tools", "उपयोगी टूल", "کارآمد ٹول"),
      href: "/#tools",
      icon: Landmark,
    },
  ];

  return (
    <nav
      ref={navigation}
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled
          ? "pb-3 bg-ink/90 backdrop-blur-2xl border-b border-white/10 shadow-xl shadow-black/10"
          : "pb-5 bg-ink/95"
      }`}
    >
      <PrayerBanner />
      <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-3 flex items-center justify-between">
        <Link
          href="/"
          aria-label="NurulQuran home"
          className="group flex shrink-0 items-center rounded-xl bg-white px-2 py-2 sm:px-3 shadow-sm transition-transform hover:scale-[1.02]"
        >
          <Image
            src="/nurulquran-logo.png"
            alt="NurulQuran — nurulquran.info"
            width={2172}
            height={724}
            priority
            sizes="(max-width: 639px) calc(100vw - 184px), (max-width: 1023px) 220px, 230px"
            className="h-auto w-[min(180px,calc(100vw-184px))] sm:w-[220px] lg:w-[230px]"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden xl:flex items-center gap-4">
          <div className="flex items-center gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="group flex flex-col items-center gap-1"
              >
                <span className="text-parchment/60 group-hover:text-gold transition-colors text-xs font-bold uppercase tracking-widest">
                  {link.name}
                </span>
                <div className="h-0.5 w-0 bg-gold group-hover:w-full transition-all duration-300 rounded-full" />
              </Link>
            ))}
          </div>

          <div className="h-8 w-px bg-white/10" />

          <div className="flex items-center gap-5">
            <Link
              href={isAuthenticated ? "/dashboard" : "/login"}
              className="group relative px-4 py-3 rounded-2xl overflow-hidden glass border border-gold/20 flex items-center gap-3"
            >
              <div className="absolute inset-0 bg-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <LogIn
                size={18}
                className="text-gold group-hover:text-ink transition-colors relative z-10"
              />
              <span className="text-gold group-hover:text-ink transition-colors text-xs font-bold uppercase tracking-widest relative z-10">
                {isAuthenticated
                  ? t("Dashboard", "डैशबोर्ड", "ڈیش بورڈ")
                  : t("Sign in", "लॉगिन", "لاگ اِن")}
              </span>
            </Link>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 [&_select]:max-w-[84px] sm:[&_select]:max-w-[105px]">
          <LanguageSelector />
          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={
              isMobileMenuOpen
                ? t("Close menu", "मेनू बंद करें", "مینو بند کریں")
                : t("Open menu", "मेनू खोलें", "مینو کھولیں")
            }
            aria-expanded={isMobileMenuOpen}
            className="xl:hidden w-11 h-11 glass rounded-2xl flex items-center justify-center text-parchment hover:text-gold transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="xl:hidden absolute top-full left-0 right-0 mx-4 mt-2 glass-card rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-5 sm:p-7 space-y-5 max-h-[calc(100svh-7rem)] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex flex-col gap-3 p-4 rounded-2xl bg-white/5 hover:bg-gold/10 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-10 h-10 rounded-xl glass border border-gold/20 flex items-center justify-center text-gold">
                      <link.icon size={20} />
                    </div>
                    <span className="text-sm font-bold text-parchment/80 uppercase tracking-widest">
                      {link.name}
                    </span>
                  </Link>
                ))}
              </div>
              <div className="h-px bg-white/5" />
              <Link
                onClick={() => setIsMobileMenuOpen(false)}
                href={isAuthenticated ? "/dashboard" : "/login"}
                className="w-full py-4 rounded-2xl gold-gradient text-ink font-bold flex items-center justify-center gap-2 shadow-xl shadow-gold/20"
              >
                <LogIn size={20} />{" "}
                {isAuthenticated
                  ? t("Open Dashboard", "डैशबोर्ड खोलें", "ڈیش بورڈ کھولیں")
                  : t("Sign In", "लॉगिन", "لاگ اِن")}
              </Link>
              <nav aria-label={t("Privacy and support", "निजता और सहायता", "رازداری اور مدد")} className="grid grid-cols-2 gap-3 border-t border-gold/20 pt-4 text-sm font-semibold">
                <Link onClick={() => setIsMobileMenuOpen(false)} className="rounded-xl border border-gold/20 p-3 underline" href="/privacy">{t("Privacy & choices", "निजता और विकल्प", "رازداری اور اختیارات")}</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} className="rounded-xl border border-gold/20 p-3 underline" href="/delete-account">{t("Delete account / data", "खाता / डेटा हटाएँ", "اکاؤنٹ / ڈیٹا حذف کریں")}</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} className="rounded-xl border border-gold/20 p-3 underline" href="/contact">{t("Contact support", "सहायता से संपर्क", "سپورٹ سے رابطہ")}</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} className="rounded-xl border border-gold/20 p-3 underline" href="/terms">{t("Terms of use", "इस्तेमाल की शर्तें", "استعمال کی شرائط")}</Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
