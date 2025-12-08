
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

// ADD an item to the cart (customer only)
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ message: "No token provided" }, { status: 401 });

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
      role: string;
    };

    if (decoded.role !== "CUSTOMER")
      return NextResponse.json(
        { message: "Only CUSTOMER can add to cart" },
        { status: 403 }
      );

    const { productId, quantity } = await req.json();

    if (!productId)
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId: decoded.userId,
        productId: Number(productId),
      },
    });

    // ✅ UPDATE QUANTITY
    if (existingItem) {
      const updated = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + (quantity || 1) },
        select: {
          id: true,
          productId: true,
          userId: true,
          quantity: true,
        },
      });

      return NextResponse.json({
        message: "Cart updated",
        item: updated,
      });
    }

    // ✅ CREATE NEW CART ITEM
    const newItem = await prisma.cartItem.create({
      data: {
        userId: decoded.userId,
        productId: Number(productId),
        quantity: quantity || 1,
      },
      select: {
        id: true,
        productId: true,
        userId: true,
        quantity: true,
      },
    });

    return NextResponse.json(
      { message: "Item added to cart", item: newItem },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to add item to cart", message: error.message },
      { status: 500 }
    );
  }
}


//view cart items
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ message: "No token provided" }, { status: 401 });

    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };

    const cart = await prisma.cartItem.findMany({
      where: { userId: decoded.userId },
      select: {
        id: true,
        quantity: true,
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            imageUrls: true,
          },
        },
      },
    });

    return NextResponse.json(cart);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// CLEAR the cart (customer only)
export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ message: "No token provided" }, { status: 401 });

    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };

    await prisma.cartItem.deleteMany({
      where: { userId: decoded.userId },
    });

    return NextResponse.json({ message: "Cart cleared successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
