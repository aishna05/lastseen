// GET (list seller products), POST (create product)
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "SELLER") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const sellerId = Number((session.user as any).id);
  const products = await prisma.product.findMany({
    where: { sellerId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "SELLER") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const sellerId = Number((session.user as any).id);
  const body = await req.json();
  const { title, description, price, discount, imageUrl } = body;

  const product = await prisma.product.create({
    data: {
      title,
      description: description || "",
      price,
      discount: discount ?? null,
      imageUrl: imageUrl || "",
      sellerId,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
