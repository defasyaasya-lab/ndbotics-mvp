import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";


const COOKIE_NAME = "nd_session";

function randomId(len = 24) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function POST(req: Request) {
  const form = await req.formData();
  const productId = String(form.get("productId") || "");
  const qty = Math.max(1, Number(form.get("qty") || 1));

  const jar = cookies();
  let sessionId = jar.get(COOKIE_NAME)?.value;

  // ✅ Cookie dibuat di Route Handler (boleh)
  if (!sessionId) {
    sessionId = randomId();
    jar.set(COOKIE_NAME, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  await prisma.cartItem.upsert({
    where: { sessionId_productId: { sessionId, productId } },
    update: { qty: { increment: qty } },
    create: { sessionId, productId, qty },
  });

  revalidatePath("/");
  revalidatePath("/cart");
  

  return Response.redirect(new URL("/cart", req.url), 303);
}