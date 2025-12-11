// src/app/api/customer-addresses/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

// GET all addresses for customer
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ message: "No token provided" }, { status: 401 });

    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as { userId: number; role: string };

    // Return all customer addresses
    const addresses = await prisma.customerAddress.findMany({
      select: {
        id: true,
        userId: true, 
        address: true,
        city: true,
        state: true,
        country: true,
        zipcode: true,
      },
    });

    return NextResponse.json(addresses);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// CREATE a new address
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ message: "No token provided" }, { status: 401 });

    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as { userId: number; role: string };

    if (decoded.role !== "CUSTOMER")
      return NextResponse.json({ message: "Only CUSTOMER can add address" }, { status: 403 });

    const { address, city, state, country, zipcode } = await req.json();

    if (!address || !city || !state || !country || !zipcode)
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });

    const newAddress = await prisma.customerAddress.create({
      data: {
        userId: decoded.userId,
        address,
        city,
        state,
        country,
        zipcode,
      },
      select: {
        id: true,
        userId: true,
        address: true,
        city: true,
        state: true,
        country: true,
        zipcode: true,
      },
    });

    return NextResponse.json({ message: "Address created successfully", newAddress }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


