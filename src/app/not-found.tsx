import { BookOpen, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-ink px-6 flex items-center justify-center">
      <section className="glass-card max-w-xl w-full rounded-[36px] p-9 md:p-14 text-center">
        <div className="w-16 h-16 rounded-2xl gold-gradient text-ink flex items-center justify-center mx-auto mb-7">
          <BookOpen size={30} />
        </div>
        <p className="text-gold text-xs font-bold uppercase tracking-[0.3em] mb-4">Page not found</p>
        <h1 className="text-4xl md:text-5xl font-display text-parchment mb-5">Let&apos;s guide you back</h1>
        <p className="text-parchment/60 leading-relaxed mb-9">The page may have moved or the address may be incomplete.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="gold-gradient text-ink px-7 py-4 rounded-2xl font-bold inline-flex items-center justify-center gap-2">
            <Home size={18} /> Home
          </Link>
          <Link href="/quran" className="glass text-gold px-7 py-4 rounded-2xl font-bold">Open Quran</Link>
        </div>
      </section>
    </main>
  );
}
