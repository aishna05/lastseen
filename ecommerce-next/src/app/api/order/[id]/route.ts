import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest, context: { params: { id: string } | Promise<{ id: string }> }) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ message: "No token" }, { status: 401 });

    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number; role: string };

    if (decoded.role !== "CUSTOMER") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    // ✅ Await params if it's a Promise
    const params = await context.params;
    const orderId = Number(params.id);
    if (!orderId || isNaN(orderId)) return NextResponse.json({ message: "Invalid orderId" }, { status: 400 });

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: decoded.userId },
      include: {
        address: { select: { address: true, city: true, state: true, country: true, zipcode: true } },
        items: {
          select: { productId: true, quantity: true, price: true, product: { select: { title: true, price: true } } },
        },
      },
    });

    if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });

    return NextResponse.json({ order }, { status: 200 });
  } catch (error: any) {
    console.error("GET SINGLE ORDER ERROR:", error);
    return NextResponse.json({ error: "Failed", message: error.message }, { status: 500 });
  }
}


