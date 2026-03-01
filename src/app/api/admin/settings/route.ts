import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const form = await req.formData();
  const shopName = String(form.get("shopName") || "NDBotics");
  const supplierWa = String(form.get("supplierWa") || "6285346567107");
  const bankName = String(form.get("bankName") || "BRI");
  const bankAccount = String(form.get("bankAccount") || "694201029298534");
  const bankHolder = String(form.get("bankHolder") || "M NABIL KHAIRI IKHSAN");
  const invoicePref = String(form.get("invoicePref") || "INV").toUpperCase().slice(0, 8);

  await prisma.setting.upsert({
    where: { id: "singleton" },
    update: { shopName, supplierWa, bankName, bankAccount, bankHolder, invoicePref },
    create: { id: "singleton", shopName, supplierWa, bankName, bankAccount, bankHolder, invoicePref }
  });

  revalidatePath("/admin/settings");
  revalidatePath("/invoice");
  return Response.redirect(new URL("/admin/settings", req.url), 303);
}
