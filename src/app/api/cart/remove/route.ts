import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const COOKIE_NAME = "nd_session";

export async function POST(req: Request) {
  const form = await req.formData();
  const productId = String(form.get("productId") || "");

  const sessionId = cookies().get(COOKIE_NAME)?.value;

  if (sessionId && productId) {
    await prisma.cartItem.deleteMany({ where: { sessionId, productId } });
  }

  revalidatePath("/cart");
  return Response.redirect(new URL("/cart", req.url), 303);
}