// lib/getProduct.ts
import { prisma } from "@/lib/prisma";

export async function getProductById(id: number) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      subcategory: true,
      seller: true,
    },
  });
}
