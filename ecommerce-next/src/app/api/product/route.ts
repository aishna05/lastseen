import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// CREATE Product
export async function POST(req: NextRequest) {
  try {
    const { title, description, details, price, hsn, imageUrls, categoryId, subcategoryId, sellerId } = await req.json();

    if (!title || !description || !price || !categoryId || !subcategoryId || !sellerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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
        sellerId,
      },
    });

    return NextResponse.json({ product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// LIST all Products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        subcategory: true,
        seller: true,
      },
    });

    const formattedProducts = products.map(p => ({
      ...p,
      imageUrls: JSON.parse(p.imageUrls),
    }));

    return NextResponse.json(formattedProducts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
