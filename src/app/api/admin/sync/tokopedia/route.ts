import { syncTokopediaApify } from "@/lib/syncTokopediaApify";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    await syncTokopediaApify("jogjarobotika");
  } catch (e: any) {
    return new Response(`Tokopedia sync error: ${e?.message || e}`, { status: 500 });
  }
  revalidatePath("/admin/products");
  revalidatePath("/");
  return Response.redirect(new URL("/admin/products", req.url), 303);
}
