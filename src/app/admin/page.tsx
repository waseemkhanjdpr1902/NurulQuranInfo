"use client";

import { useEffect, useMemo, useState } from "react";
import type { ElementType } from "react";
import { BookOpen, Bell, FileAudio, Newspaper, Plus, Star, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient, isSupabaseConfigured } from "@/services/supabase";
import { useRouter } from "next/navigation";

type AdminType = "Article" | "Dua" | "Daily Verse" | "Daily Hadith" | "Audio File" | "Notification" | "Featured Content";

interface AdminItem {
  id: string;
  type: AdminType;
  title: string;
  content: string;
  updatedAt: string;
}

const contentTypes: { type: AdminType; icon: ElementType }[] = [
  { type: "Article", icon: Newspaper },
  { type: "Dua", icon: BookOpen },
  { type: "Daily Verse", icon: Star },
  { type: "Daily Hadith", icon: Star },
  { type: "Audio File", icon: FileAudio },
  { type: "Notification", icon: Bell },
  { type: "Featured Content", icon: Star },
];

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<AdminType>("Article");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [items, setItems] = useState<AdminItem[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isSupabaseConfigured) {
        router.push("/login?error=Admin%20requires%20Supabase%20authentication");
        return;
      }

      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login?next=/admin");
        return;
      }

      setItems(JSON.parse(window.localStorage.getItem("nurulquran.adminDrafts") || "[]"));
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!loading) {
      window.localStorage.setItem("nurulquran.adminDrafts", JSON.stringify(items));
    }
  }, [items, loading]);

  const visibleItems = useMemo(
    () => items.filter((item) => item.type === selectedType),
    [items, selectedType]
  );

  const saveItem = () => {
    if (!title.trim() || !content.trim()) return;

    setItems((current) => [
      {
        id: crypto.randomUUID(),
        type: selectedType,
        title: title.trim(),
        content: content.trim(),
        updatedAt: new Date().toISOString(),
      },
      ...current,
    ]);
    setTitle("");
    setContent("");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-ink">
        <Navbar />
        <div className="pt-40 px-6 text-center text-parchment/40">Loading admin panel...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      <section className="pt-40 pb-24 px-6 max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-4">Admin</p>
          <h1 className="text-5xl md:text-7xl font-display text-parchment mb-4">Content Desk</h1>
          <p className="text-parchment/45 max-w-2xl leading-relaxed">
            Auth-gated draft manager for articles, duas, daily content, audio references, notifications, and featured content. Drafts are stored locally until database roles are configured.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="glass p-5 rounded-[32px] border-white/5 h-fit">
            <div className="space-y-2">
              {contentTypes.map(({ type, icon: Icon }) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-colors ${
                    selectedType === type ? "bg-gold text-ink" : "text-parchment/50 hover:bg-white/5 hover:text-gold"
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-bold">{type}</span>
                </button>
              ))}
            </div>
          </aside>

          <div className="lg:col-span-3 space-y-8">
            <div className="glass p-8 rounded-[36px] border-white/5">
              <h2 className="text-2xl font-display text-parchment mb-6">Create {selectedType}</h2>
              <div className="space-y-5">
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Title"
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-parchment placeholder:text-parchment/20 focus:outline-none focus:border-gold/50"
                />
                <textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="Content, URL, notification copy, or featured description"
                  rows={6}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-parchment placeholder:text-parchment/20 focus:outline-none focus:border-gold/50"
                />
                <button onClick={saveItem} className="px-6 py-4 gold-gradient text-ink font-bold rounded-2xl inline-flex items-center gap-2">
                  <Plus size={18} /> Save Draft
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {visibleItems.map((item) => (
                <article key={item.id} className="glass p-6 rounded-[28px] border-white/5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-gold/50 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">{item.type}</p>
                      <h3 className="text-xl font-display text-parchment">{item.title}</h3>
                    </div>
                    <button
                      aria-label="Delete admin draft"
                      onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))}
                      className="text-parchment/20 hover:text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-parchment/50 text-sm leading-relaxed whitespace-pre-wrap">{item.content}</p>
                </article>
              ))}
            </div>

            {visibleItems.length === 0 && (
              <div className="glass p-10 rounded-[32px] text-center text-parchment/30">
                No {selectedType.toLowerCase()} drafts yet.
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
