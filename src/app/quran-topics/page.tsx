import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuranTopicsExplorer from "@/components/QuranTopicsExplorer";

export const metadata: Metadata = { title: "Explore the Qur’an by Topic", description: "Explore manually reviewed Quranic passages about patience, hope, mercy, gratitude, family, justice and other established themes.", alternates: { canonical: "/quran-topics" }, openGraph: { title: "Explore the Qur’an by Topic | NurulQuran", description: "A reviewed educational index of Quranic passages by theme.", url: "/quran-topics" } };

export default function QuranTopicsPage() { return <main className="min-h-screen bg-ink"><Navbar/><div className="mx-auto max-w-7xl px-5 pb-24 pt-36 sm:px-6 sm:pt-44"><QuranTopicsExplorer/></div><Footer/></main>; }

