// src/app/api/subcategories/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// GET all subcategories (no auth)
export async function GET() {
  try {
    const subcategories = await prisma.subcategory.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        category: {        // include category details here
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });
    return NextResponse.json(subcategories);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch subcategories", details: error.message },
      { status: 500 }
    );
  }
}

// POST create a new subcategory (SELLER ONLY + JWT)
export async function POST(req: Request) {
  try {
    // 1. Get token from header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    // 2. Verify token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json(
        { message: "JWT secret not set" },
        { status: 500 }
      );
    }

    const decoded = jwt.verify(token, secret) as {
      userId: number;
      email: string;
      role: string;
    };

    // 3. SELLER only
    if (decoded.role !== "SELLER") {
      return NextResponse.json(
        { message: "Only SELLER can create subcategory" },
        { status: 403 }
      );
    }

    // 4. Get request body
    const { name, description, categoryId } = await req.json();
    if (!name || !description || !categoryId) {
      return NextResponse.json(
        { error: "Name, description, and categoryId are required" },
        { status: 400 }
      );
    }

    // 5. Create subcategory
    const subcategory = await prisma.subcategory.create({
      data: { name, description, categoryId },
      select: {
        id: true,
        name: true,
        description: true,
        categoryId: true,
      },
    });

    return NextResponse.json(
      { message: "Subcategory created successfully", subcategory },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to create subcategory", error: error.message },
      { status: 400 }
    );
  }
}
