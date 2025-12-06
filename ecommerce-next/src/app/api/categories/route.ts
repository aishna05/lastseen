import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// GET all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { subcategories: true },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// POST create a new category (auth required)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { name, description } = await req.json();
  if (!name || !description) {
    return NextResponse.json({ error: "Name and description are required" }, { status: 400 });
  }

  try {
    const category = await prisma.category.create({
      data: { name, description },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
