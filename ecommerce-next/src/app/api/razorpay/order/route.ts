// src/app/api/razorpay/order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user via JWT (same pattern as other APIs)
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ error: "Server JWT not configured" }, { status: 500 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (decoded.role !== "CUSTOMER") {
      return NextResponse.json({ error: "Only CUSTOMER can create orders" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await req.json();
    const { addressId, directBuy, productId, quantity } = body;

    if (!addressId) {
      return NextResponse.json(
        { error: "Address ID is required" },
        { status: 400 }
      );
    }

    // 2. Determine items and total. Support direct buy or cart checkout
    let total = 0;
    const orderItemsData: any[] = [];

    if (directBuy) {
      // productId and quantity expected
      if (!productId) return NextResponse.json({ error: "productId required for direct buy" }, { status: 400 });
      const prod = await prisma.product.findUnique({ where: { id: Number(productId) } });
      if (!prod) return NextResponse.json({ error: "Product not found" }, { status: 404 });
      const qty = Number(quantity || 1);
      const discountedPrice = prod.discount ? prod.price * (1 - prod.discount / 100) : prod.price;
      total = discountedPrice * qty;
      orderItemsData.push({ productId: prod.id, quantity: qty, price: discountedPrice });
    } else {
      const cartItems = await prisma.cartItem.findMany({ where: { userId: user.id }, include: { product: true } });
      if (cartItems.length === 0) {
        return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
      }

      for (const item of cartItems) {
        const product = item.product;
        const discountedPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price;
        const itemTotal = discountedPrice * item.quantity;
        total += itemTotal;
        orderItemsData.push({ productId: product.id, quantity: item.quantity, price: discountedPrice, size: item.size || null });
      }
    }

    if (!addressId) {
      return NextResponse.json({ error: "Address ID is required" }, { status: 400 });
    }

    // verify address belongs to user
    const address = await prisma.customerAddress.findFirst({ where: { id: Number(addressId), userId: user.id } });
    if (!address) {
      return NextResponse.json({ error: "Invalid address" }, { status: 404 });
    }

    // 4. Create order in database with PENDING status
    const dbOrder = await prisma.order.create({
      data: {
        userId: user.id,
        addressId: addressId,
        total: total,
        status: "PENDING",
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // 5. Create Razorpay order
    const razorpayOptions = {
      amount: Math.round(total * 100), // Convert to paise
      currency: "INR",
      receipt: `order_${dbOrder.id}`,
      notes: {
        orderId: dbOrder.id.toString(),
        userId: user.id.toString(),
      },
    };

    const razorpayOrder = await razorpay.orders.create(razorpayOptions);

    // If this was a cart checkout, clear the cart now that order is created
    if (!directBuy) {
      await prisma.cartItem.deleteMany({ where: { userId: user.id } });
    }

    // 6. Return order details
    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      dbOrderId: dbOrder.id,
      total: total,
    });

  } catch (error: any) {
    console.error("RAZORPAY ORDER ERROR", error);
    return NextResponse.json(
      { error: "Failed to create order", details: error.message },
      { status: 500 }
    );
  }
}
