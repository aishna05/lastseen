import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

// CREATE Product (SELLER ONLY)
export async function POST(req: NextRequest) {
  try {
    // 1. Token check
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;
    const secret = process.env.JWT_SECRET;
    if (!secret)
      return NextResponse.json(
        { message: "JWT secret not set" },
        { status: 500 }
      );

    const decoded = jwt.verify(token, secret) as {
      userId: number;
      role: string;
    };

    // 2. SELLER only
    if (decoded.role !== "SELLER") {
      return NextResponse.json(
        { message: "Only SELLER can create product" },
        { status: 403 }
      );
    }

    const {
      title,
      description,
      details,
      price,
      hsn,
      imageUrls,
      categoryId,
      subcategoryId,
    } = await req.json();

    if (!title || !description || !price || !categoryId || !subcategoryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        title,
        description,
        details,
        price,
        hsn,
        imageUrls: JSON.stringify(imageUrls || []),
        categoryId,
        subcategoryId,
        sellerId: decoded.userId,
      },
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

    return NextResponse.json(
      { message: "Product created successfully", product },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create product", message: error.message },
      { status: 400 }
    );
  }
}

// LIST all Products (no auth)
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: { select: { id: true, name: true, description: true } },
        subcategory: { select: { id: true, name: true, description: true } },
        seller: { select: { id: true, name: true, email: true } },
      },
    });

    const formattedProducts = products.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      details: p.details,
      price: p.price,
      hsn: p.hsn,
      imageUrls: JSON.parse(p.imageUrls),
      category: p.category,
      subcategory: p.subcategory,
      seller: p.seller,
    }));

    return NextResponse.json(formattedProducts);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch products", message: error.message },
      { status: 500 }
    );
  }
}
