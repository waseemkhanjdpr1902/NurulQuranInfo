import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function FeedbackPage() {
  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      <section className="pt-40 pb-24 px-6 max-w-4xl mx-auto">
        <div className="glass p-8 md:p-14 rounded-[40px] border-white/5">
          <p className="text-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-6">Feedback</p>
          <h1 className="text-4xl md:text-6xl font-display text-parchment mb-8">Help improve NurulQuran</h1>
          <p className="text-parchment/60 leading-relaxed mb-8">
            Share corrections, feature requests, accessibility issues, or content suggestions with the team.
          </p>
          <a
            href="mailto:support@nurulquran.info?subject=NurulQuran%20Feedback"
            className="inline-flex px-8 py-4 gold-gradient text-ink font-bold rounded-2xl"
          >
            Email Feedback
          </a>
        </div>
      </section>
      <Footer />
    </main>
  );
}
