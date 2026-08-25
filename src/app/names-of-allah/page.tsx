"use client";

import { motion } from "motion/react";
import { Search } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ALLAH_NAMES } from "@/data/names-of-allah";

export default function NamesOfAllahPage() {
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();
  const filteredNames = ALLAH_NAMES.filter(n =>
    n.en.toLowerCase().includes(query) ||
    n.mean.toLowerCase().includes(query) ||
    n.ar.includes(search.trim()) ||
    String(n.number) === query
  );

  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      
      <div className="pt-40 pb-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold font-medium tracking-[0.4em] uppercase text-xs mb-6 block"
          >
            Divine Attributes
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-display text-parchment mb-8 leading-tight"
          >
            99 Names of <br/><span className="text-gold italic">Allah</span>
          </motion.h1>
          <p className="text-parchment/40 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            &quot;To Allah belong the best names, so invoke Him by them.&quot; — Al-A&apos;raf 180
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-20">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-parchment/20" size={20} />
            <input 
              type="text" 
              placeholder="Search by Name or Meaning..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-16 pr-8 py-5 glass rounded-[32px] text-parchment placeholder:text-parchment/20 focus:outline-none focus:border-gold/50 transition-colors shadow-2xl"
            />
          </div>
          <p className="mt-4 text-center text-sm text-parchment/60">
            Showing {filteredNames.length} of 99 names
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredNames.map((name, i) => (
            <motion.div
              key={name.number}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              viewport={{ once: true }}
              className="glass p-10 rounded-[40px] border-white/5 hover:border-gold/30 hover:bg-white/5 transition-all group flex flex-col items-center text-center"
            >
              <span className="mb-5 flex h-8 w-8 items-center justify-center rounded-full bg-gold/10 text-xs font-bold text-gold">
                {name.number}
              </span>
              <div className="text-4xl md:text-5xl font-arabic text-gold mb-6 group-hover:scale-110 transition-transform duration-500">
                {name.ar}
              </div>
              <h3 className="text-parchment font-bold mb-2 tracking-tight">{name.en}</h3>
              <p className="text-parchment/40 text-[10px] uppercase font-bold tracking-[0.2em]">{name.mean}</p>
            </motion.div>
          ))}
        </div>
        {filteredNames.length === 0 ? (
          <div className="glass rounded-3xl p-10 text-center text-parchment/60">
            No name matched your search. Try a name, meaning, Arabic text, or number.
          </div>
        ) : null}
      </div>

      <Footer />
    </main>
  );
}
