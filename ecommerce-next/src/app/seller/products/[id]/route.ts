// src/app/api/seller/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySellerAuth } from "@/lib/auth"; // Import from the auth file

type RouteParams = {
  params: Promise<{ id: string }>;
};

// GET /api/seller/products/:id
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const authHeader = req.headers.get("authorization");
    const auth = verifySellerAuth(authHeader);

    if (!auth.valid) {
      const status = auth.error === "Forbidden: Not a seller" ? 403 : 401;
      return NextResponse.json({ message: auth.error }, { status });
    }

    // Convert URL param to Number for Prisma Query (assuming Product.id is an Int)
    const productId = Number(id); 

    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        // Ensure this matches the type of sellerId in your schema (String or Number)
        sellerId: Number(auth.decoded.userId), 
      },
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET Product Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PUT /api/seller/products/:id
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: paramId } = await params;
    const authHeader = req.headers.get("authorization");
    const auth = verifySellerAuth(authHeader);

    if (!auth.valid) {
      const status = auth.error === "Forbidden: Not a seller" ? 403 : 401;
      return NextResponse.json({ message: auth.error }, { status });
    }

    const sellerId = String(auth.decoded.userId);
    const id = Number(paramId);
    const body = await req.json();
    const { title, description, price, discount, imageUrls } = body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing || String(existing.sellerId) !== sellerId) {
      return NextResponse.json({ message: "Not found or unauthorized" }, { status: 404 });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        title,
        description,
        price,
        discount: discount ?? null,
        imageUrls: Array.isArray(imageUrls) ? JSON.stringify(imageUrls) : imageUrls,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT Product Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
// DELETE /api/seller/products/:id
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: paramId } = await params;
    const authHeader = req.headers.get("authorization");
    const auth = verifySellerAuth(authHeader);

    if (!auth.valid) {
      const status = auth.error === "Forbidden: Not a seller" ? 403 : 401;
      return NextResponse.json({ message: auth.error }, { status });
    }

    const sellerId = Number(auth.decoded.userId);
    const id = Number(paramId);

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing || existing.sellerId !== sellerId) {
      return NextResponse.json({ message: "Not found or unauthorized" }, { status: 404 });
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error("DELETE Product Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}