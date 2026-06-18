import Link from "next/link";
import {
  Atom,
  BookOpen,
  CalendarDays,
  Calculator,
  Clock,
  Coffee,
  Compass,
  Heart,
  Landmark,
  Quote,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Sun,
  Volume2,
} from "lucide-react";
import { getRelatedTools, type ToolItem } from "@/lib/tools";

const iconMap = {
  Atom,
  BookOpen,
  CalendarDays,
  Calculator,
  Clock,
  Coffee,
  Compass,
  Heart,
  Landmark,
  Quote,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Sun,
  Volume2,
};

export function ToolIcon({ name, size = 24 }: { name: string; size?: number }) {
  const Icon = iconMap[name as keyof typeof iconMap] || Sparkles;
  return <Icon size={size} />;
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8 text-xs font-bold uppercase tracking-[0.25em] text-parchment/30">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="hover:text-gold">Home</Link>
        </li>
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <span>/</span>
            {item.href ? (
              <Link href={item.href} className="hover:text-gold">{item.label}</Link>
            ) : (
              <span className="text-gold">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function ToolCard({ tool }: { tool: ToolItem }) {
  return (
    <article className="glass p-6 md:p-8 rounded-[34px] border-white/5 hover:border-gold/25 transition-all h-full flex flex-col">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gold/10 text-gold flex items-center justify-center">
          <ToolIcon name={tool.icon} size={26} />
        </div>
        <span className="px-3 py-1 rounded-full bg-white/5 text-gold/70 text-[10px] font-bold uppercase tracking-[0.2em]">
          {tool.category}
        </span>
      </div>
      <h2 className="text-2xl font-display text-parchment mb-4">{tool.name}</h2>
      <p className="text-parchment/50 leading-relaxed mb-8 flex-1">{tool.description}</p>
      <Link href={tool.href} className="inline-flex items-center justify-center rounded-2xl gold-gradient px-5 py-3 text-ink text-xs font-bold uppercase tracking-widest">
        Open Tool
      </Link>
    </article>
  );
}

export function ToolGuidance({
  title,
  what,
  how,
}: {
  title: string;
  what: string;
  how: string[];
}) {
  return (
    <section className="px-6 py-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-[34px] border-white/5">
          <p className="text-gold text-[10px] uppercase tracking-[0.25em] font-bold mb-4">What this tool does</p>
          <h2 className="text-3xl font-display text-parchment mb-5">{title}</h2>
          <p className="text-parchment/55 leading-relaxed">{what}</p>
        </div>
        <div className="glass p-8 rounded-[34px] border-white/5">
          <p className="text-gold text-[10px] uppercase tracking-[0.25em] font-bold mb-4">How to use it</p>
          <ol className="space-y-4">
            {how.map((step, index) => (
              <li key={step} className="flex gap-4 text-parchment/55 leading-relaxed">
                <span className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center shrink-0 font-bold text-sm">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function RelatedTools({ currentHref }: { currentHref: string }) {
  const related = getRelatedTools(currentHref, 3);

  return (
    <section className="px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-gold text-[10px] uppercase tracking-[0.25em] font-bold mb-3">Related tools</p>
            <h2 className="text-3xl md:text-4xl font-display text-parchment">Continue your journey</h2>
          </div>
          <Link href="/tools" className="hidden md:inline-flex px-5 py-3 rounded-2xl glass text-gold text-xs font-bold uppercase tracking-widest">
            All Tools
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {related.map((tool) => (
            <Link key={tool.name} href={tool.href} className="glass p-5 rounded-[28px] border-white/5 hover:border-gold/20 transition-all">
              <div className="w-11 h-11 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-4">
                <ToolIcon name={tool.icon} size={20} />
              </div>
              <h3 className="text-xl font-display text-parchment mb-2">{tool.name}</h3>
              <p className="text-parchment/40 text-sm leading-relaxed">{tool.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
