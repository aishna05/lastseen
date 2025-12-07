// src/app/api/profile/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/lib/auth"; // you already have this

// GET /api/profile  → get current user's profile
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const { valid, decoded, error } = verifyToken(authHeader);

    if (!valid || !decoded) {
      return NextResponse.json(
        { message: error ?? "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/profile error:", err?.message, err);
    return NextResponse.json(
      { message: "Server error", error: err?.message },
      { status: 500 }
    );
  }
}

// PUT /api/profile  → update name and/or password
export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const { valid, decoded, error } = verifyToken(authHeader);

    if (!valid || !decoded) {
      return NextResponse.json(
        { message: error ?? "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, password } = body as {
      name?: string;
      password?: string;
    };

    if (!name && !password) {
      return NextResponse.json(
        { message: "Nothing to update" },
        { status: 400 }
      );
    }

    const data: any = {};
    if (name) data.name = name;
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      data.password = hashed;
    }

    const updated = await prisma.user.update({
      where: { id: decoded.userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    console.error("PUT /api/profile error:", err?.message, err);
    return NextResponse.json(
      { message: "Server error", error: err?.message },
      { status: 500 }
    );
  }
}

// DELETE /api/profile  → delete current user account
export async function DELETE(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const { valid, decoded, error } = verifyToken(authHeader);

    if (!valid || !decoded) {
      return NextResponse.json(
        { message: error ?? "Unauthorized" },
        { status: 401 }
      );
    }

    // ⚠ NOTE: this may fail if there are related products/orders/cartItems
    // You can later add onDelete: Cascade in schema or handle child deletes manually
    await prisma.user.delete({
      where: { id: decoded.userId },
    });

    return NextResponse.json(
      { message: "Account deleted" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("DELETE /api/profile error:", err?.message, err);
    return NextResponse.json(
      { message: "Server error", error: err?.message },
      { status: 500 }
    );
  }
}
