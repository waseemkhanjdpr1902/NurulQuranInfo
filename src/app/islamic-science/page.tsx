import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IslamicScienceClient from "./IslamicScienceClient";

export const metadata: Metadata = {
  title: "Islamic Science and Muslim Scholars",
  description:
    "Explore Islamic science topics and biographies of Muslim scholars in astronomy, medicine, optics, mathematics, geography, and engineering.",
  alternates: {
    canonical: "/islamic-science",
  },
};

export default function IslamicSciencePage() {
  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      <IslamicScienceClient />
      <Footer />
    </main>
  );
}
