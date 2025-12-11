// src/app/api/order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ message: "No token provided" }, { status: 401 });

    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number; role: string };

    if (decoded.role !== "CUSTOMER") return NextResponse.json({ message: "Only CUSTOMER can view orders" }, { status: 403 });

    const orders = await prisma.order.findMany({
      where: { userId: decoded.userId },
      include: {
        items: {
          include: { product: { select: { title: true, price: true } } }
        },
        address: true
      },
      orderBy: { id: "desc" }
    });

    return NextResponse.json({ orders });
  } catch (err: any) {
    console.error("GET ORDERS ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
