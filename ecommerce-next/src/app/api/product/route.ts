import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
export const dynamic = 'force-dynamic';
// ================== CREATE PRODUCT (SELLER ONLY) ==================
export async function POST(req: NextRequest) {
  try {
    // ---------- TOKEN CHECK ----------
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

    // ---------- SELLER ONLY ----------
    if (decoded.role !== "SELLER") {
      return NextResponse.json(
        { message: "Only SELLER can create product" },
        { status: 403 }
      );
    }

    // ---------- BODY ----------
    const {
      title,
      description,
      details,
      price,
      imageUrls,
      availableSizes,
      sizeStock,
      colors,
      categoryId,
      subcategoryId,
    } = await req.json();

    // ---------- VALIDATION ----------
    if (
      !title ||
      !description ||
      !price ||
      !categoryId ||
      !subcategoryId ||
      !availableSizes ||
      !sizeStock ||
      !colors
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ---------- FK VALIDATION (VERY IMPORTANT) ----------
    const sellerExists = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!sellerExists) {
      return NextResponse.json(
        { error: "Invalid seller ID" },
        { status: 400 }
      );
    }

    const categoryExists = await prisma.category.findUnique({
      where: { id: Number(categoryId) },
    });

    if (!categoryExists) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

    const subcategoryExists = await prisma.subcategory.findUnique({
      where: { id: Number(subcategoryId) },
    });

    if (!subcategoryExists) {
      return NextResponse.json(
        { error: "Invalid subcategory ID" },
        { status: 400 }
      );
    }

    // ---------- CREATE PRODUCT ----------
    const product = await prisma.product.create({
      data: {
        title,
        description,
        details,
        price: Number(price),

        imageUrls: JSON.stringify(imageUrls || []),
        availableSizes: JSON.stringify(availableSizes),
        sizeStock: JSON.stringify(sizeStock),
        colors: JSON.stringify(colors),

        categoryId: Number(categoryId),
        subcategoryId: Number(subcategoryId),
        sellerId: decoded.userId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        details: true,
        price: true,
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
    console.error("CREATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create product", message: error.message },
      { status: 400 }
    );
  }
}

// ================== GET ALL PRODUCTS ==================
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
