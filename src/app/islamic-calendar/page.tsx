import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Breadcrumbs, RelatedTools, ToolGuidance } from "@/components/tooling";

export const metadata: Metadata = {
  title: "Islamic Calendar",
  description: "View today's Gregorian and approximate Hijri date with important Islamic events and reminders.",
  alternates: {
    canonical: "/islamic-calendar",
  },
};

const events = [
  { name: "Ramadan begins", note: "Month of fasting, Quran, charity, and nightly worship." },
  { name: "Laylat al-Qadr", note: "Seek it in the last ten nights of Ramadan." },
  { name: "Eid al-Fitr", note: "Celebration after Ramadan and payment of Zakat al-Fitr." },
  { name: "Day of Arafah", note: "A blessed day for dua, fasting for non-pilgrims, and reflection." },
  { name: "Eid al-Adha", note: "Commemoration of sacrifice and devotion to Allah." },
  { name: "Ashura", note: "A day connected with gratitude, fasting, and prophetic history." },
];

export default function IslamicCalendarPage() {
  const now = new Date();
  const gregorian = new Intl.DateTimeFormat("en", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(now);
  const hijri = new Intl.DateTimeFormat("en-TN-u-ca-islamic", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(now);

  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      <section className="pt-40 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "Islamic Calendar" }]} />
          <p className="text-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-6">Islamic Calendar</p>
          <h1 className="text-5xl md:text-7xl font-display text-parchment mb-8">Hijri & Gregorian Dates</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-8 rounded-[34px] border-gold/10">
              <p className="text-gold/60 text-xs uppercase tracking-widest mb-3">Gregorian</p>
              <p className="text-3xl font-display text-parchment">{gregorian}</p>
            </div>
            <div className="glass p-8 rounded-[34px] border-gold/10">
              <p className="text-gold/60 text-xs uppercase tracking-widest mb-3">Approximate Hijri</p>
              <p className="text-3xl font-display text-parchment">{hijri}</p>
              <p className="text-parchment/35 text-sm mt-4">Local moon-sighting may differ by region.</p>
            </div>
          </div>
        </div>
      </section>

      <ToolGuidance
        title="Track Islamic dates with context"
        what="This calendar gives a quick Gregorian and approximate Hijri date, plus important Islamic seasons and worship reminders."
        how={[
          "Check today’s date before planning worship, study, or family reminders.",
          "Use the event list as a learning prompt for major Islamic occasions.",
          "Confirm local moon-sighting dates with your mosque or trusted local authority.",
        ]}
      />

      <section className="px-6 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => (
            <article key={event.name} className="glass p-6 rounded-[30px] border-white/5">
              <h2 className="text-2xl font-display text-parchment mb-3">{event.name}</h2>
              <p className="text-parchment/50 leading-relaxed">{event.note}</p>
            </article>
          ))}
        </div>
      </section>

      <RelatedTools currentHref="/islamic-calendar" />
      <Footer />
    </main>
  );
}
