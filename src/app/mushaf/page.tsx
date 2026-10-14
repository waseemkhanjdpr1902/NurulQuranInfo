import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import MushafReader from "@/components/MushafReader";

export const metadata: Metadata = {
  title: "Arabic Mushaf — Read Page by Page",
  description: "Read the 604-page Hafs Mushaf in Arabic, with zoom, surah selection and a saved reading position. Page images from King Saud University.",
  alternates: { canonical: "/mushaf" },
};
export default function MushafPage() {
  return <main className="min-h-screen bg-ink"><Navbar /><div className="px-2 pb-10 pt-40 sm:px-6 sm:pt-44"><MushafReader /></div></main>;
}
