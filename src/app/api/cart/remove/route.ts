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

  const jar = await cookies();
  const sessionId = jar.get(COOKIE_NAME)?.value;

  if (sessionId && productId) {
    await prisma.cartItem.deleteMany({
      where: { sessionId, productId },
    });
  }

  revalidatePath("/cart");
  revalidatePath("/checkout");

  return NextResponse.redirect(new URL("/cart", req.url), 303);
}