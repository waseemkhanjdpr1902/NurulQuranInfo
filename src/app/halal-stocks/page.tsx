import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HalalStocksClient from "./HalalStocksClient";

export const metadata: Metadata = {
  title: "Halal Stock Screener",
  description:
    "Demo multi-country halal stock screener for India, US, UK, Saudi Arabia, UAE, Malaysia, Indonesia, Qatar, Kuwait, Canada, and Australia with Shariah screening categories and local watchlist.",
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
