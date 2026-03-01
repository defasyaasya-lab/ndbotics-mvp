import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const form = await req.formData();
  const id = String(form.get("id") || "");
  const qtyRaw = Number(form.get("qty") || 0);

  if (!id || Number.isNaN(qtyRaw)) {
    return new Response("Bad request", { status: 400 });
  }

  if (qtyRaw <= 0) {
    await prisma.cartItem.delete({ where: { id } });
  } else {
    const qty = Math.max(1, Math.floor(qtyRaw));
    await prisma.cartItem.update({
      where: { id },
      data: { qty },
    });
  }
  revalidatePath("/");
  revalidatePath("/cart");
  revalidatePath("/checkout");

  return Response.json({ ok: true });
}