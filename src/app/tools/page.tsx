import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Breadcrumbs, ToolCard } from "@/components/tooling";
import { tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Tools & Features",
  description:
    "Explore all NurulQuran.info Islamic tools including Quran reading, recitation, Asmaul Husna, duas, tasbih, prayer times, Qibla, Zakat, Islamic Finance, Halal Stocks, Daily Verse, Daily Hadith, and Buy Me a Coffee support.",
  alternates: {
    canonical: "/tools",
  },
};

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs items={[{ label: "Tools" }]} />
          <div className="max-w-4xl">
            <p className="text-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-6">Tools & Features</p>
            <h1 className="text-5xl md:text-8xl font-display text-parchment mb-8 leading-tight">
              Explore Islamic <span className="text-gold italic">Tools</span>
            </h1>
            <p className="text-parchment/55 text-lg md:text-xl leading-relaxed">
              Find every active NurulQuran.info tool in one place. Open Quran study, worship helpers, daily utilities, finance tools, and support options directly.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-28">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <ToolCard key={tool.name} tool={tool} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
