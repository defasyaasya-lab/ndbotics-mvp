import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const ALLOWED = new Set(["WAITING_PAYMENT","PAID","PROCESSING","SHIPPED","DONE","CANCELED"]);

export async function POST(req: Request) {
  const form = await req.formData();
  const orderId = String(form.get("orderId") || "");
  const status = String(form.get("status") || "");

  if (!orderId || !ALLOWED.has(status)) return new Response("Bad request", { status: 400 });

  await prisma.order.update({ where: { id: orderId }, data: { status: status as any } });

  revalidatePath("/admin/orders");
  return Response.redirect(new URL("/admin/orders", req.url), 303);
}
