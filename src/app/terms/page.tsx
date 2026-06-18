import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      <section className="pt-40 pb-24 px-6 max-w-4xl mx-auto">
        <div className="glass p-8 md:p-14 rounded-[40px] border-white/5">
          <p className="text-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-6">Terms</p>
          <h1 className="text-4xl md:text-6xl font-display text-parchment mb-8">Terms of Service</h1>
          <div className="space-y-6 text-parchment/60 leading-relaxed">
            <p>NurulQuran.info provides educational Islamic tools for reading, reflection, and personal study.</p>
            <p>AI-generated responses are study aids and must not be treated as fatwa or a replacement for qualified scholarship. Verify religious rulings with trusted scholars.</p>
            <p>By using the platform, you agree to use it respectfully and lawfully.</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
