// src/lib/cart.ts
import { prisma } from "@/lib/prisma";

export async function getCartCount(sessionId: string) {
  const count = await prisma.cartItem.count({
    where: { sessionId },
  });

  // jumlah produk unik (jumlah baris cartItem)
  return count;
}