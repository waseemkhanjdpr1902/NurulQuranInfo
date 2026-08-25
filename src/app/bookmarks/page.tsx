import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookmarksDashboard from "@/components/BookmarksDashboard";

export const metadata: Metadata = { title: "Private Qur’an Bookmarks and Notes", description: "Search and manage your private Quran bookmarks, notes and collections.", robots: { index: false, follow: false } };

export default function BookmarksPage() {
  return <main className="min-h-screen bg-ink"><Navbar/><div className="mx-auto max-w-5xl px-5 pb-24 pt-36 sm:px-6 sm:pt-40"><BookmarksDashboard/></div><Footer/></main>;
}

