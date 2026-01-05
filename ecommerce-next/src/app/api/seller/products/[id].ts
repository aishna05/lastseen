// File: app/api/seller/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export const dynamic = 'force-dynamic';

// ✅ GET Single Product
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = req.headers.get("authorization");
    const result = verifyToken(authHeader);

    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    if (result.decoded.role !== "SELLER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const pid = Number(params.id);
    if (isNaN(pid)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: pid }
    });

    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (product.sellerId !== result.decoded.userId) {
      return NextResponse.json({ error: "Not your product" }, { status: 403 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("GET /seller/products/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// ✅ UPDATE Product
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = req.headers.get("authorization");
    const result = verifyToken(authHeader);

    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    if (result.decoded.role !== "SELLER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const pid = Number(params.id);
    if (isNaN(pid)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    // Verify ownership
    const product = await prisma.product.findUnique({
      where: { id: pid }
    });

    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (product.sellerId !== result.decoded.userId) {
      return NextResponse.json({ error: "Not your product" }, { status: 403 });
    }

    const body = await req.json();

    const updated = await prisma.product.update({
      where: { id: pid },
      data: {
        title: body.title,
        description: body.description || "",
        details: body.details || null,
        price: Number(body.price),
        discount: body.discount ?? 0,
        brand: body.brand || null,
        gender: body.gender || "UNISEX",
        material: body.material || null,
        fabricCare: body.fabricCare || null,
        occasion: body.occasion || null,
        modelNumber: body.modelNumber || null,
        sku: body.sku || null,
        availableSizes: body.availableSizes ? JSON.stringify(body.availableSizes) : JSON.stringify([]),
        sizeStock: body.sizeStock ? JSON.stringify(body.sizeStock) : JSON.stringify({}),
        colors: body.colors ? JSON.stringify(body.colors) : JSON.stringify([]),
        imageUrls: body.imageUrls ? JSON.stringify(body.imageUrls) : JSON.stringify([]),
        weight: body.weight ?? null,
        dimensions: body.dimensions ?? null,
        returnPolicy: body.returnPolicy ?? null,
        sellerNotes: body.sellerNotes ?? null,
      }
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PUT /seller/products/[id] error:", error);
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}

// ✅ DELETE Product
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = req.headers.get("authorization");
    const result = verifyToken(authHeader);

    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    if (result.decoded.role !== "SELLER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const pid = Number(params.id);
    if (isNaN(pid)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    // Verify ownership
    const product = await prisma.product.findUnique({
      where: { id: pid }
    });

    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (product.sellerId !== result.decoded.userId) {
      return NextResponse.json({ error: "Not your product" }, { status: 403 });
    }

    // Soft-delete: mark product as inactive so it no longer appears
    await prisma.product.update({
      where: { id: pid },
      data: { isActive: false },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /seller/products/[id] error:", error);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}