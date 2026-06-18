import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HalalStocksClient from "./HalalStocksClient";

export const metadata: Metadata = {
  title: "Halal Stock Screener",
  description:
    "Demo halal stock screener with Shariah screening categories, local watchlist, business activity checks, ratio concerns, and manual review checklist.",
  alternates: {
    canonical: "/halal-stocks",
  },
};

export default function HalalStocksPage() {
  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      <HalalStocksClient />
      <Footer />
    </main>
  );
}
