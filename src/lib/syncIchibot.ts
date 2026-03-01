import { prisma } from "./prisma";
import { ProductSource } from "@prisma/client";

type WooProduct = {
  id: number;
  name: string;
  permalink: string;
  images?: { src: string }[];
  prices?: { price: string };
};

function toIntRupiah(maybe: unknown): number | null {
  if (typeof maybe === "string" && maybe.trim() !== "") {
    const n = Number(maybe);
    if (Number.isFinite(n)) return Math.round(n);
  }
  return null;
}

export async function syncIchibotAllPages(maxPages = 10) {
  let page = 1;
  let total = 0;

  while (page <= maxPages) {
    const url = `https://store.ichibot.id/wp-json/wc/store/v1/products?per_page=100&page=${page}`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) throw new Error(`Ichibot fetch failed: ${res.status}`);

    const data = (await res.json()) as WooProduct[];
    if (!Array.isArray(data) || data.length === 0) break;

    for (const p of data) {
      const sourceUrl = p.permalink;
      const imageUrl = p.images?.[0]?.src ?? null;
      const sourcePrice = toIntRupiah(p.prices?.price);

      const existing = await prisma.product.findUnique({ where: { sourceUrl } });

      if (!existing) {
        await prisma.product.create({
          data: {
            source: ProductSource.ICHIBOT,
            sourceId: String(p.id),
            sourceUrl,
            name: p.name,
            imageUrl,
            sourcePrice: sourcePrice ?? undefined,
            sellingPrice: sourcePrice ?? 0,
          },
        });
      } else {
        await prisma.product.update({
          where: { sourceUrl },
          data: {
            name: p.name,
            imageUrl,
            sourcePrice: sourcePrice ?? undefined,
            // sellingPrice tidak dioverwrite agar harga jual tetap versi kamu
          },
        });
      }
    }

    total += data.length;
    page += 1;
  }

  return { total };
}
