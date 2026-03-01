import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const form = await req.formData();

  const productId = String(form.get("productId") || "");
  const name = String(form.get("name") || "").trim();
  const imageUrlRaw = String(form.get("imageUrl") || "").trim();
  const sellingPriceRaw = Number(form.get("sellingPrice") || 0);
  const stockRaw = Number(form.get("stock") || 0);
  const isActive = String(form.get("isActive") || "") === "on";

  if (!productId || !name) {
    return new Response("Bad request", { status: 400 });
  }

  const sellingPrice = Number.isFinite(sellingPriceRaw) ? Math.max(0, Math.floor(sellingPriceRaw)) : 0;
  const stock = Number.isFinite(stockRaw) ? Math.max(0, Math.floor(stockRaw)) : 0;

  await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      imageUrl: imageUrlRaw ? imageUrlRaw : null,
      sellingPrice,
      stock,
      isActive,
    },
  });

  // refresh halaman admin + user katalog
  revalidatePath("/admin/products");
  revalidatePath("/");

  return new Response(null, { status: 303, headers: { Location: "/admin/products" } });
}