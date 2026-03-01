import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const password = String(form.get("password") || "");

  if (!process.env.ADMIN_PASSWORD) {
    return new NextResponse("ADMIN_PASSWORD belum diset di .env", { status: 500 });
  }

  // salah password -> kembali ke login + error
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.redirect(new URL("/admin/login?err=1", req.url), 303);
  }

  // benar -> masuk dashboard admin
  const res = NextResponse.redirect(new URL("/admin/dashboard", req.url), 303);

  res.cookies.set("admin_auth", "true", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    // secure hanya untuk https (di localhost harus false)
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  });

  return res;
}