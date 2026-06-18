import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IslamicFinanceClient from "./IslamicFinanceClient";

export const metadata: Metadata = {
  title: "Islamic Finance",
  description:
    "Learn Islamic finance basics including riba, halal income, investing principles, zakat, emergency funds, debt management, murabaha, musharakah, mudarabah, sukuk, and takaful.",
  alternates: {
    canonical: "/islamic-finance",
  },
};

export default function IslamicFinancePage() {
  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      <IslamicFinanceClient />
      <Footer />
    </main>
  );
}
