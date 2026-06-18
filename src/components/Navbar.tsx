"use client";

import { useState, useEffect } from "react";
import { Search, BookOpen, Heart, Sparkles, Menu, X, LayoutDashboard, LogIn, Book, TrendingUp, Landmark, Clock, MapPin, Globe, Compass, Atom } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const SEARCH_ITEMS = [
  { title: "Tools & Features", href: "/tools", keywords: "all tools features islamic utilities" },
  { title: "Quran Explorer", href: "/quran", keywords: "surah ayah recitation audio tafsir" },
  { title: "Hadith Library", href: "/hadith", keywords: "sunnah bukhari muslim tradition" },
  { title: "Dua & Adhkar", href: "/dua", keywords: "supplication morning evening protection" },
  { title: "Prayer Times", href: "/prayer-times", keywords: "salah qibla compass location" },
  { title: "Tasbih Counter", href: "/tasbih", keywords: "dhikr counter remembrance" },
  { title: "99 Names of Allah", href: "/names-of-allah", keywords: "asmaul husna divine names" },
  { title: "Tafseer", href: "/tafseer", keywords: "ibn kathir explanation study" },
  { title: "Zakat Calculator", href: "/zakat", keywords: "charity calculation nisab" },
  { title: "Islamic Finance", href: "/islamic-finance", keywords: "riba halal investing zakat banking sukuk takaful" },
  { title: "Halal Stocks", href: "/halal-stocks", keywords: "stock screener shariah watchlist investing" },
  { title: "Islamic Calendar", href: "/islamic-calendar", keywords: "hijri gregorian islamic dates events" },
  { title: "Daily Verse", href: "/daily-verse", keywords: "quran ayah reflection daily verse" },
  { title: "Daily Hadith", href: "/daily-hadith", keywords: "hadith sunnah daily reflection" },
  { title: "Dawah", href: "/dawah", keywords: "islam questions outreach" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [recentPages, setRecentPages] = useState<typeof SEARCH_ITEMS>([]);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const stored = JSON.parse(window.localStorage.getItem("nurulquran.recentPages") || "[]") as typeof SEARCH_ITEMS;
    const current = SEARCH_ITEMS.find((item) => item.href === pathname);
    const updated = current
      ? [current, ...stored.filter((item) => item.href !== current.href)].slice(0, 5)
      : stored;
    setRecentPages(updated);
    window.localStorage.setItem("nurulquran.recentPages", JSON.stringify(updated));
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };

  const searchResults = SEARCH_ITEMS.filter((item) =>
    [item.title, item.keywords].join(" ").toLowerCase().includes(search.trim().toLowerCase())
  );

  const navLinks = [
    { name: "Tools", href: "/tools", icon: Landmark },
    { name: "Quran", href: "/quran", icon: Book },
    { name: "Duas", href: "/dua", icon: Heart },
    { name: "Finance", href: "/islamic-finance", icon: Landmark },
    { name: "Zakat", href: "/zakat", icon: TrendingUp },
    { name: "Tasbih", href: "/tasbih", icon: Sparkles },
    { name: "Prayer Times", href: "/prayer-times", icon: Clock },
  ];

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Account";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
      isScrolled ? "py-4 bg-ink/70 backdrop-blur-3xl border-b border-white/5" : "py-8"
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative">
            <div className={`absolute inset-0 gold-gradient blur-lg opacity-20 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="relative w-12 h-12 rounded-2xl gold-gradient flex items-center justify-center text-ink shadow-2xl shadow-gold/30 group-hover:scale-110 transition-transform duration-500 overflow-hidden">
              <Sparkles size={24} />
              <div className="absolute inset-x-0 bottom-0 h-1 bg-ink/20" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-display font-bold text-parchment leading-none tracking-tight">
              Nurul<span className="text-gold">Quran</span>
            </span>
            <span className="text-[8px] uppercase tracking-[0.4em] text-gold/40 font-bold mt-1">Light for the soul</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-5 xl:gap-7">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="group flex flex-col items-center gap-1"
              >
                <span className="text-parchment/60 group-hover:text-gold transition-colors text-[10px] font-bold uppercase tracking-widest">
                  {link.name}
                </span>
                <div className="h-0.5 w-0 bg-gold group-hover:w-full transition-all duration-300 rounded-full" />
              </Link>
            ))}
          </div>
          
          <div className="h-8 w-px bg-white/10" />
          
          <div className="flex items-center gap-6">
            <button
              aria-label="Open global search"
              onClick={() => setIsSearchOpen(true)}
              className="text-parchment/40 hover:text-gold transition-colors"
            >
              <Search size={22} strokeWidth={1.5} />
            </button>
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="group relative px-5 py-3 rounded-2xl overflow-hidden glass border border-gold/20 flex items-center gap-3">
                  <LayoutDashboard size={18} className="text-gold relative z-10" />
                  <span className="text-gold text-xs font-bold uppercase tracking-widest relative z-10 max-w-28 truncate">{displayName}</span>
                </Link>
                <button onClick={handleLogout} className="text-parchment/40 hover:text-red-400 transition-colors text-[10px] font-bold uppercase tracking-widest">
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="group relative px-7 py-3 rounded-2xl overflow-hidden glass border border-gold/20 flex items-center gap-3">
                <div className="absolute inset-0 bg-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <LogIn size={18} className="text-gold group-hover:text-ink transition-colors relative z-10" />
                <span className="text-gold group-hover:text-ink transition-colors text-xs font-bold uppercase tracking-widest relative z-10">Join</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
          className="lg:hidden w-12 h-12 glass rounded-2xl flex items-center justify-center text-parchment hover:text-gold transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="lg:hidden absolute top-full left-0 right-0 m-6 mt-2 glass-card rounded-[40px] overflow-hidden shadow-2xl"
          >
            <div className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className="flex flex-col gap-3 p-6 rounded-3xl bg-white/5 hover:bg-gold/10 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-10 h-10 rounded-xl glass border border-gold/20 flex items-center justify-center text-gold">
                      <link.icon size={20} />
                    </div>
                    <span className="text-sm font-bold text-parchment/80 uppercase tracking-widest">{link.name}</span>
                  </Link>
                ))}
              </div>
              <div className="h-px bg-white/5" />
              {user ? (
                <div className="space-y-4">
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-5 rounded-3xl gold-gradient text-ink font-bold flex items-center justify-center gap-2 shadow-xl shadow-gold/20">
                    <LayoutDashboard size={20} /> {displayName}
                  </Link>
                  <button onClick={handleLogout} className="w-full py-4 rounded-3xl glass text-red-400 font-bold">
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-5 rounded-3xl gold-gradient text-ink font-bold flex items-center justify-center gap-2 shadow-xl shadow-gold/20">
                  <LogIn size={20} /> Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[120] flex items-start justify-center px-6 pt-28">
            <motion.button
              aria-label="Close global search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              className="relative w-full max-w-2xl glass-card rounded-[36px] p-6 shadow-2xl"
            >
              <div className="relative mb-6">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-parchment/20" size={20} />
                <input
                  autoFocus
                  aria-label="Search NurulQuran"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search Quran, duas, prayer times, tasbih..."
                  className="w-full pl-14 pr-12 py-5 bg-white/5 border border-white/10 rounded-3xl text-parchment placeholder:text-parchment/20 focus:outline-none focus:border-gold/50"
                />
                <button
                  aria-label="Close search"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-parchment/30 hover:text-gold"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3">
                {(search.trim() ? searchResults : recentPages.length ? recentPages : SEARCH_ITEMS.slice(0, 5)).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSearchOpen(false)}
                    className="block p-4 rounded-2xl bg-white/5 hover:bg-gold/10 transition-colors"
                  >
                    <span className="text-parchment font-bold">{item.title}</span>
                    <span className="block text-parchment/30 text-xs mt-1">{item.href}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}
