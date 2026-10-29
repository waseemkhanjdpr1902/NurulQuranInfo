import type { ReactNode } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PolicyLayout({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return <main className="min-h-screen bg-ink">
    <Navbar />
    <article className="mx-auto max-w-4xl px-5 pb-20 pt-[calc(var(--navigation-height,160px)+32px)] text-parchment">
      <p className="text-sm font-semibold uppercase tracking-widest text-gold">NurulQuran · Privacy & help</p>
      <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">{title}</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8">{intro}</p>
      <nav aria-label="Privacy and support" className="my-7 flex flex-wrap gap-x-5 gap-y-2 rounded-2xl border border-gold/20 bg-white p-4 text-sm font-semibold">
        <Link className="py-2 underline underline-offset-4" href="/privacy">Privacy policy & choices</Link>
        <Link className="py-2 underline underline-offset-4" href="/delete-account">Delete account or data</Link>
        <Link className="py-2 underline underline-offset-4" href="/contact">Contact support</Link>
        <Link className="py-2 underline underline-offset-4" href="/terms">Terms of use</Link>
      </nav>
      <div className="space-y-7 [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-2xl [&_h3]:my-3 [&_h3]:text-lg [&_h3]:font-semibold [&_p]:leading-8 [&_p+p]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:ps-6 [&_li]:leading-7 [&_a]:text-gold [&_a]:underline [&_a]:underline-offset-4 [&_section]:rounded-3xl [&_section]:border [&_section]:border-gold/20 [&_section]:bg-white [&_section]:p-5 sm:[&_section]:p-7">
        {children}
      </div>
    </article>
    <Footer />
  </main>;
}
