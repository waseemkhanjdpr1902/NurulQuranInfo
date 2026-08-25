import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JourneyDashboard from "@/components/JourneyDashboard";

export const metadata: Metadata = {
  title: "My Qur’an Journey",
  description: "Continue reading, listening and reflecting with private Quran progress saved on your device or synchronized account.",
  robots: { index: false, follow: false },
};

export default function MyQuranJourneyPage() {
  return <main className="min-h-screen bg-ink"><Navbar/><div className="mx-auto max-w-7xl px-5 pb-24 pt-36 sm:px-6 sm:pt-40"><JourneyDashboard/></div><Footer/></main>;
}

