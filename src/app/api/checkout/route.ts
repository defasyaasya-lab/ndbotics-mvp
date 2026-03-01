import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

const MIN_CHECKOUT = 500_000;

function uid(prefix: string, n = 8) {
  return `${prefix}-${randomUUID().replace(/-/g, "").slice(0, n).toUpperCase()}`;
}

export async function POST(req: Request) {
  const form = await req.formData();
  const sessionId = String(form.get("sessionId") || "");
  const customerName = String(form.get("customerName") || "").trim();
  const phone = String(form.get("phone") || "").trim();
  const address = String(form.get("address") || "").trim();

  if (!sessionId || !customerName || !phone || !address) {
    return new Response("Bad request", { status: 400 });
  }

  const items = await prisma.cartItem.findMany({
    where: { sessionId },
    include: { product: true },
  });

  if (items.length === 0) return new Response("Cart empty", { status: 400 });

  const subtotal = items.reduce((s, it) => s + it.product.sellingPrice * it.qty, 0);
  const total = subtotal;

  // ✅ BLOKIR kalau total < 500rb (server-side)
  if (total < MIN_CHECKOUT) {
    revalidatePath("/cart");
    const back = new URL("/checkout?err=min", req.url);
    return Response.redirect(back, 303);
  }

  const setting = await prisma.setting.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      shopName: process.env.SHOP_NAME || "NDBotics",
      supplierWa: process.env.SUPPLIER_WA || "6285346567107",
      bankName: process.env.BANK_NAME || "BRI",
      bankAccount: process.env.BANK_ACCOUNT || "694201029298534",
      bankHolder: process.env.BANK_HOLDER || "M NABIL KHAIRI IKHSAN",
      invoicePref: "INV",
    },
  });

  const orderCode = uid("ORD", 8);
  const invoiceNo = `${setting.invoicePref}-${new Date().getFullYear()}-${randomUUID()
    .replace(/-/g, "")
    .slice(0, 6)
    .toUpperCase()}`;

  const order = await prisma.order.create({
    data: {
      orderCode,
      customerName,
      phone,
      address,
      subtotal,
      total,
      items: {
        create: items.map((it) => ({
          productId: it.productId,
          nameSnapshot: it.product.name,
          priceSnapshot: it.product.sellingPrice,
          qty: it.qty,
          lineTotal: it.product.sellingPrice * it.qty,
        })),
      },
      invoice: {
        create: {
          invoiceNo,
          bankName: setting.bankName,
          bankAccount: setting.bankAccount,
          bankHolder: setting.bankHolder,
          total,
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      },
    },
  });

  await prisma.cartItem.deleteMany({ where: { sessionId } });

  revalidatePath("/cart");
  const url = new URL(`/invoice/${order.id}`, req.url);
  return Response.redirect(url, 303);
}