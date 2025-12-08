import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

async function verifyCustomer(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) throw { status: 401, message: "No token provided" };
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number; role: string };
  if (decoded.role !== "CUSTOMER") throw { status: 403, message: "Only CUSTOMER allowed" };
  return decoded.userId;
}

export async function POST(req: NextRequest) {
  try {
    const userId = await verifyCustomer(req);
    const body = await req.json();
    const orderId = Number(body.orderId);

    if (!orderId || isNaN(orderId))
      return NextResponse.json({ message: "Valid numeric orderId required" }, { status: 400 });

    const order = await prisma.order.findFirst({ where: { id: orderId, userId } });
    if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });

    if (order.status === "CANCELLED") return NextResponse.json({ message: "Order already cancelled" }, { status: 400 });
    if (!["PLACED", "PENDING"].includes(order.status))
      return NextResponse.json({ message: "Cannot cancel order after processing" }, { status: 400 });

    const cancelledOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
      include: {
        address: { select: { address: true, city: true, state: true, country: true, zipcode: true } },
        items: {
          select: {
            productId: true,
            quantity: true,
            price: true,
            product: { select: { id: true, title: true, price: true } },
          },
        },
      },
    });

    return NextResponse.json({ message: "Order cancelled successfully", order: cancelledOrder }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Cancel failed", message: error.message || error }, { status: error.status || 500 });
  }
}
