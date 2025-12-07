// src/app/api/categories/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// GET all categories - list of all categories (no auth)
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        subcategories: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}



//  POST create category (SELLER ONLY) - JWT auth
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

    // ✅ ✅ SELLER-ONLY CHECK
    if (decoded.role !== "SELLER") {
      return NextResponse.json(
        { message: "Only SELLER can create category" },
        { status: 403 }
      );
    }

    // 3. Get request body
    const { name, description } = await req.json();

    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    // 4. Create category
    const category = await prisma.category.create({
      data: { name, description },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Invalid or expired token", error: error.message },
      { status: 401 }
    );
  }
}
