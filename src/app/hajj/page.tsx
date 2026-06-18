import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const steps = [
  "Enter ihram with sincere intention",
  "Perform tawaf and sa'i with humility",
  "Stand in Arafah and increase dua",
  "Spend the required nights in Muzdalifah and Mina",
  "Complete stoning, sacrifice, shaving or trimming, and farewell tawaf",
];

export default function HajjPage() {
  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      <section className="pt-40 pb-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-6">Pilgrimage</p>
          <h1 className="text-5xl md:text-7xl font-display text-parchment mb-6">Hajj Guide</h1>
          <p className="text-parchment/50 max-w-2xl mx-auto leading-relaxed">
            A simple overview for learning. Always confirm practical rulings with qualified scholars and official Hajj authorities.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, index) => (
            <div key={step} className="glass p-8 rounded-[32px] border-white/5">
              <span className="text-gold font-display text-4xl">{index + 1}</span>
              <p className="text-parchment/70 mt-4 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/dua" className="px-8 py-4 gold-gradient text-ink font-bold rounded-2xl inline-flex">
            Study Duas for the Journey
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
