import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const userId = Number((session.user as any).id);
  const { productId } = await req.json();

  const existing = await prisma.cartItem.findFirst({
    where: { userId, productId },
  });

  if (existing) {
    const updated = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: { increment: 1 } },
    });
    return NextResponse.json(updated);
  }

  const created = await prisma.cartItem.create({
    data: { userId, productId, quantity: 1 },
  });

  return NextResponse.json(created, { status: 201 });
}
