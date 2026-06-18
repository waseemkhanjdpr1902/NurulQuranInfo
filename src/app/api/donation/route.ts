import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export const dynamic = "force-dynamic";

function getDonationAmountUsd() {
  const configured = Number(process.env.NEXT_PUBLIC_DONATION_AMOUNT_USD || 5);
  if (!Number.isFinite(configured) || configured <= 0 || configured > 100) return 5;
  return configured;
}

export async function POST() {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "Razorpay donation is not configured." },
      { status: 503 }
    );
  }

  try {
    const amountUsd = getDonationAmountUsd();
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(amountUsd * 100),
      currency: "USD",
      receipt: `donation_${Date.now()}`.slice(0, 40),
      notes: {
        purpose: "NurulQuran.info Buy Me a Coffee support",
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      name: "NurulQuran.info",
      description: `Buy Me a Coffee - $${amountUsd} support`,
    });
  } catch (error) {
    console.error("Donation order failed:", error);
    return NextResponse.json(
      { error: "Unable to create donation order." },
      { status: 500 }
    );
  }
}
