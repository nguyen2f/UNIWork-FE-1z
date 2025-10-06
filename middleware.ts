import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth")
  const isPublicPage = request.nextUrl.pathname === "/" || isAuthPage

  // Nếu đã đăng nhập và đang ở trang auth, chuyển về dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Nếu chưa đăng nhập và không ở trang public, chuyển về login
  if (!token && !isPublicPage) {
    return NextResponse.redirect(new URL("/auth/signin", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
