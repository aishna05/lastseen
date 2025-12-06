import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

// GET single product
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(params.id) },
      include: { category: true, subcategory: true, seller: true },
    });

    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json({ ...product, imageUrls: JSON.parse(product.imageUrls) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// UPDATE product
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const data = await req.json();

    if (data.imageUrls) data.imageUrls = JSON.stringify(data.imageUrls);

    const updatedProduct = await prisma.product.update({
      where: { id: Number(params.id) },
      data,
    });

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await prisma.product.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
