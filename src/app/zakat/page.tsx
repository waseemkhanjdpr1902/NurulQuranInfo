"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Calculator, Coins, Landmark, Briefcase, Info, AlertCircle, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Breadcrumbs, RelatedTools, ToolGuidance } from "@/components/tooling";

export default function ZakatCalculatorPage() {
  const [goldGrams, setGoldGrams] = useState(0);
  const [silverGrams, setSilverGrams] = useState(0);
  const [goldPrice, setGoldPrice] = useState(65); // Price per gram in USD (example)
  const [silverPrice, setSilverPrice] = useState(0.8); // Price per gram in USD (example)
  const [cash, setCash] = useState(0);
  const [investments, setInvestments] = useState(0);
  const [businessAssets, setBusinessAssets] = useState(0);
  const [liabilities, setLiabilities] = useState(0);

  const goldValue = goldGrams * goldPrice;
  const silverValue = silverGrams * silverPrice;
  const totalAssets = goldValue + silverValue + cash + investments + businessAssets;
  const netAssets = Math.max(0, totalAssets - liabilities);
  const zakatDue = netAssets * 0.025;

  // Nisab values
  const nisabGold = 87.48 * goldPrice;
  const nisabSilver = 612.36 * silverPrice;
  const isZakatObligatory = netAssets >= nisabGold || netAssets >= nisabSilver;

  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      
      <div className="pt-40 pb-24 px-6 max-w-7xl mx-auto">
        <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "Zakat Calculator" }]} />
        {/* Header */}
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold font-medium tracking-[0.4em] uppercase text-xs mb-6 block"
          >
            Pillar of Islam
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-display text-parchment mb-8 leading-tight"
          >
            Zakat <span className="text-gold italic">Calculator</span>
          </motion.h1>
          <p className="text-parchment/40 text-lg max-w-2xl mx-auto leading-relaxed font-light">
            Calculate your Zakat accurately based on your assets and liabilities. 
            Fulfill your obligation with ease and transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Inputs */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass p-8 md:p-12 rounded-[40px] border-white/5">
              <h3 className="text-2xl font-display text-parchment mb-8 flex items-center gap-3">
                <Coins className="text-gold" /> Assets
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputField 
                  label="Gold (Grams)" 
                  value={goldGrams} 
                  onChange={setGoldGrams} 
                  icon={<Coins size={18} />}
                  description={`Current Price: $${goldPrice}/g`}
                  unit="g"
                />
                <InputField 
                  label="Silver (Grams)" 
                  value={silverGrams} 
                  onChange={setSilverGrams} 
                  icon={<Coins size={18} />}
                  description={`Current Price: $${silverPrice}/g`}
                  unit="g"
                />
                <InputField 
                  label="Cash & Savings" 
                  value={cash} 
                  onChange={setCash} 
                  icon={<Landmark size={18} />}
                  description="Cash in hand and bank accounts"
                />
                <InputField 
                  label="Investments" 
                  value={investments} 
                  onChange={setInvestments} 
                  icon={<Briefcase size={18} />}
                  description="Stocks, shares, and other investments"
                />
                <div className="md:col-span-2">
                  <InputField 
                    label="Business Assets" 
                    value={businessAssets} 
                    onChange={setBusinessAssets} 
                    icon={<Briefcase size={18} />}
                    description="Value of stock for sale and business cash"
                  />
                </div>
              </div>
            </div>

            <div className="glass p-8 md:p-12 rounded-[40px] border-white/5">
              <h3 className="text-2xl font-display text-parchment mb-8 flex items-center gap-3">
                <AlertCircle className="text-red-500" /> Liabilities
              </h3>
              <InputField 
                label="Debts & Expenses" 
                value={liabilities} 
                onChange={setLiabilities} 
                icon={<AlertCircle size={18} />}
                description="Short-term debts, bills, and immediate expenses"
              />
            </div>
          </div>

          {/* Results */}
          <div className="space-y-8">
            <div className="glass p-8 md:p-12 rounded-[40px] border-gold/20 bg-gold/5 sticky top-32">
              <h3 className="text-2xl font-display text-parchment mb-8">Summary</h3>
              
              <div className="space-y-6 mb-12">
                <div className="flex justify-between items-center">
                  <span className="text-parchment/40 text-sm">Total Assets</span>
                  <span className="text-parchment font-mono">${totalAssets.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-parchment/40 text-sm">Liabilities</span>
                  <span className="text-parchment font-mono text-red-400">-${liabilities.toLocaleString()}</span>
                </div>
                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                  <span className="text-parchment font-bold">Net Zakatable Assets</span>
                  <span className="text-gold font-mono text-xl">${netAssets.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-6 bg-gold/10 rounded-3xl border border-gold/20 mb-12">
                <p className="text-gold/60 text-[10px] uppercase tracking-widest mb-2">Zakat Due (2.5%)</p>
                <h4 className="text-4xl font-display text-gold">${zakatDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                {!isZakatObligatory && (
                  <p className="text-[10px] text-parchment/40 mt-4 italic">
                    Your net assets are below the Nisab threshold. Zakat is not obligatory but Sadaqah is always encouraged.
                  </p>
                )}
              </div>

              <button className="w-full py-5 gold-gradient text-ink font-bold rounded-2xl hover:scale-105 transition-transform flex items-center justify-center gap-3">
                {isZakatObligatory ? "Pay Zakat Now" : "Give Sadaqah"} <ArrowRight size={18} />
              </button>

              <div className="mt-8 flex items-start gap-3 p-4 glass rounded-2xl border-white/5">
                <Info size={16} className="text-gold shrink-0 mt-1" />
                <div className="space-y-2">
                  <p className="text-[10px] text-parchment/40 leading-relaxed">
                    Nisab is the minimum amount of wealth a Muslim must possess before they are obligated to pay Zakat. 
                  </p>
                  <p className="text-[10px] text-parchment/40 leading-relaxed">
                    Current Gold Nisab: <span className="text-gold">${Math.round(nisabGold).toLocaleString()}</span>
                  </p>
                  <p className="text-[10px] text-parchment/40 leading-relaxed">
                    Current Silver Nisab: <span className="text-gold">${Math.round(nisabSilver).toLocaleString()}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToolGuidance
        title="Estimate your zakatable wealth"
        what="The Zakat Calculator helps estimate 2.5% zakat on eligible assets after liabilities using editable gold and silver nisab assumptions."
        how={[
          "Enter gold, silver, cash, investments, business assets, and short-term liabilities.",
          "Review net zakatable assets and compare them against the gold and silver nisab estimates.",
          "Use the result as an estimate and consult a qualified scholar for complex cases.",
        ]}
      />
      <RelatedTools currentHref="/zakat" />
      <Footer />
    </main>
  );
}

function InputField({ label, value, onChange, icon, description, unit = "$" }: any) {
  return (
    <div className="space-y-3">
      <label className="text-xs font-bold uppercase tracking-widest text-parchment/60 flex items-center gap-2">
        {icon} {label}
      </label>
      <div className="relative">
        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gold font-mono">{unit}</span>
        <input 
          type="number" 
          value={value || ""}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          placeholder="0"
          className="w-full pl-12 pr-6 py-4 glass rounded-2xl text-parchment font-mono focus:outline-none focus:border-gold/50 transition-colors"
        />
      </div>
      <p className="text-[10px] text-parchment/30 italic">{description}</p>
    </div>
  );
}
