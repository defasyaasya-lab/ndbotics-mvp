import { cookies } from "next/headers";

const COOKIE_NAME = "nd_session";

export async function getSessionId(): Promise<string | null> {
  const jar = await cookies(); // ✅ HARUS await
  return jar.get(COOKIE_NAME)?.value ?? null;
}