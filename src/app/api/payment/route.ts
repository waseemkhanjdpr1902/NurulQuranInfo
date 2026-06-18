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
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: "Payments require authentication setup." }, { status: 503 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const { amount } = await req.json();
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount < 10 || numericAmount > 100000) {
      return NextResponse.json({ error: "Amount must be between 10 and 100000 INR." }, { status: 400 });
    }

    const rzp = getRazorpay();
    const options = {
      amount: Math.round(numericAmount * 100), // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${user.id}_${Date.now()}`.slice(0, 40),
    };

    const order = await rzp.orders.create(options);
    return NextResponse.json(order);
  } catch (error) {
    console.error("Payment API error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
