"use client";

import { Sparkles, Heart, Globe } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const links = {
    explore: [
      { name: "Digital Quran", href: "/quran" },
      { name: "Hadith Library", href: "/hadith" },
      { name: "Tafseer & AI", href: "/tafseer" },
      { name: "Islamic Science", href: "/islamic-science" },
    ],
    tools: [
      { name: "Supplications", href: "/dua" },
      { name: "Tasbih Counter", href: "/tasbih" },
      { name: "Zakat Calculator", href: "/zakat" },
      { name: "Prayer Times", href: "/prayer-times" },
    ],
    learn: [
      { name: "Names of Allah", href: "/names-of-allah" },
      { name: "Spiritual Guide", href: "/spiritual-guide" },
      { name: "AI Dawah", href: "/dawah" },
      { name: "Dashboard", href: "/dashboard" },
    ]
  };

  return (
    <footer className="bg-ink pt-20 md:pt-28 pb-10 px-6 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gold/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16 mb-16 md:mb-20">
          
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-4 mb-8 group">
              <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center text-ink shadow-lg shadow-gold/20">
                <Sparkles size={20} />
              </div>
              <span className="text-2xl font-display font-bold text-parchment tracking-tight">Nurul<span className="text-gold">Quran</span></span>
            </Link>
            <p className="text-parchment/40 text-sm leading-relaxed mb-10 max-w-sm">
              Nurturing the modern spiritual journey with authentic wisdom and cutting-edge technology. Built for the global Ummah.
            </p>
            <Link href="/quran" className="inline-flex items-center rounded-xl border border-gold/20 px-5 py-3 text-xs font-bold uppercase tracking-widest text-gold hover:bg-gold/10 transition-colors">Begin reading</Link>
          </div>

          <FooterColumn title="Explore" links={links.explore} />
          <FooterColumn title="Tools" links={links.tools} />
          <FooterColumn title="Learn" links={links.learn} />
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-[10px] uppercase tracking-[0.3em] font-bold text-parchment/20">
          <p>© 2026 NurulQuran. Read, reflect and remember.</p>
          <div className="flex items-center gap-2 text-gold/30">
            Made with <Heart size={10} className="fill-gold animate-pulse" /> for the Ummah
          </div>
          <div className="flex items-center gap-3">
             <Globe size={12} className="text-gold/20" /> 
             <span>Global / English</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string, links: { name: string, href: string }[] }) {
  return (
    <div className="lg:col-span-1">
      <h4 className="text-parchment font-bold mb-8 uppercase tracking-[0.3em] text-xs pb-4 border-b border-white/5 inline-block">{title}</h4>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.name}>
            <Link 
              href={link.href} 
              className="text-parchment/40 hover:text-gold transition-all flex items-center group text-sm font-light"
            >
              <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
