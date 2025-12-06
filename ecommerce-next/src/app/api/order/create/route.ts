import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const userId = Number((session.user as any).id);

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  if (cartItems.length === 0)
    return NextResponse.json({ message: "Cart empty" }, { status: 400 });

  const total = cartItems.reduce((sum, item) => {
    const price = item.product.price * (1 - (item.product.discount ?? 0) / 100);
    return sum + price * item.quantity;
  }, 0);

  const order = await prisma.order.create({
    data: {
      userId,
      total,
      items: {
        create: cartItems.map((item) => ({
          productId: item.productId,
          price: item.product.price,
          quantity: item.quantity,
        })),
      },
    },
  });

  await prisma.cartItem.deleteMany({ where: { userId } });

  return NextResponse.json(order, { status: 201 });
}
