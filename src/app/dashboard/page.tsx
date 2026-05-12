"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  LayoutDashboard, BookOpen, Bookmark, Clock, 
  TrendingUp, Settings, LogOut, User, 
  ChevronRight, Sparkles, Heart
} from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/services/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      if (!isSupabaseConfigured) {
        router.push("/login?error=Login is not configured yet");
        return;
      }

      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    if (!isSupabaseConfigured) {
      router.push("/");
      return;
    }

    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) return null;

  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      
      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="glass p-8 rounded-[32px] border-white/5 sticky top-32">
              <div className="flex flex-col items-center text-center mb-10">
                <div className="w-20 h-20 rounded-full gold-gradient p-1 mb-4">
                  <div className="w-full h-full rounded-full bg-ink flex items-center justify-center overflow-hidden">
                    {user?.user_metadata?.avatar_url && user.user_metadata.avatar_url.trim() !== "" ? (
                      <Image 
                        src={user.user_metadata.avatar_url} 
                        alt="Avatar" 
                        width={80} 
                        height={80} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <User className="text-gold" size={32} />
                    )}
                  </div>
                </div>
                <h3 className="text-parchment font-display text-lg">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</h3>
                <p className="text-parchment/30 text-[10px] uppercase tracking-widest mt-1">Premium Member</p>
              </div>

              <nav className="space-y-2">
                {[
                  { icon: LayoutDashboard, label: "Overview", active: true },
                  { icon: Bookmark, label: "Bookmarks" },
                  { icon: Clock, label: "History" },
                  { icon: TrendingUp, label: "Watchlist" },
                  { icon: Settings, label: "Settings" },
                ].map((item, i) => (
                  <button 
                    key={i}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all text-sm font-medium ${
                      item.active ? "bg-gold text-ink" : "text-parchment/40 hover:bg-white/5 hover:text-parchment"
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </button>
                ))}
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-red-500/60 hover:bg-red-500/10 hover:text-red-500 transition-all text-sm font-medium mt-8"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-12">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-display text-parchment mb-2">Assalamu Alaikum, <span className="text-gold italic">{user?.user_metadata?.full_name?.split(' ')[0] || 'Brother'}</span></h1>
                <p className="text-parchment/40 text-sm">Welcome back to your spiritual journey.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="glass px-6 py-3 rounded-2xl border-white/5 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
                  <span className="text-xs font-bold text-parchment/60 uppercase tracking-widest">7 Day Streak</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Ayahs Read", val: "1,240", icon: BookOpen, color: "text-gold" },
                { label: "Courses Progress", val: "65%", icon: Sparkles, color: "text-emerald" },
                { label: "Sadaqah Given", val: "$450", icon: Heart, color: "text-rose-400" },
              ].map((stat, i) => (
                <div key={i} className="glass p-8 rounded-[32px] border-white/5 relative overflow-hidden group">
                  <div className={`absolute top-0 right-0 p-8 ${stat.color} opacity-10 group-hover:scale-110 transition-transform`}>
                    <stat.icon size={64} />
                  </div>
                  <p className="text-parchment/30 text-[10px] uppercase tracking-widest mb-2">{stat.label}</p>
                  <h4 className="text-3xl font-display text-parchment">{stat.val}</h4>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display text-parchment">Recent <span className="text-gold">Activity</span></h2>
                <button className="text-gold text-[10px] uppercase tracking-widest font-bold hover:underline">View All</button>
              </div>
              
              <div className="space-y-4">
                {[
                  { title: "Completed Surah Al-Kahf", time: "2 hours ago", icon: BookOpen },
                  { title: "Added TSLA to Halal Watchlist", time: "Yesterday", icon: TrendingUp },
                  { title: "Started 'Basic Arabic Grammar' Course", time: "3 days ago", icon: Sparkles },
                ].map((activity, i) => (
                  <div key={i} className="glass p-6 rounded-3xl border-white/5 flex items-center justify-between group hover:border-gold/20 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-ink transition-colors">
                        <activity.icon size={20} />
                      </div>
                      <div>
                        <h4 className="text-parchment font-medium">{activity.title}</h4>
                        <p className="text-parchment/30 text-xs mt-1">{activity.time}</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-parchment/20 group-hover:text-gold transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
