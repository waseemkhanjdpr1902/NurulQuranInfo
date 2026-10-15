import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import MushafReader from "@/components/MushafReader";

export const metadata: Metadata = {
  title: "Indian Mushaf — Read Page by Page",
  description: "Read the Indian Hafs Mushaf in Arabic with 610 reading pages, zoom, the original surah index and a saved reading position. King Fahd Complex Nasta’liq edition.",
  alternates: { canonical: "/mushaf" },
};
export default function MushafPage() {
  return <main className="min-h-screen bg-ink"><Navbar /><div className="px-2 pb-10 pt-40 sm:px-6 sm:pt-44"><MushafReader /></div></main>;
}
