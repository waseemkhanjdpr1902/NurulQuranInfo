"use client";

import { Sparkles, Mail, Twitter, Instagram, Heart, Globe, ArrowUpRight } from "lucide-react";
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
      { name: "Hajj Guide", href: "/hajj" },
    ],
    community: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Support Center", href: "/support" },
      { name: "Feedback", href: "/feedback" },
    ]
  };

  return (
    <footer className="bg-ink pt-32 pb-12 px-6 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gold/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-16 mb-24">
          
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
            <div className="flex items-center gap-4">
              <SocialLink icon={<Twitter size={18} />} href="/feedback" label="Send feedback" />
              <SocialLink icon={<Instagram size={18} />} href="/support" label="Open support" />
            </div>
          </div>

          <FooterColumn title="Explore" links={links.explore} />
          <FooterColumn title="Tools" links={links.tools} />
          <FooterColumn title="Community" links={links.community} />

          <div className="lg:col-span-1">
            <div className="glass-card p-8 rounded-[32px] border-gold/10">
              <Mail size={24} className="text-gold mb-6" />
              <h4 className="text-parchment font-bold mb-4 text-sm uppercase tracking-widest">Connect</h4>
              <p className="text-parchment/40 text-[10px] uppercase tracking-widest font-bold leading-relaxed mb-6">
                Receive weekly <br /> insights in your <br /> inbox.
              </p>
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-parchment placeholder:text-parchment/20 focus:outline-none focus:border-gold/50 transition-all"
                />
                <a href="mailto:support@nurulquran.info?subject=NurulQuran%20Newsletter" aria-label="Request newsletter updates" className="absolute right-2 top-2 p-1 text-gold hover:translate-x-1 transition-transform">
                  <ArrowUpRight size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-[10px] uppercase tracking-[0.3em] font-bold text-parchment/20">
          <p>© 2026 NurulQuran. Preserving the light of the faithful.</p>
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

function SocialLink({ icon, href, label }: { icon: React.ReactNode, href: string, label: string }) {
  return (
    <Link 
      href={href} 
      aria-label={label}
      className="w-12 h-12 glass rounded-xl flex items-center justify-center text-parchment/30 hover:text-gold hover:border-gold/20 transition-all duration-300"
    >
      {icon}
    </Link>
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
