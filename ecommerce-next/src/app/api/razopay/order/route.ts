// src/app/api/razorpay/order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth"; // or your auth method

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await getServerSession(); // adjust based on your auth
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { addressId } = body;

    if (!addressId) {
      return NextResponse.json(
        { error: "Address ID is required" },
        { status: 400 }
      );
    }

    // 2. Fetch cart items with product details
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: true,
      },
    });

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // 3. Calculate total from actual product prices
    let total = 0;
    const orderItemsData = [];

    for (const item of cartItems) {
      const product = item.product;
      const discountedPrice = product.discount 
        ? product.price * (1 - product.discount / 100)
        : product.price;
      
      const itemTotal = discountedPrice * item.quantity;
      total += itemTotal;

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: discountedPrice,
      });
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