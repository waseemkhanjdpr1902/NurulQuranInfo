"use client";

import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { Calculator, Coins, Landmark, Briefcase, Info, AlertCircle, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ZakatCalculatorPage() {
  const [goldGrams, setGoldGrams] = useState(0);
  const [silverGrams, setSilverGrams] = useState(0);
  const [goldPrice, setGoldPrice] = useState(0); // User supplies the current local price
  const [silverPrice, setSilverPrice] = useState(0);
  const [cash, setCash] = useState(0);
  const [investments, setInvestments] = useState(0);
  const [businessAssets, setBusinessAssets] = useState(0);
  const [liabilities, setLiabilities] = useState(0);

  const [basis, setBasis] = useState<"gold" | "silver">("silver");
  const [hawl, setHawl] = useState(false);
  const goldValue = goldGrams * goldPrice;
  const silverValue = silverGrams * silverPrice;
  const totalAssets = goldValue + silverValue + cash + investments + businessAssets;
  const netAssets = Math.max(0, totalAssets - liabilities);


  // Nisab values
  const nisabGold = 87.48 * goldPrice;
  const nisabSilver = 612.36 * silverPrice;
  const pricesReady = (basis === "gold" ? goldPrice > 0 : silverPrice > 0) && (goldGrams === 0 || goldPrice > 0) && (silverGrams === 0 || silverPrice > 0);
  const threshold = basis === "gold" ? nisabGold : nisabSilver;
  const isZakatObligatory = pricesReady && hawl && netAssets >= threshold;
  const zakatDue = isZakatObligatory ? netAssets * 0.025 : 0;

  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      
      <div className="pt-40 pb-24 px-6 max-w-7xl mx-auto">
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
            Estimate Zakat using your own current prices. Enter all monetary values in the same currency. This estimate does not replace individual scholarly guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Inputs */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass p-8 md:p-12 rounded-[40px] border-white/5">
              <h3 className="text-2xl font-display text-parchment mb-8 flex items-center gap-3">
                <Coins className="text-gold" /> Assets
              </h3>
              
              <div className="mb-8 space-y-5">
                <InputField label="Current gold price per gram" value={goldPrice} onChange={setGoldPrice} description="Enter today’s local price in your chosen currency" unit="" />
                <InputField label="Current silver price per gram" value={silverPrice} onChange={setSilverPrice} description="Enter today’s local price in the same currency" unit="" />
                <label className="block">Nisab basis <select aria-label="Nisab basis" value={basis} onChange={e => setBasis(e.target.value as "gold" | "silver")} className="min-h-11 rounded-xl border px-3 bg-white"><option value="silver">Silver (612.36 g)</option><option value="gold">Gold (87.48 g)</option></select></label>
                <label className="flex items-start gap-3"><input type="checkbox" checked={hawl} onChange={e => setHawl(e.target.checked)} className="mt-1 h-5 w-5"/>I confirm the applicable lunar-year holding condition has been met.</label>
                <p className="text-sm text-parchment/70">Nisab weights and treatment of jewellery, investments and debts vary by scholarly approach. Confirm the appropriate basis and deductions with a qualified scholar.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputField 
                  label="Gold (Grams)" 
                  value={goldGrams} 
                  onChange={setGoldGrams} 
                  icon={<Coins size={18} />}
                  description={`Entered Price: ${goldPrice}/g`}
                  unit="g"
                />
                <InputField 
                  label="Silver (Grams)" 
                  value={silverGrams} 
                  onChange={setSilverGrams} 
                  icon={<Coins size={18} />}
                  description={`Entered Price: ${silverPrice}/g`}
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
                  <span className="text-parchment font-mono">{totalAssets.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-parchment/40 text-sm">Liabilities</span>
                  <span className="text-parchment font-mono text-red-400">-{liabilities.toLocaleString()}</span>
                </div>
                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                  <span className="text-parchment font-bold">Net Zakatable Assets</span>
                  <span className="text-gold font-mono text-xl">{netAssets.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-6 bg-gold/10 rounded-3xl border border-gold/20 mb-12">
                <p className="text-gold/60 text-[10px] uppercase tracking-widest mb-2">Estimated Zakat (2.5%)</p>
                <h4 className="text-4xl font-display text-gold">{zakatDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                {!isZakatObligatory && (
                  <p className="text-[10px] text-parchment/40 mt-4 italic">
                    {!pricesReady ? "Enter the metal prices needed for your assets and chosen Nisab basis." : !hawl ? "Confirm the applicable lunar-year holding condition to calculate the estimate." : "Your entered net assets are below the selected Nisab threshold."}
                  </p>
                )}
              </div>

              <p className="text-sm text-parchment/70">This tool calculates an estimate only. No payment is collected here.</p>

              <div className="mt-8 flex items-start gap-3 p-4 glass rounded-2xl border-white/5">
                <Info size={16} className="text-gold shrink-0 mt-1" />
                <div className="space-y-2">
                  <p className="text-[10px] text-parchment/40 leading-relaxed">
                    Nisab is the minimum amount of wealth a Muslim must possess before they are obligated to pay Zakat. 
                  </p>
                  <p className="text-[10px] text-parchment/40 leading-relaxed">
                    Current Gold Nisab: <span className="text-gold">{Math.round(nisabGold).toLocaleString()}</span>
                  </p>
                  <p className="text-[10px] text-parchment/40 leading-relaxed">
                    Current Silver Nisab: <span className="text-gold">{Math.round(nisabSilver).toLocaleString()}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

function InputField({ label, value, onChange, icon, description, unit = "" }: {label: string; value: number; onChange: (value: number) => void; icon?: ReactNode; description: string; unit?: string}) {
  return (
    <div className="space-y-3">
      <label className="text-xs font-bold uppercase tracking-widest text-parchment/60 flex items-center gap-2">
        {icon} {label}
      </label>
      <div className="relative">
        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gold font-mono">{unit}</span>
        <input 
          aria-label={label}
          min="0"
          step="any"
          inputMode="decimal"
          type="number" 
          value={value || ""}
          onChange={(e) => onChange(Number.isFinite(Number(e.target.value)) ? Math.max(0, Number(e.target.value)) : 0)}
          placeholder="0"
          className="w-full pl-12 pr-6 py-4 glass rounded-2xl text-parchment font-mono focus:outline-none focus:border-gold/50 transition-colors"
        />
      </div>
      <p className="text-[10px] text-parchment/30 italic">{description}</p>
    </div>
  );
}
