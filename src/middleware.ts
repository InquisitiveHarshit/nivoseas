import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isJwtValid(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    // Base64Url decode payload
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    const payload = JSON.parse(json);

    if (payload.role !== "admin") return false;
    if (payload.exp && payload.exp * 1000 <= Date.now()) return false;

    return true;
  } catch {
    return false;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const token = req.cookies.get("admin_token")?.value;
  const valid = token ? isJwtValid(token) : false;

  // 1. If trying to visit any /admin route (except /admin/login) without a valid session,
  // immediately redirect to /admin/login at the server level.
  if (!isLoginPage && !valid) {
    const loginUrl = new URL("/admin/login", req.url);
    const response = NextResponse.redirect(loginUrl);
    if (token) {
      response.cookies.delete("admin_token");
    }
    return response;
  }

  // 2. If already logged in with a valid session and visiting /admin/login,
  // redirect straight to /admin.
  if (isLoginPage && valid) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};
