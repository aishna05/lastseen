// src/app/api/razorpay/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export const dynamic = 'force-dynamic';

const resendApiKey = process.env.RESEND_API_KEY || "re_jo8S9jVP_EPh9dZiEnaDi8GnvPqgZ9hZb";
const resend = new Resend(resendApiKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dbOrderId,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing Razorpay payment details" },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json(
        { error: "Razorpay key secret not configured" },
        { status: 500 }
      );
    }

    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    const isAuthentic = generatedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }

    // Payment is verified — update DB order and notify sellers
    if (!dbOrderId) {
      // still successful but no DB order to update
      return NextResponse.json({ success: true });
    }

    const order = await prisma.order.findUnique({
      where: { id: Number(dbOrderId) },
      include: {
        items: {
          include: {
            product: {
              include: { seller: true },
            },
          },
        },
        user: true,
        address: true,
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    // Update order status to PAID
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "PAID" },
    });

    // Group items by seller
    const sellerMap: Record<number, any[]> = {};
    for (const item of order.items) {
      const sellerId = item.product.sellerId;
      if (!sellerMap[sellerId]) sellerMap[sellerId] = [];
      sellerMap[sellerId].push(item);
    }

    // Send email to each seller with customer & ordered product details
    for (const sellerIdStr of Object.keys(sellerMap)) {
      const sellerId = Number(sellerIdStr);
      const itemsForSeller = sellerMap[sellerId];

      // seller email & name
      const seller = itemsForSeller[0].product.seller;
      const sellerEmail = seller?.email;

      if (!sellerEmail) continue;

      // Build email HTML
      const itemsHtml = itemsForSeller.map((it: any) => {
        const desc = it.product.description ? `<div>${it.product.description}</div>` : "";
        const details = it.product.details ? `<div><small>${it.product.details}</small></div>` : "";
        return `<li><strong>${it.product.title}</strong> — Qty: ${it.quantity} — Price: ₹${it.price.toFixed(2)}${desc}${details}</li>`;
      }).join("");

      const customerName = order.user?.name || "Customer";
      const customerEmail = order.user?.email || "";
      const customerPhone = order.address?.phone || "";
      const shipping = `${order.address?.address}, ${order.address?.city}, ${order.address?.state}, ${order.address?.country} - ${order.address?.zipcode}`;

      const html = `
        <div style="font-family: Arial, sans-serif; color: #111;">
          <h2>New Order Received — Order #${order.id}</h2>
          <p><strong>Buyer:</strong> ${customerName} (${customerEmail})</p>
          <p><strong>Phone:</strong> ${customerPhone}</p>
          <p><strong>Shipping Address:</strong><br/>${shipping}</p>
          <h3>Items for you:</h3>
          <ul>${itemsHtml}</ul>
          <p><strong>Order Total (customer paid):</strong> ₹${order.total.toFixed(2)}</p>
        </div>
      `;

      try {
        await resend.emails.send({
          from: 'orders@lastseen.store',
          to: [sellerEmail],
          subject: `New order #${order.id} — details for your items`,
          html,
        });
      } catch (err) {
        console.error('Failed to send seller email', sellerEmail, err);
      }
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error: any) {
    console.error("RAZORPAY VERIFY ERROR", error);
    return NextResponse.json(
      { error: "Failed to verify payment", details: error.message },
      { status: 500 }
    );
  }
}
