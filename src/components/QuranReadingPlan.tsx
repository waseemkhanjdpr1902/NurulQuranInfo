"use client";

import { useMemo, useState } from "react";
import { CalendarCheck, Check, Pause, Play, RotateCcw, Trash2 } from "lucide-react";
import { useQuranJourney } from "@/hooks/useQuranJourney";

const PLANS = [{ name: "30-day Qur’an plan", days: 30 }, { name: "60-day plan", days: 60 }, { name: "90-day plan", days: 90 }, { name: "Ramadan plan", days: 30 }, { name: "Custom plan", days: 40 }];
const today = () => new Date().toISOString().slice(0, 10);

export default function QuranReadingPlan() {
  const { data, loaded, authenticated, update } = useQuranJourney();
  const [planName, setPlanName] = useState(PLANS[0].name);
  const [duration, setDuration] = useState(30);
  const [startDate, setStartDate] = useState(today());
  const [mode, setMode] = useState<"pages" | "juz" | "surah">("pages");
  const plan = data.plan;
  const progress = plan ? Math.min(100, Math.round((plan.completedDays.length / plan.durationDays) * 100)) : 0;
  const dailyTarget = useMemo(() => {
    if (!plan) return "";
    const total = plan.trackingMode === "pages" ? 604 : plan.trackingMode === "juz" ? 30 : 114;
    return `${Math.ceil(total / plan.durationDays)} ${plan.trackingMode === "pages" ? "page(s)" : plan.trackingMode === "juz" ? "juz portion(s)" : "surah portion(s)"} per day`;
  }, [plan]);

  if (!loaded) return <div className="h-60 animate-pulse rounded-3xl bg-white/50"/>;

  const createPlan = () => update(current => ({ ...current, plan: { id: crypto.randomUUID(), name: planName, durationDays: Math.max(1, Math.min(365, duration)), startDate, trackingMode: mode, completedDays: [], paused: false, createdAt: new Date().toISOString() } }));
  const toggleToday = () => update(current => current.plan ? ({ ...current, plan: { ...current.plan, completedDays: current.plan.completedDays.includes(today()) ? current.plan.completedDays.filter(date => date !== today()) : [...current.plan.completedDays, today()] } }) : current);

  return <section aria-labelledby="plan-title">
    <header className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Gentle consistency</p><h1 id="plan-title" className="mt-3 font-display text-5xl text-parchment sm:text-7xl">Qur’an Reading Plan</h1><p className="mt-5 leading-7 text-parchment/60">Choose a manageable plan, pause when needed and continue without guilt-based scoring. Every sincere step matters. Continue when you are ready.</p><p className="mt-2 text-sm text-parchment/50">{authenticated ? "Your plan can synchronize securely with your account." : "Your plan is stored privately on this device."}</p></header>

    {!plan ? <div className="mt-10 grid gap-5 rounded-3xl border border-gold/15 bg-white/75 p-6 sm:grid-cols-2 sm:p-8">
      <label className="text-sm font-bold text-parchment">Plan<select value={planName} onChange={event => { const selected = PLANS.find(item => item.name === event.target.value)!; setPlanName(selected.name); setDuration(selected.days); }} className="mt-2 min-h-11 w-full rounded-xl border border-gold/20 bg-ink px-3 font-normal">{PLANS.map(item => <option key={item.name}>{item.name}</option>)}</select></label>
      <label className="text-sm font-bold text-parchment">Start date<input type="date" value={startDate} onChange={event => setStartDate(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-gold/20 bg-ink px-3 font-normal"/></label>
      <label className="text-sm font-bold text-parchment">Tracking method<select value={mode} onChange={event => setMode(event.target.value as typeof mode)} className="mt-2 min-h-11 w-full rounded-xl border border-gold/20 bg-ink px-3 font-normal"><option value="pages">Pages</option><option value="juz">Juz</option><option value="surah">Surah-based</option></select></label>
      <label className="text-sm font-bold text-parchment">Duration in days<input type="number" min={1} max={365} value={duration} onChange={event => setDuration(Number(event.target.value))} disabled={planName !== "Custom plan"} className="mt-2 min-h-11 w-full rounded-xl border border-gold/20 bg-ink px-3 font-normal disabled:opacity-60"/></label>
      <button onClick={createPlan} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gold px-5 font-bold text-ink sm:col-span-2"><CalendarCheck size={18}/> Start reading plan</button>
    </div> : <div className="mt-10 rounded-3xl border border-gold/15 bg-white/75 p-6 shadow-sm sm:p-9">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-gold">Active plan</p><h2 className="mt-2 font-display text-3xl text-parchment">{plan.name}</h2><p className="mt-2 text-sm text-parchment/55">Started {plan.startDate} · {dailyTarget}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${plan.paused ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>{plan.paused ? "Paused" : "In progress"}</span></div>
      <div className="mt-7 h-3 overflow-hidden rounded-full bg-gold/10"><div className="h-full bg-gold" style={{ width: `${progress}%` }}/></div><p className="mt-2 text-sm font-bold text-parchment">{plan.completedDays.length} of {plan.durationDays} days · {progress}%</p>
      <div className="mt-7 flex flex-wrap gap-3"><button onClick={toggleToday} disabled={plan.paused} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gold px-5 text-sm font-bold text-ink disabled:opacity-50"><Check size={17}/>{plan.completedDays.includes(today()) ? "Undo today" : "Mark today complete"}</button><button onClick={() => update(current => current.plan ? ({ ...current, plan: { ...current.plan, paused: !current.plan.paused } }) : current)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gold/20 px-4 text-sm font-bold text-gold">{plan.paused ? <Play size={17}/> : <Pause size={17}/>} {plan.paused ? "Resume" : "Pause"}</button><button onClick={() => { if (confirm("Reset completed days and start this plan again?")) update(current => current.plan ? ({ ...current, plan: { ...current.plan, completedDays: [], startDate: today() } }) : current); }} className="inline-flex min-h-11 items-center gap-2 px-3 text-sm font-bold text-parchment/60"><RotateCcw size={17}/> Reset</button><button onClick={() => { if (confirm("Delete this reading plan permanently?")) update(current => ({ ...current, plan: null })); }} className="inline-flex min-h-11 items-center gap-2 px-3 text-sm font-bold text-rose-700"><Trash2 size={17}/> Delete</button></div>
      <details className="mt-6 rounded-xl border border-gold/15 p-4"><summary className="cursor-pointer text-sm font-bold text-gold">Adjust plan</summary><div className="mt-4 grid gap-4 sm:grid-cols-3"><label className="text-xs font-bold text-parchment">Duration<input type="number" min={1} max={365} value={plan.durationDays} onChange={event => update(current => current.plan ? ({ ...current, plan: { ...current.plan, durationDays: Math.max(1, Math.min(365, Number(event.target.value))) } }) : current)} className="mt-2 min-h-11 w-full rounded-xl border border-gold/20 bg-ink px-3 text-sm font-normal"/></label><label className="text-xs font-bold text-parchment">Start date<input type="date" value={plan.startDate} onChange={event => update(current => current.plan ? ({ ...current, plan: { ...current.plan, startDate: event.target.value } }) : current)} className="mt-2 min-h-11 w-full rounded-xl border border-gold/20 bg-ink px-3 text-sm font-normal"/></label><label className="text-xs font-bold text-parchment">Tracking<select value={plan.trackingMode} onChange={event => update(current => current.plan ? ({ ...current, plan: { ...current.plan, trackingMode: event.target.value as typeof current.plan.trackingMode } }) : current)} className="mt-2 min-h-11 w-full rounded-xl border border-gold/20 bg-ink px-3 text-sm font-normal"><option value="pages">Pages</option><option value="juz">Juz</option><option value="surah">Surah-based</option></select></label></div></details>
      <p className="mt-7 rounded-xl bg-gold/5 p-4 text-sm leading-6 text-parchment/60">This tracker records only days you mark yourself. Opening a surah does not automatically complete the day.</p>
    </div>}
  </section>;
}
