import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/sign-up", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|auth/).*)"],
};
