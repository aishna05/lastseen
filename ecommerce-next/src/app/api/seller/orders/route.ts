import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

// Helper function (similar to one used previously)
const verifySellerToken = (authHeader: string | null) => {
  if (!authHeader) return { valid: false, message: "No token provided" };

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;
  const secret = process.env.JWT_SECRET;
  if (!secret) return { valid: false, message: "JWT secret not set" };

  try {
    const decoded = jwt.verify(token, secret) as { userId: number; role: string };

    if (decoded.role !== "SELLER") {
      return { valid: false, message: "Access denied. Not a SELLER." };
    }
    return { valid: true, decoded };
  } catch (error: any) {
    return { valid: false, message: "Invalid or expired token" };
  }
};

// GET /api/seller/orders -> Get all orders containing this seller's products
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const { valid, decoded, message } = verifySellerToken(authHeader);

    if (!valid || !decoded) {
      return NextResponse.json({ message: message || "Unauthorized" }, { status: 401 });
    }

    const sellerId = decoded.userId;

    // 1. Find all OrderItems linked to this seller's products
    const orderItems = await prisma.orderItem.findMany({
      where: {
        product: {
          sellerId: sellerId,
        },
      },
      select: {
        id: true,
        quantity: true,
        price: true,
        orderId: true,
        product: {
          select: {
            id: true,
            title: true,
            imageUrls: true,
          },
        },
      },
    });

    if (orderItems.length === 0) {
      return NextResponse.json({ orders: [] }, { status: 200 });
    }

    // 2. Group items by their parent Order ID
    const ordersMap = new Map<number, typeof orderItems>();
    for (const item of orderItems) {
      if (!ordersMap.has(item.orderId)) {
        ordersMap.set(item.orderId, []);
      }
      ordersMap.get(item.orderId)?.push(item);
    }

    const orderIds = Array.from(ordersMap.keys());

    // 3. Fetch the full Order and Address details
    const ordersWithDetails = await prisma.order.findMany({
      where: {
        id: { in: orderIds },
      },
      select: {
        id: true,
        createdAt: true,
        status: true,
        total: true, // Total order value (customer paid)
        address: {
          select: {
            address: true,
            city: true,
            state: true,
            country: true,
            zipcode: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    // 4. Combine Order details with Seller-specific items
    const sellerOrders = ordersWithDetails.map(order => ({
      ...order,
      sellerItems: ordersMap.get(order.id) || [],
      // Calculate revenue just for this seller's products in this order
      sellerRevenue: (ordersMap.get(order.id) || []).reduce((sum, item) => sum + (item.price * item.quantity), 0),
    }));


    return NextResponse.json({ orders: sellerOrders }, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/seller/orders error:", err);
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}