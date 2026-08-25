import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuranTopicDetail from "@/components/QuranTopicDetail";
import { getTopic, QURAN_TOPICS } from "@/data/quran-topics";

export function generateStaticParams() { return QURAN_TOPICS.map(topic => ({ slug: topic.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const topic = getTopic(slug); if (!topic) return {};
  const title = `${topic.title} in the Qur’an`;
  const description = `Read verified Qur’anic ayahs related to ${topic.title.toLowerCase()}, with translations, context links and a gentle reflection prompt.`;
  return { title, description, alternates: { canonical: `/quran-topics/${slug}` }, openGraph: { title: `${title} | NurulQuran`, description, url: `/quran-topics/${slug}`, type: "article" } };
}

export default async function QuranTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const topic = getTopic(slug); if (!topic) notFound();
  return <main className="min-h-screen bg-ink"><Navbar/><div className="mx-auto max-w-5xl px-5 pb-24 pt-36 sm:px-6 sm:pt-44"><QuranTopicDetail topic={topic}/></div><Footer/></main>;
}

