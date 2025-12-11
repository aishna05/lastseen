import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

// -----------------------------------------
// 🔥 Universal param reader (Turbopack-safe)
// -----------------------------------------
async function getParams(
  context: { params: { id: string } | Promise<{ id: string }> }
): Promise<{ id: string }> {
  return await context.params; // works for both {id} and Promise<{id}>
}

// -----------------------------------------
// ✅ GET PRODUCT (PUBLIC)
// -----------------------------------------
export async function GET(
  req: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id } = await getParams(context);

    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: {
        category: { select: { id: true, name: true, description: true } },
        subcategory: { select: { id: true, name: true, description: true } },
        seller: { select: { id: true, name: true, email: true } },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: product.id,
      title: product.title,
      description: product.description,
      details: product.details,
      price: product.price,
      hsn: product.hsn,
      imageUrls: product.imageUrls ? JSON.parse(product.imageUrls) : [],
      category: product.category,
      subcategory: product.subcategory,
      seller: product.seller,
    });
  } catch (error: any) {
    console.error("GET PRODUCT ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// -----------------------------------------
// ✅ UPDATE PRODUCT (SELLER ONLY)
// -----------------------------------------
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id } = await getParams(context);

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ message: "JWT secret not set" }, { status: 500 });
    }

    const decoded = jwt.verify(token, secret) as {
      userId: number;
      role: string;
    };

    if (decoded.role !== "SELLER") {
      return NextResponse.json(
        { message: "Only SELLER can update product" },
        { status: 403 }
      );
    }

    const data = await req.json();

    // Convert arrays/objects to JSON strings
    if (Array.isArray(data.availableSizes))
      data.availableSizes = JSON.stringify(data.availableSizes);

    if (Array.isArray(data.colors))
      data.colors = JSON.stringify(data.colors);

    if (data.sizeStock && typeof data.sizeStock === "object")
      data.sizeStock = JSON.stringify(data.sizeStock);

    if (Array.isArray(data.imageUrls))
      data.imageUrls = JSON.stringify(data.imageUrls);

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data,
      select: {
        id: true,
        title: true,
        description: true,
        details: true,
        price: true,
        hsn: true,
        imageUrls: true,
        categoryId: true,
        subcategoryId: true,
        sellerId: true,
      },
    });

    return NextResponse.json({
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error: any) {
    console.error("UPDATE PRODUCT ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// -----------------------------------------
// ✅ DELETE PRODUCT (SELLER ONLY)
// -----------------------------------------
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id } = await getParams(context);

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ message: "JWT secret not set" }, { status: 500 });
    }

    const decoded = jwt.verify(token, secret) as {
      userId: number;
      role: string;
    };

    if (decoded.role !== "SELLER") {
      return NextResponse.json(
        { message: "Only SELLER can delete product" },
        { status: 403 }
      );
    }

    await prisma.product.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("DELETE PRODUCT ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
