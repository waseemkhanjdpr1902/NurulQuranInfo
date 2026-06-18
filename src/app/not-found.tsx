import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      <section className="pt-40 pb-24 px-6 text-center">
        <div className="max-w-2xl mx-auto glass p-10 md:p-16 rounded-[48px] border-gold/10">
          <p className="text-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-6">Page not found</p>
          <h1 className="text-4xl md:text-6xl font-display text-parchment mb-6">This path is not available yet</h1>
          <p className="text-parchment/50 leading-relaxed mb-10">
            The page may have moved or the feature may still be under development. Continue with the Quran reader or return home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quran" className="px-8 py-4 gold-gradient text-ink font-bold rounded-2xl">
              Open Quran
            </Link>
            <Link href="/" className="px-8 py-4 glass text-gold font-bold rounded-2xl border border-gold/20">
              Return Home
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
