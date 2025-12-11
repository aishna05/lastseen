// src/app/api/razorpay/order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
// import { prisma } from "@/lib/prisma"; // if you want to link with your Order table

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // You should ideally ignore body.amount and recalc from cart/order in DB
    const { amount, currency = "INR", receipt } = body;

    if (!amount) {
      return NextResponse.json(
        { error: "Amount is required" },
        { status: 400 }
      );
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // OPTIONAL: store this in your DB with status = "PENDING"
    // const dbOrder = await prisma.order.create({ ... })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // for frontend
    });
  } catch (error: any) {
    console.error("RAZORPAY ORDER ERROR", error);
    return NextResponse.json(
      { error: "Failed to create Razorpay order", details: error.message },
      { status: 500 }
    );
  }
}
