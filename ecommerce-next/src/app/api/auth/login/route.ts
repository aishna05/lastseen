// src/app/api/auth/login/route.ts
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // 1. Input Validation
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // 2. Find User by Email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // User not found
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 3. CRITICAL DEFENSIVE CHECK: Ensure the password field exists and is not null
    // This prevents a crash if a user was created without a password hash (e.g., via a social login).
    if (!user.password) {
      console.error(`User ${user.email} found but has no password hash.`);
      return NextResponse.json(
        { message: "Invalid credentials or account issue" },
        { status: 401 }
      );
    }
    
    // 4. Compare Passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 5. Server Config Check (JWT Secret)
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is not set");
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    // 6. Generate JWT
    const token = jwt.sign(
      {
        userId: user.id, // ID is a number here
        email: user.email,
        role: user.role,
      },
      secret,
      { expiresIn: "7d" }
    );

    // 7. Success Response (200 OK)
    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
      { status: 200 }
    );
  } catch (err) {
    // 8. Log the error details for debugging
    console.error("Login API route crash:", err);
    return NextResponse.json(
      { message: "Server error during login", details: (err as Error).message },
      { status: 500 }
    );
  }
}