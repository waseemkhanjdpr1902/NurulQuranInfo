"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { UserPlus, Mail, Lock, Chrome, ArrowRight, Loader2, User } from "lucide-react";
import { supabase } from "@/services/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google') => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (error) {
      console.error(`${provider} login failed:`, error.message);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-ink">
      <Navbar />
      
      <div className="pt-40 pb-24 px-6 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md glass p-8 md:p-12 rounded-[40px] border-white/5 shadow-2xl"
        >
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-6 text-ink shadow-lg">
              <UserPlus size={32} />
            </div>
            <h1 className="text-3xl font-display text-parchment mb-2">Create Account</h1>
            <p className="text-parchment/40 text-sm">Join the NurulQuran community</p>
          </div>

          {success ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6 text-green-500 border border-green-500/20">
                <Mail size={40} />
              </div>
              <h2 className="text-2xl font-display text-parchment mb-4">Check your email</h2>
              <p className="text-parchment/40 leading-relaxed mb-8">
                We&apos;ve sent a verification link to <span className="text-gold">{email}</span>. 
                Please verify your account to continue.
              </p>
              <Link href="/login" className="text-gold font-bold hover:underline flex items-center justify-center gap-2">
                Return to Login <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-10">
                <button 
                  onClick={() => handleSocialLogin('google')}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-4 py-4 gold-gradient border border-gold/20 rounded-2xl text-ink hover:scale-[1.02] transition-all font-bold shadow-lg shadow-gold/20"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Chrome size={20} />} Sign up with Google
                </button>
              </div>

              <div className="relative mb-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                  <span className="bg-ink px-4 text-parchment/20">Or use your email</span>
                </div>
              </div>

              <form onSubmit={handleSignup} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gold font-bold ml-4">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-parchment/20" size={18} />
                    <input 
                      type="text" 
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full pl-12 pr-4 py-4 glass rounded-2xl text-parchment placeholder:text-parchment/20 focus:outline-none focus:border-gold/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gold font-bold ml-4">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-parchment/20" size={18} />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-12 pr-4 py-4 glass rounded-2xl text-parchment placeholder:text-parchment/20 focus:outline-none focus:border-gold/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gold font-bold ml-4">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-parchment/20" size={18} />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-4 glass rounded-2xl text-parchment placeholder:text-parchment/20 focus:outline-none focus:border-gold/50 transition-colors"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-xs text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                    {error}
                  </p>
                )}

                <button 
                  disabled={loading}
                  className="w-full py-4 gold-gradient text-ink font-bold rounded-2xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 shadow-xl shadow-gold/20"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <>Create Account <ArrowRight size={20} /></>}
                </button>
              </form>

              <p className="mt-10 text-center text-parchment/40 text-sm">
                Already have an account? <Link href="/login" className="text-gold hover:underline">Sign in</Link>
              </p>
            </>
          )}
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
