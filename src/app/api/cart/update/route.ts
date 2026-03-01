import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const form = await req.formData();
  const id = String(form.get("id") || "");
  const action = String(form.get("action") || ""); // inc | dec

  if (!id) return new Response("Bad request", { status: 400 });

  const item = await prisma.cartItem.findUnique({ where: { id } });
  if (!item) return new Response("Not found", { status: 404 });

  if (action === "inc") {
    await prisma.cartItem.update({
      where: { id },
      data: { qty: { increment: 1 } },
    });
  } else if (action === "dec") {
    if (item.qty <= 1) {
      await prisma.cartItem.delete({ where: { id } });
    } else {
      await prisma.cartItem.update({
        where: { id },
        data: { qty: { decrement: 1 } },
      });
    }
  } else {
    return new Response("Bad action", { status: 400 });
  }

  revalidatePath("/cart");
  revalidatePath("/checkout");
  return Response.redirect(new URL("/cart", req.url), 303);
}