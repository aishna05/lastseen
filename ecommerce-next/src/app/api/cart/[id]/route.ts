import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
export const dynamic = 'force-dynamic';
// UPDATE item quantity in cart (customer only)
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ message: "No token provided" }, { status: 401 });

    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };

    const { quantity } = await req.json();

    if (!quantity || quantity < 1)
      return NextResponse.json({ error: "Quantity must be >= 1" }, { status: 400 });

    const updated = await prisma.cartItem.updateMany({
      where: { id: Number(id), userId: decoded.userId },
      data: { quantity },
    });

    if (updated.count === 0)
      return NextResponse.json({ error: "Item not found" }, { status: 404 });

    return NextResponse.json({ message: "Quantity updated" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// REMOVE item from cart (customer only)
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ message: "No token provided" }, { status: 401 });

    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };

    const deleted = await prisma.cartItem.deleteMany({
      where: { id: Number(id), userId: decoded.userId },
    });

    if (deleted.count === 0)
      return NextResponse.json({ error: "Item not found" }, { status: 404 });

    return NextResponse.json({ message: "Item removed from cart" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
