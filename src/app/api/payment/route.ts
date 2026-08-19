import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@/utils/supabase/server";

let razorpay: Razorpay | null = null;

function getRazorpay() {
  if (!razorpay) {
    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_id || !key_secret) {
      throw new Error("Razorpay API keys are missing");
    }
    razorpay = new Razorpay({ key_id, key_secret });
  }
  return razorpay;
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Sign in is required." }, { status: 401 });

    const { planId } = await req.json();
    const configuredPlans: Record<string, number> = {
      supporter: Number(process.env.RAZORPAY_SUPPORTER_AMOUNT_PAISE || 0),
      premium: Number(process.env.RAZORPAY_PREMIUM_AMOUNT_PAISE || 0),
    };
    const amount = configuredPlans[String(planId || "")];
    if (!Number.isInteger(amount) || amount < 100) {
      return NextResponse.json({ error: "Select a valid configured plan." }, { status: 400 });
    }

    const rzp = getRazorpay();
    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: { user_id: user.id, plan_id: String(planId) },
    };

    const order = await rzp.orders.create(options);
    return NextResponse.json({ id: order.id, amount: order.amount, currency: order.currency });
  } catch (error) {
    console.error("Payment API error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
