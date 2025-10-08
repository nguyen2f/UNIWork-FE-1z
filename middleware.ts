import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // This is a placeholder - in production, you'd validate the JWT token
  const token = request.cookies.get("token")
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth")
  const isPublicPage = request.nextUrl.pathname === "/"

  if (!token && !isAuthPage && !isPublicPage) {
    return NextResponse.redirect(new URL("/auth/signin", request.url))
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
