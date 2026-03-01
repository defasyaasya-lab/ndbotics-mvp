import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const form = await req.formData();
  const productId = String(form.get("productId") || "");

  if (!productId) return new Response("Bad request", { status: 400 });

  // Soft delete: sembunyikan dari user
  await prisma.product.update({
    where: { id: productId },
    data: { isActive: false },
  });

  // refresh admin + user katalog
  revalidatePath("/");
  revalidatePath("/admin/products");

  return Response.redirect(new URL("/admin/products", req.url), 303);
}