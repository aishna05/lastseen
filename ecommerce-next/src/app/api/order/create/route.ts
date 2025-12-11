import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

// ✅ CREATE ORDER WITH CUSTOMER ADDRESS
export async function POST(req: NextRequest) {
  try {
    // ✅ 1. AUTH HEADER CHECK
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { message: "JWT secret missing" },
        { status: 500 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: number;
      role: string;
    };

    // ✅ 2. ROLE CHECK
    if (decoded.role !== "CUSTOMER") {
      return NextResponse.json(
        { message: "Only CUSTOMER can place order" },
        { status: 403 }
      );
    }

    // ✅ 3. BODY PARSING
    const body = await req.json();
    const addressId = Number(body.addressId);

    if (!addressId || isNaN(addressId)) {
      return NextResponse.json(
        { message: "Valid numeric addressId is required" },
        { status: 400 }
      );
    }

    // ✅ 4. VERIFY ADDRESS BELONGS TO CUSTOMER
    const address = await prisma.customerAddress.findFirst({
      where: { id: addressId, userId: decoded.userId },
    });

    if (!address) {
      return NextResponse.json({ message: "Invalid address" }, { status: 404 });
    }

    // ✅ 5. FETCH CART ITEMS
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: decoded.userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    // ✅ 6. TOTAL CALCULATION
    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // ✅ 7. CREATE ORDER + ORDER ITEMS
    const order = await prisma.order.create({
      data: {
        userId: decoded.userId,
        addressId: address.id,
        total,
        status: "PLACED",
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        address: {
          select: {
            address: true,
            city: true,
            state: true,
            country: true,
            zipcode: true,
          },
        },
        items: {
          select: {
            productId: true,
            quantity: true,
            price: true,
            product: {
              select: {
                title: true,
                price: true,
              },
            },
          },
        },
      },
    });

    // ✅ 8. CLEAR CART AFTER ORDER
    await prisma.cartItem.deleteMany({ where: { userId: decoded.userId } });

    // ✅ 9. SUCCESS RESPONSE (cleaned)
    return NextResponse.json(
      { id: order.id,  
        message: "Order placed successfully",
        order,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("ORDER ERROR:", error);
    return NextResponse.json(
      { error: "Order failed", message: error.message },
      { status: 500 }
    );
  }
}





