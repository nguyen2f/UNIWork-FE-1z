import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Comment middleware để không block navigation
export function middleware(request: NextRequest) {
  // Tạm thời cho phép tất cả requests
  return NextResponse.next()

  // Comment phần check token
  // const token = request.cookies.get("token")?.value
  // const isAuthPage = request.nextUrl.pathname.startsWith("/auth")
  // const isPublicPage = request.nextUrl.pathname === "/"

  // if (!token && !isAuthPage && !isPublicPage) {
  //   return NextResponse.redirect(new URL("/auth/login", request.url))
  // }

  // if (token && isAuthPage) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url))
  // }

  // return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
