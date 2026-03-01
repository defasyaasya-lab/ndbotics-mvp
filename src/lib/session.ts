import { cookies } from "next/headers";

const COOKIE_NAME = "nd_session";

export function getSessionId(): string | null {
  return cookies().get(COOKIE_NAME)?.value ?? null;
}