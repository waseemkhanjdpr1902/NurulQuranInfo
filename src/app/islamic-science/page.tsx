import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IslamicScienceClient from "./IslamicScienceClient";

export const metadata: Metadata = {
  title: "Islamic Science",
  description:
    "Educational Islamic Science topics covering Quranic reflection, astronomy, medicine, algebra, optics, geography, ethics, and warnings against unsupported miracle claims.",
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
