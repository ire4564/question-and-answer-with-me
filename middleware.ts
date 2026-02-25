import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/intro", "/write", "/waiting", "/inbox", "/letters"];

function isProtectedPath(pathname: string) {
  return protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("fb_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/intro/:path*", "/write/:path*", "/waiting/:path*", "/inbox/:path*", "/letters/:path*"],
};
