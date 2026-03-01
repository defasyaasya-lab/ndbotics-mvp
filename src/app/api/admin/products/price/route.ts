import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const form = await req.formData();
  const productId = String(form.get("productId") || "");
  const sellingPrice = Math.max(0, Number(form.get("sellingPrice") || 0));

  if (!productId) return new Response("Bad request", { status: 400 });

  await prisma.product.update({
    where: { id: productId },
    data: { sellingPrice }
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  return Response.redirect(new URL("/admin/products", req.url), 303);
}
