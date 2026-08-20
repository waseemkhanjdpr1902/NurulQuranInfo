"use client";

import { useState, useEffect } from "react";
import { BookOpen, Sparkles, Menu, X, LogIn, Book, Landmark, Atom } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Quran", href: "/quran", icon: Book },
    { name: "Hadith", href: "/hadith", icon: BookOpen },
    { name: "Science", href: "/islamic-science", icon: Atom },
    { name: "Features", href: "/#features", icon: Sparkles },
    { name: "Tools", href: "/#tools", icon: Landmark },
  ];

  return (
    <nav aria-label="Main navigation" className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      isScrolled ? "py-3 bg-ink/90 backdrop-blur-2xl border-b border-white/10 shadow-xl shadow-black/10" : "py-5"
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative">
            <div className={`absolute inset-0 gold-gradient blur-lg opacity-20 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="relative w-11 h-11 rounded-2xl gold-gradient flex items-center justify-center text-ink shadow-2xl shadow-gold/30 group-hover:scale-105 transition-transform duration-500 overflow-hidden">
              <Sparkles size={22} />
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
        <div className="hidden lg:flex items-center gap-10">
          <div className="flex items-center gap-10">
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
          
          <div className="flex items-center gap-5">
            <Link href="/login" className="group relative px-7 py-3 rounded-2xl overflow-hidden glass border border-gold/20 flex items-center gap-3">
              <div className="absolute inset-0 bg-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <LogIn size={18} className="text-gold group-hover:text-ink transition-colors relative z-10" />
              <span className="text-gold group-hover:text-ink transition-colors text-xs font-bold uppercase tracking-widest relative z-10">Join</span>
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMobileMenuOpen}
          className="lg:hidden w-11 h-11 glass rounded-2xl flex items-center justify-center text-parchment hover:text-gold transition-colors"
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
            className="lg:hidden absolute top-full left-0 right-0 mx-4 mt-2 glass-card rounded-3xl overflow-hidden shadow-2xl"
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
                    <span className="text-sm font-bold text-parchment/80 uppercase tracking-widest">{link.name}</span>
                  </Link>
                ))}
              </div>
              <div className="h-px bg-white/5" />
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/login" className="w-full py-4 rounded-2xl gold-gradient text-ink font-bold flex items-center justify-center gap-2 shadow-xl shadow-gold/20">
                <LogIn size={20} /> Sign In
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
