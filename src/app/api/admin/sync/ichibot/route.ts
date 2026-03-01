import { syncIchibotAllPages } from "@/lib/syncIchibot";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  await syncIchibotAllPages(10);
  revalidatePath("/admin/products");
  revalidatePath("/");
  return Response.redirect(new URL("/admin/products", req.url), 303);
}
