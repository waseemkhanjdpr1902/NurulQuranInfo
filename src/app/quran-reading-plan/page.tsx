import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuranReadingPlan from "@/components/QuranReadingPlan";

export const metadata: Metadata = { title: "Private Qur’an Reading Plan", description: "Create a gentle 30, 60, 90-day, Ramadan or custom Quran reading plan.", robots: { index: false, follow: false } };
export default function QuranReadingPlanPage() { return <main className="min-h-screen bg-ink"><Navbar/><div className="mx-auto max-w-5xl px-5 pb-24 pt-36 sm:px-6 sm:pt-44"><QuranReadingPlan/></div><Footer/></main>; }

