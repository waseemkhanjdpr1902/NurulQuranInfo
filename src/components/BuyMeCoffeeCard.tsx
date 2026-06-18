"use client";

import { Coffee, ExternalLink, Heart, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function BuyMeCoffeeCard() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const amount = process.env.NEXT_PUBLIC_DONATION_AMOUNT_USD || "5";

  const fallbackLinks = useMemo(
    () =>
      [
        process.env.NEXT_PUBLIC_BUY_ME_COFFEE_URL,
        process.env.NEXT_PUBLIC_RAZORPAY_DONATION_LINK,
        process.env.NEXT_PUBLIC_STRIPE_DONATION_LINK,
      ].filter(Boolean) as string[],
    []
  );

  const openFallback = () => {
    if (fallbackLinks.length > 0) {
      window.open(fallbackLinks[0], "_blank", "noopener,noreferrer");
      return;
    }

    setMessage("Donation link is not configured yet.");
  };

  const handleSupport = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/donation", { method: "POST" });
      const data = await response.json();

      if (!response.ok) {
        openFallback();
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        openFallback();
        return;
      }

      const checkout = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: data.name,
        description: data.description,
        order_id: data.orderId,
        theme: {
          color: "#047857",
        },
        handler: () => {
          setMessage("JazakAllahu khairan for supporting NurulQuran.info.");
        },
      });

      checkout.open();
    } catch {
      openFallback();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[42px] border border-emerald-400/20 bg-emerald-950/30 p-8 md:p-12 shadow-2xl shadow-emerald-950/20">
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-[90px]" />
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-emerald-200">
            <Coffee size={16} />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]">Buy Me a Coffee</span>
          </div>
          <h2 className="mb-5 text-4xl md:text-5xl font-display text-parchment">
            Support NurulQuran.info
          </h2>
          <p className="max-w-2xl text-parchment/65 leading-relaxed">
            If NurulQuran.info has benefited you, you can support the project with a small ${amount} contribution. This helps us maintain and improve Islamic tools for everyone.
          </p>
          {message && (
            <p className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
              {message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleSupport}
            disabled={loading}
            className="inline-flex items-center justify-center gap-3 rounded-2xl bg-emerald-400 px-8 py-5 font-bold text-emerald-950 transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Heart className="fill-emerald-950" size={20} />}
            Support with ${amount}
          </button>
          {fallbackLinks.length > 0 && (
            <button
              onClick={openFallback}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 px-8 py-4 text-sm font-bold text-emerald-200 hover:bg-emerald-400/10"
            >
              External support link <ExternalLink size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
