import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface Params {
  params: { id: string };
}

//  GET category by ID 
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;   
  const id = Number(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const category = await prisma.category.findUnique({
      where: { id },
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

    if (!category) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}



//  PUT update category (SELLER ONLY + JWT)
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
      email: string;
      role: string;
    };

    // SELLER ONLY
    if (decoded.role !== "SELLER") {
      return NextResponse.json(
        { message: "Only SELLER can update category" },
        { status: 403 }
      );
    }

    // 2. Body
    const { name, description } = await req.json();

    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    // 3. Update
    const updated = await prisma.category.update({
      where: { id },
      data: { name, description },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    return NextResponse.json(updated);

  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to update category", message: error.message },
      { status: 400 }
    );
  }
}


//  DELETE category (SELLER ONLY + JWT)
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
      email: string;
      role: string;
    };

    // SELLER ONLY
    if (decoded.role !== "SELLER") {
      return NextResponse.json(
        { message: "Only SELLER can delete category" },
        { status: 403 }
      );
    }

    // 2. Delete category
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({
      message: `Category with ID ${id} deleted successfully`,
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to delete category", message: error.message },
      { status: 400 }
    );
  }
}
