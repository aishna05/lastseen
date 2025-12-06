import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = { params: { id: string } };

export async function DELETE(req: Request, { params }: Params) {
  const id = Number(params.id);
  await prisma.cartItem.delete({ where: { id } });
  return NextResponse.json({ message: "deleted" });
}
