import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

interface Params {
  params: { id: string };
}

// GET subcategory by ID
export async function GET(req: Request, { params }: Params) {
  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  try {
    const subcategory = await prisma.subcategory.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!subcategory) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(subcategory);
  } catch {
    return NextResponse.json({ error: "Failed to fetch subcategory" }, { status: 500 });
  }
}

// PUT update subcategory
export async function PUT(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const data = await req.json();

  try {
    const updated = await prisma.subcategory.update({
      where: { id },
      data,
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update subcategory" }, { status: 404 });
  }
}

// DELETE subcategory
export async function DELETE(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  try {
    const deleted = await prisma.subcategory.delete({ where: { id } });
    return NextResponse.json(deleted);
  } catch {
    return NextResponse.json({ error: "Failed to delete subcategory" }, { status: 404 });
  }
}
