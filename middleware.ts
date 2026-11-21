import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value

  // If visiting protected routes without token, redirect to login
  if (!token) {
    const loginUrl = new URL("/auth/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/tasks/:path*",
    "/team/:path*",
    "/admin/:path*",
    "/messages/:path*",
    "/analytics/:path*",
    "/reports/:path*",
  ],
}
