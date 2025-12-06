import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

interface Params {
  params: { id: string };
}

// GET category by ID
export async function GET(req: Request, { params }: Params) {
  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { subcategories: true },
    });
    if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
  }
}

// PUT update category
export async function PUT(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const data = await req.json();

  try {
    const updated = await prisma.category.update({
      where: { id },
      data,
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update category" }, { status: 404 });
  }
}

// DELETE category
export async function DELETE(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  try {
    const deleted = await prisma.category.delete({ where: { id } });
    return NextResponse.json(deleted);
  } catch {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 404 });
  }
}
