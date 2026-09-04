import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { randomUUID } from "node:crypto";
import { rateLimit, rejectOversizedRequest } from "@/lib/api-security";

let razorpay: Razorpay | null = null;

function getRazorpay() {
  if (!razorpay) {
    const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_id || !key_secret) {
      throw new Error("Razorpay API keys are missing");
    }
    razorpay = new Razorpay({ key_id, key_secret });
  }
  return razorpay;
}

export async function POST(req: Request) {
  const blocked = rejectOversizedRequest(req, 2_000) || rateLimit(req, "payment-order", 8, 60_000);
  if (blocked) return blocked;

  try {
    const { amount } = await req.json();
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount < 1 || numericAmount > 100000) {
      return NextResponse.json({ error: "Enter a valid amount between ₹1 and ₹1,00,000." }, { status: 400 });
    }

    const rzp = getRazorpay();
    const options = {
      amount: Math.round(numericAmount * 100),
      currency: "INR",
      receipt: `nq_${randomUUID().replaceAll("-", "").slice(0, 24)}`,
    };

    const order = await rzp.orders.create(options);
    return NextResponse.json(order);
  } catch (error) {
    console.error("Payment API error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
