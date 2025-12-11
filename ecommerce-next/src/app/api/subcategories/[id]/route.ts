import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = Number(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const subcategory = await prisma.subcategory.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    if (!subcategory) {
      return NextResponse.json({ error: "Subcategory not found" }, { status: 404 });
    }

    return NextResponse.json(subcategory);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch subcategory", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = Number(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // 1. Token check
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ message: "No token provided" }, { status: 401 });

    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
    const secret = process.env.JWT_SECRET;
    if (!secret) return NextResponse.json({ message: "JWT secret not set" }, { status: 500 });

    const decoded = jwt.verify(token, secret) as { userId: number; email: string; role: string };

    // 2. SELLER ONLY
    if (decoded.role !== "SELLER") {
      return NextResponse.json({ message: "Only SELLER can update subcategory" }, { status: 403 });
    }

    const { name, description, categoryId } = await req.json();

    const updated = await prisma.subcategory.update({
      where: { id },
      data: { name, description, categoryId },
      select: { id: true, name: true, description: true, categoryId: true },
    });

    return NextResponse.json({ message: "Subcategory updated successfully", updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to update subcategory", message: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = Number(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // 1. Token check
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ message: "No token provided" }, { status: 401 });

    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
    const secret = process.env.JWT_SECRET;
    if (!secret) return NextResponse.json({ message: "JWT secret not set" }, { status: 500 });

    const decoded = jwt.verify(token, secret) as { userId: number; email: string; role: string };

    // 2. SELLER ONLY
    if (decoded.role !== "SELLER") {
      return NextResponse.json({ message: "Only SELLER can delete subcategory" }, { status: 403 });
    }

    const deleted = await prisma.subcategory.delete({
      where: { id },
      select: { id: true, name: true, description: true, categoryId: true },
    });

    return NextResponse.json({ message: "Subcategory deleted successfully", deleted });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to delete subcategory", message: error.message },
      { status: 400 }
    );
  }
}
