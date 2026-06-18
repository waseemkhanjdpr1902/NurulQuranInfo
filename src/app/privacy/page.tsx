import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      <section className="pt-40 pb-24 px-6 max-w-4xl mx-auto">
        <div className="glass p-8 md:p-14 rounded-[40px] border-white/5">
          <p className="text-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-6">Privacy</p>
          <h1 className="text-4xl md:text-6xl font-display text-parchment mb-8">Privacy Policy</h1>
          <div className="space-y-6 text-parchment/60 leading-relaxed">
            <p>NurulQuran.info is designed to collect only the information needed to provide core Islamic learning tools, authentication, and saved preferences.</p>
            <p>When sign-in is enabled, authentication is handled by Supabase. Quran reading, prayer-time lookup, and AI study features may use trusted third-party APIs to fulfill user requests.</p>
            <p>We do not sell personal information. For privacy questions, contact support@nurulquran.info.</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
