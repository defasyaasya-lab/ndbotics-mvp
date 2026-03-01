import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // protect semua /admin kecuali /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const isAuth = req.cookies.get("admin_auth")?.value === "true";

    if (!isAuth) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("err", "2");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};