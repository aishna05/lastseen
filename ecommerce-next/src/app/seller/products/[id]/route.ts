import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

type Params = { params: { id: string } };

export async function PUT(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "SELLER") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const sellerId = Number((session.user as any).id);
  const id = Number(params.id);
  const body = await req.json();
  const { title, description, price, discount, imageUrl } = body;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing || existing.sellerId !== sellerId) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      title,
      description,
      price,
      discount: discount ?? null,
      imageUrl,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "SELLER") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const sellerId = Number((session.user as any).id);
  const id = Number(params.id);

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing || existing.sellerId !== sellerId) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ message: "Deleted" });
}
