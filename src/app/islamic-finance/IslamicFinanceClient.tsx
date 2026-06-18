"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Banknote,
  Briefcase,
  Calculator,
  HandCoins,
  Landmark,
  PiggyBank,
  Scale,
  Search,
  ShieldCheck,
} from "lucide-react";

const foundations = [
  {
    title: "What is Islamic finance?",
    category: "Foundations",
    icon: Landmark,
    text: "Islamic finance seeks fairness, transparency, asset-backed activity, risk sharing, and avoidance of exploitation. Money should not generate guaranteed gain by itself without real economic activity.",
  },
  {
    title: "What is riba?",
    category: "Riba",
    icon: AlertTriangle,
    text: "Riba is commonly understood as unlawful interest or unjustified excess in certain exchanges. Muslims should avoid interest-based lending and consult qualified scholars for detailed rulings.",
  },
  {
    title: "Halal vs haram income",
    category: "Income",
    icon: Scale,
    text: "Income should come from permissible goods and services. Businesses centered on alcohol, gambling, pork, adult entertainment, conventional banking, and similar prohibited activities should be avoided.",
  },
  {
    title: "Halal investing principles",
    category: "Investing",
    icon: Briefcase,
    text: "Screen both business activity and financial ratios. Avoid buy/sell hype, excessive uncertainty, prohibited sectors, and investments you do not understand.",
  },
  {
    title: "Zakat on wealth and investments",
    category: "Zakat",
    icon: HandCoins,
    text: "Zakat may apply to cash, gold, silver, business inventory, and investment holdings depending on ownership, intention, nisab, and hawl. Ask a scholar for your case.",
  },
  {
    title: "Emergency fund planning",
    category: "Planning",
    icon: PiggyBank,
    text: "A halal financial plan should include liquidity for family needs, job loss, medical costs, and debt obligations without relying on interest-based borrowing.",
  },
  {
    title: "Debt management in Islam",
    category: "Debt",
    icon: Banknote,
    text: "Debt should be taken seriously, documented clearly, repaid promptly, and avoided when unnecessary. Prioritize removing high-risk obligations.",
  },
];

const concepts = [
  {
    title: "Murabaha",
    category: "Banking",
    text: "A cost-plus sale where the seller discloses cost and profit margin. It must be structured as a real sale, not a disguised interest loan.",
  },
  {
    title: "Musharakah",
    category: "Banking",
    text: "A partnership where parties contribute capital and share profit by agreement, while losses follow capital contribution.",
  },
  {
    title: "Mudarabah",
    category: "Banking",
    text: "An investment partnership where one party provides capital and another manages. Profit is shared by agreement; financial loss is generally borne by capital provider unless negligence occurs.",
  },
  {
    title: "Sukuk",
    category: "Banking",
    text: "Shariah-compliant certificates linked to ownership or beneficial interest in assets, services, or projects rather than conventional debt interest.",
  },
  {
    title: "Takaful",
    category: "Banking",
    text: "Cooperative risk-sharing insurance model where participants contribute to a mutual pool under Shariah governance.",
  },
];

export default function IslamicFinanceClient() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set([...foundations, ...concepts].map((item) => item.category)))];

  const filteredFoundations = useMemo(() => {
    const term = search.trim().toLowerCase();
    return foundations.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const matchesSearch = !term || [item.title, item.category, item.text].join(" ").toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const filteredConcepts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return concepts.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const matchesSearch = !term || [item.title, item.category, item.text].join(" ").toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  return (
    <>
      <header className="pt-40 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-6">Wealth with accountability</p>
          <h1 className="text-5xl md:text-8xl font-display text-parchment mb-8">
            Islamic <span className="text-gold italic">Finance</span>
          </h1>
          <p className="text-parchment/50 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            A practical educational hub for understanding halal income, riba avoidance, investment screening, zakat, budgeting, and ethical wealth decisions.
          </p>
        </div>
      </header>

      <section className="px-6 pb-28">
        <div className="max-w-7xl mx-auto">
          <div className="glass p-6 md:p-8 rounded-[36px] border-gold/10 mb-8">
            <p className="text-gold font-bold mb-2">Important disclaimer</p>
            <p className="text-parchment/55 leading-relaxed">
              This content is for educational purposes only and is not financial, investment, tax, or religious fatwa advice. Please consult a qualified scholar and financial advisor.
            </p>
          </div>

          <div className="glass p-5 rounded-[32px] border-white/5 mb-12">
            <div className="relative mb-4">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-parchment/20" size={20} />
              <input
                aria-label="Search Islamic finance topics"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search riba, zakat, debt, murabaha, sukuk..."
                className="w-full pl-14 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-parchment placeholder:text-parchment/20 focus:outline-none focus:border-gold/50"
              />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest whitespace-nowrap ${category === item ? "gold-gradient text-ink" : "bg-white/5 text-parchment/50 hover:text-gold"}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
            {filteredFoundations.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="glass p-8 rounded-[36px] border-white/5 hover:border-gold/20 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-gold/10 text-gold flex items-center justify-center mb-6">
                    <Icon size={26} />
                  </div>
                  <p className="text-gold/50 text-[10px] uppercase tracking-[0.25em] font-bold mb-3">{item.category}</p>
                  <h2 className="text-2xl font-display text-parchment mb-4">{item.title}</h2>
                  <p className="text-parchment/55 leading-relaxed">{item.text}</p>
                </article>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2 glass p-8 md:p-12 rounded-[40px] border-white/5">
              <h2 className="text-3xl md:text-4xl font-display text-parchment mb-8">Islamic banking concepts</h2>
              <div className="space-y-5">
                {filteredConcepts.map((concept) => (
                  <div key={concept.title} className="p-5 rounded-2xl bg-white/5">
                    <h3 className="text-gold font-bold mb-2">{concept.title}</h3>
                    <p className="text-parchment/55 leading-relaxed">{concept.text}</p>
                  </div>
                ))}
                {filteredConcepts.length === 0 && (
                  <p className="text-parchment/35">No banking concepts match your filter.</p>
                )}
              </div>
            </div>

            <aside className="space-y-6">
              <Link href="/halal-stocks" className="block glass p-8 rounded-[36px] border-gold/20 hover:bg-gold/5 transition-colors">
                <ShieldCheck className="text-gold mb-5" size={34} />
                <h3 className="text-2xl font-display text-parchment mb-3">Open Halal Stock Screener</h3>
                <p className="text-parchment/45 leading-relaxed">Search demo stocks, review Shariah screening notes, and save a local watchlist.</p>
              </Link>
              <Link href="/zakat" className="block glass p-8 rounded-[36px] border-white/5 hover:bg-gold/5 transition-colors">
                <Calculator className="text-gold mb-5" size={34} />
                <h3 className="text-2xl font-display text-parchment mb-3">Calculate Zakat</h3>
                <p className="text-parchment/45 leading-relaxed">Estimate zakat on cash, gold, silver, investments, and business assets.</p>
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
