"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Bookmark, CheckCircle2, Filter, HelpCircle, Search, ShieldAlert, XCircle } from "lucide-react";
import { getScreenedDemoStocks, manualReviewChecklist, type Country, type ShariahStatus, type StockScreeningResult } from "@/lib/halal-screening";

const statusStyles: Record<ShariahStatus, string> = {
  "Likely Halal": "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
  Doubtful: "text-amber-300 bg-amber-500/10 border-amber-500/20",
  Avoid: "text-red-300 bg-red-500/10 border-red-500/20",
  "Needs Manual Review": "text-blue-300 bg-blue-500/10 border-blue-500/20",
};

const statusIcons: Record<ShariahStatus, React.ElementType> = {
  "Likely Halal": CheckCircle2,
  Doubtful: AlertTriangle,
  Avoid: XCircle,
  "Needs Manual Review": HelpCircle,
};

export default function HalalStocksClient() {
  const stocks = useMemo(() => getScreenedDemoStocks(), []);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState<"All" | Country>("All");
  const [sector, setSector] = useState("All");
  const [status, setStatus] = useState<"All" | ShariahStatus>("All");
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setWatchlist(JSON.parse(window.localStorage.getItem("nurulquran.halalStocksWatchlist") || "[]"));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("nurulquran.halalStocksWatchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const countries = useMemo(() => ["All", ...Array.from(new Set(stocks.map((stock) => stock.country)))] as Array<"All" | Country>, [stocks]);
  const sectors = useMemo(() => ["All", ...Array.from(new Set(stocks.map((stock) => stock.sector)))], [stocks]);

  const filteredStocks = stocks.filter((stock) => {
    const term = search.trim().toLowerCase();
    const matchesSearch =
      !term ||
      [stock.companyName, stock.ticker, stock.country, stock.exchange, stock.sector, stock.businessActivity, stock.status]
        .join(" ")
        .toLowerCase()
        .includes(term);
    const matchesCountry = country === "All" || stock.country === country;
    const matchesSector = sector === "All" || stock.sector === sector;
    const matchesStatus = status === "All" || stock.status === status;
    return matchesSearch && matchesCountry && matchesSector && matchesStatus;
  });

  const toggleWatchlist = (ticker: string) => {
    setWatchlist((current) =>
      current.includes(ticker) ? current.filter((item) => item !== ticker) : [...current, ticker]
    );
  };

  return (
    <>
      <header className="pt-40 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-6">Demo Shariah screener</p>
          <h1 className="text-5xl md:text-8xl font-display text-parchment mb-8">
            Halal <span className="text-gold italic">Stocks</span>
          </h1>
          <p className="text-parchment/50 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            Search demo stocks across 11 markets, review screening reasons, and save a local watchlist for manual follow-up.
          </p>
        </div>
      </header>

      <section className="px-6 pb-28">
        <div className="max-w-7xl mx-auto">
          <div className="glass p-6 md:p-8 rounded-[36px] border-gold/10 mb-10">
            <p className="text-gold font-bold mb-2">Not financial advice</p>
            <p className="text-parchment/55 leading-relaxed">
              Demo data only. Please verify with qualified Shariah screening sources before investing. No stock is 100% halal guaranteed, and this page does not provide buy/sell recommendations.
            </p>
          </div>

          <div className="glass p-6 rounded-[36px] border-white/5 mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="relative lg:col-span-2">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-parchment/20" size={20} />
                <input
                  aria-label="Search stock by company name or ticker"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search TCS, Infosys, Apple, sector, status..."
                  className="w-full pl-14 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-parchment placeholder:text-parchment/20 focus:outline-none focus:border-gold/50"
                />
              </div>
              <div className="flex gap-3 overflow-x-auto">
                {countries.map((item) => (
                  <button
                    key={item}
                    onClick={() => setCountry(item)}
                    className={`px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest whitespace-nowrap ${country === item ? "gold-gradient text-ink" : "bg-white/5 text-parchment/50 hover:text-gold"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {sectors.map((item) => (
                <button
                  key={item}
                  onClick={() => setSector(item)}
                  className={`px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest whitespace-nowrap flex items-center gap-2 ${sector === item ? "gold-gradient text-ink" : "bg-white/5 text-parchment/50 hover:text-gold"}`}
                >
                  <Filter size={14} /> {item}
                </button>
              ))}
            </div>
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {(["All", "Likely Halal", "Doubtful", "Avoid", "Needs Manual Review"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setStatus(item)}
                  className={`px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest whitespace-nowrap flex items-center gap-2 ${status === item ? "gold-gradient text-ink" : "bg-white/5 text-parchment/50 hover:text-gold"}`}
                >
                  <Filter size={14} /> {item}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {filteredStocks.map((stock) => (
              <StockCard
                key={stock.ticker}
                stock={stock}
                saved={watchlist.includes(stock.ticker)}
                expanded={expanded === stock.ticker}
                onToggleWatchlist={() => toggleWatchlist(stock.ticker)}
                onToggleExpanded={() => setExpanded((current) => (current === stock.ticker ? null : stock.ticker))}
              />
            ))}
          </div>

          {filteredStocks.length === 0 && (
            <div className="text-center py-20 text-parchment/30 font-display text-2xl">
              No demo stocks match your filters.
            </div>
          )}

          <div className="mt-16 glass p-8 md:p-12 rounded-[40px] border-white/5">
            <div className="flex items-center gap-3 mb-8">
              <ShieldAlert className="text-gold" size={28} />
              <h2 className="text-3xl md:text-4xl font-display text-parchment">Manual review checklist</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {manualReviewChecklist.map((item) => (
                <div key={item} className="p-5 rounded-2xl bg-white/5 text-parchment/60 leading-relaxed">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function StockCard({
  stock,
  saved,
  expanded,
  onToggleWatchlist,
  onToggleExpanded,
}: {
  stock: StockScreeningResult;
  saved: boolean;
  expanded: boolean;
  onToggleWatchlist: () => void;
  onToggleExpanded: () => void;
}) {
  const Icon = statusIcons[stock.status];
  const ratios = stock.ratios || {};

  return (
    <article className="glass p-6 rounded-[34px] border-white/5 hover:border-gold/20 transition-all">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-gold/50 text-[10px] uppercase tracking-[0.25em] font-bold mb-2">
            {stock.country} - {stock.exchange} - {stock.ticker}
          </p>
          <h2 className="text-2xl font-display text-parchment">{stock.companyName}</h2>
          <p className="text-parchment/35 text-sm mt-1">{stock.sector}</p>
        </div>
        <button
          aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
          onClick={onToggleWatchlist}
          className={`w-11 h-11 rounded-full bg-white/5 flex items-center justify-center ${saved ? "text-gold" : "text-parchment/30 hover:text-gold"}`}
        >
          <Bookmark size={18} className={saved ? "fill-gold" : ""} />
        </button>
      </div>

      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-bold mb-6 ${statusStyles[stock.status]}`}>
        <Icon size={16} /> {stock.status}
      </div>

      <p className="text-parchment/55 leading-relaxed mb-6">{stock.businessActivity}</p>

      <div className="grid grid-cols-1 gap-3 mb-6 text-sm">
        <Metric label="Debt level" value={formatRatio(ratios.debtRatio)} />
        <Metric label="Interest income concern" value={formatRatio(ratios.interestIncomeRatio)} />
        <Metric label="Impure income concern" value={formatRatio(ratios.impureIncomeRatio)} />
        <Metric label="Cash / interest-bearing securities" value={formatRatio(ratios.cashAndInterestBearingRatio)} />
        <Metric label="Shariah status" value={stock.status} />
        <Metric label="Risk level" value={stock.riskLevel} />
        <Metric label="Last reviewed" value={stock.lastReviewed} />
      </div>

      <div className="mb-6 rounded-2xl bg-white/5 p-4">
        <p className="text-gold/50 text-[10px] uppercase tracking-[0.25em] font-bold mb-2">Notes</p>
        <p className="text-parchment/55 text-sm leading-relaxed">{stock.notes}</p>
      </div>

      <button onClick={onToggleExpanded} className="w-full py-3 rounded-2xl bg-white/5 text-gold text-xs font-bold uppercase tracking-widest hover:bg-gold/10">
        Why this rating?
      </button>

      {expanded && (
        <div className="mt-5 p-5 rounded-2xl bg-gold/5 border border-gold/10">
          <p className="text-gold text-[10px] uppercase tracking-[0.25em] font-bold mb-3">Screening explanation</p>
          <ul className="space-y-2 text-parchment/60 text-sm leading-relaxed">
            {stock.reasons.map((reason) => (
              <li key={reason}>- {reason}</li>
            ))}
          </ul>
          <p className="text-parchment/30 text-xs mt-4">Demo data only. Verify with a reliable Shariah screening source.</p>
        </div>
      )}
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 p-3 rounded-xl bg-white/5">
      <span className="text-parchment/35">{label}</span>
      <span className="text-parchment/70 text-right">{value}</span>
    </div>
  );
}

function formatRatio(value: number | null | undefined) {
  if (typeof value !== "number") return "Needs data";
  return `${value}%`;
}
