import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_NAME = "nd_session";

export async function POST(req: Request) {
  const form = await req.formData();
  const productId = String(form.get("productId") || "");
  const qtyRaw = Number(form.get("qty") || 1);
  const qty = Number.isFinite(qtyRaw) ? Math.max(1, Math.floor(qtyRaw)) : 1;

  if (!productId) return new NextResponse("Bad request", { status: 400 });

  const jar = await cookies(); // ✅ Next.js 16: async
  const hadSession = Boolean(jar.get(COOKIE_NAME)?.value);
  let sessionId = jar.get(COOKIE_NAME)?.value;

  if (!sessionId) sessionId = crypto.randomUUID();

  // upsert cart item (pastikan ada unique (sessionId, productId) di schema)
  await prisma.cartItem.upsert({
    where: { sessionId_productId: { sessionId, productId } },
    update: { qty: { increment: qty } },
    create: { sessionId, productId, qty },
  });

  revalidatePath("/");
  revalidatePath("/cart");

  const res = NextResponse.redirect(new URL("/cart", req.url), 303);

  // ✅ set cookie hanya kalau sebelumnya belum ada
  if (!hadSession) {
    res.cookies.set(COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return res;
}