import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      <section className="pt-40 pb-24 px-6 max-w-4xl mx-auto">
        <div className="glass p-8 md:p-14 rounded-[40px] border-white/5 text-center">
          <p className="text-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-6">Support</p>
          <h1 className="text-4xl md:text-6xl font-display text-parchment mb-8">How can we help?</h1>
          <p className="text-parchment/60 leading-relaxed mb-10">
            For account, content, or technical help, email support@nurulquran.info. Include the page URL and a short description of the issue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:support@nurulquran.info" className="px-8 py-4 gold-gradient text-ink font-bold rounded-2xl">
              Email Support
            </a>
            <Link href="/feedback" className="px-8 py-4 glass text-gold font-bold rounded-2xl border border-gold/20">
              Send Feedback
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
