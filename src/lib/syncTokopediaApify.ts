import { prisma } from "./prisma";
import { ProductSource } from "@prisma/client";

const APIFY_TOKEN = process.env.APIFY_TOKEN || "";
const ACTOR = process.env.APIFY_ACTOR || "ecomscrape/tokopedia-product-search-scraper";

export async function syncTokopediaApify(query = "jogjarobotika") {
  if (!APIFY_TOKEN) throw new Error("APIFY_TOKEN kosong. Isi dulu di .env");

  const runRes = await fetch(`https://api.apify.com/v2/acts/${ACTOR}/runs?token=${APIFY_TOKEN}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      searchKeyword: query,
      maxResults: 100
    }),
  });

  if (!runRes.ok) throw new Error(`Apify run failed: ${runRes.status}`);
  const runJson = await runRes.json();
  const runId = runJson?.data?.id as string;

  while (true) {
    const st = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`);
    const stJson = await st.json();
    const status = stJson?.data?.status;
    if (status === "SUCCEEDED") break;
    if (status === "FAILED" || status === "ABORTED") throw new Error(`Apify status: ${status}`);
    await new Promise((r) => setTimeout(r, 1500));
  }

  const itemsRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${APIFY_TOKEN}`);
  if (!itemsRes.ok) throw new Error(`Dataset fetch failed: ${itemsRes.status}`);
  const items = (await itemsRes.json()) as any[];

  let count = 0;
  for (const it of items) {
    const sourceUrl = it?.url || it?.productUrl;
    if (!sourceUrl) continue;

    const name = it?.title || it?.name || "Tokopedia Product";
    const imageUrl = it?.image || it?.imageUrl || null;
    const sourcePrice = typeof it?.price === "number" ? Math.round(it.price) : null;

    const existing = await prisma.product.findUnique({ where: { sourceUrl } });
    if (!existing) {
      await prisma.product.create({
        data: {
          source: ProductSource.TOKOPEDIA,
          sourceId: it?.productId ? String(it.productId) : null,
          sourceUrl,
          name,
          imageUrl,
          sourcePrice: sourcePrice ?? undefined,
          sellingPrice: sourcePrice ?? 0,
        },
      });
    } else {
      await prisma.product.update({
        where: { sourceUrl },
        data: { name, imageUrl, sourcePrice: sourcePrice ?? undefined },
      });
    }
    count += 1;
  }

  return { count };
}
