import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
export const dynamic = 'force-dynamic';

// ✅ GET Seller Products
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    const result = verifyToken(authHeader);

    if (!result.valid) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    if (result.decoded.role !== "SELLER") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const products = await prisma.product.findMany({
      where: { sellerId: result.decoded.userId },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("GET /seller/products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// ✅ CREATE Product
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    const result = verifyToken(authHeader);

    if (!result.valid) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    if (result.decoded.role !== "SELLER") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const product = await prisma.product.create({
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
        availableSizes: JSON.stringify(body.availableSizes || []),
        sizeStock: JSON.stringify(body.sizeStock || {}),
        colors: JSON.stringify(body.colors || []),
        imageUrls: JSON.stringify(body.imageUrls || []),
        weight: body.weight ?? null,
        dimensions: body.dimensions ?? null,
        returnPolicy: body.returnPolicy ?? null,
        sellerNotes: body.sellerNotes ?? null,
        sellerId: result.decoded.userId,
        categoryId: Number(body.categoryId) ?? 1,
        subcategoryId: Number(body.subcategoryId) ?? 1,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST /seller/products error:", error);
    return NextResponse.json(
      { error: "Product creation failed" },
      { status: 500 }
    );
  }
}
