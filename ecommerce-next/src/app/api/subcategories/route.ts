import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// GET all subcategories
export async function GET() {
  try {
    const subcategories = await prisma.subcategory.findMany({
      include: { category: true },
    });
    return NextResponse.json(subcategories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch subcategories" }, { status: 500 });
  }
}

// POST create a new subcategory (auth required)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { name, description, categoryId } = await req.json();

  if (!name || !description || !categoryId) {
    return NextResponse.json(
      { error: "Name, description, and categoryId are required" },
      { status: 400 }
    );
  }

  try {
    const subcategory = await prisma.subcategory.create({
      data: { name, description, categoryId },
    });
    return NextResponse.json(subcategory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create subcategory" }, { status: 500 });
  }
}
