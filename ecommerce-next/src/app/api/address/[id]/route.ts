import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

// UPDATE a customer address
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await context.params;

    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as {
      userId: number;
      role: string;
    };

    if (decoded.role !== "CUSTOMER")
      return NextResponse.json(
        { message: "Only CUSTOMER can update address" },
        { status: 403 }
      );

    const data = await req.json();

    // First, check if the address exists and belongs to the user
    const existingAddress = await prisma.customerAddress.findFirst({
      where: { id: Number(id), userId: decoded.userId },
    });

    if (!existingAddress)
      return NextResponse.json(
        { error: "Address not found or not yours" },
        { status: 404 }
      );

    // Update the address
    const updatedAddress = await prisma.customerAddress.update({
      where: { id: Number(id) },
      data,
      select: {
        id: true,
        address: true,
        city: true,
        state: true,
        country: true,
        zipcode: true,
      },
    });

    return NextResponse.json({
      message: "Address updated successfully",
      updatedAddress,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET a single customer address by ID
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const address = await prisma.customerAddress.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        address: true,
        city: true,
        state: true,
        country: true,
        zipcode: true,
      },
    });

    if (!address)
      return NextResponse.json({ error: "Address not found" }, { status: 404 });

    return NextResponse.json(address);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// DELETE a customer address
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as {
      userId: number;
      role: string;
    };

    if (decoded.role !== "CUSTOMER")
      return NextResponse.json(
        { message: "Only CUSTOMER can delete address" },
        { status: 403 }
      );

    // Find the address first
    const addressToDelete = await prisma.customerAddress.findFirst({
      where: { id: Number(id), userId: decoded.userId },
      select: {
        id: true,
        address: true,
        city: true,
        state: true,
        country: true,
        zipcode: true,
      },
    });

    if (!addressToDelete)
      return NextResponse.json(
        { error: "Address not found or not yours" },
        { status: 404 }
      );

    await prisma.customerAddress.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({
      message: "Address deleted successfully",
      deletedAddress: addressToDelete,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
