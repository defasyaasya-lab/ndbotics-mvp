import { prisma } from "@/lib/prisma";
import { ProductSource } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const form = await req.formData();
  const name = String(form.get("name") || "").trim();
  const sourceUrl = String(form.get("sourceUrl") || "").trim();
  const imageUrlRaw = String(form.get("imageUrl") || "").trim();
  const sourcePriceRaw = String(form.get("sourcePrice") || "").trim();

  if (!name || !sourceUrl) return new Response("Bad request", { status: 400 });

  const imageUrl = imageUrlRaw || null;
  const sourcePrice = sourcePriceRaw ? Math.max(0, Number(sourcePriceRaw)) : null;

  const existing = await prisma.product.findUnique({ where: { sourceUrl } });
  if (!existing) {
    await prisma.product.create({
      data: {
        source: ProductSource.TOKOPEDIA,
        sourceUrl,
        name,
        imageUrl,
        sourcePrice: sourcePrice ?? undefined,
        sellingPrice: sourcePrice ?? 0
      }
    });
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  return Response.redirect(new URL("/admin/products", req.url), 303);
}
