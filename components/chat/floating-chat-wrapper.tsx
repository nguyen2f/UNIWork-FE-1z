"use client"

import { usePathname } from "next/navigation"
import { FloatingChat } from "./floating-chat"

export function FloatingChatWrapper() {
  const pathname = usePathname()

  // Only show floating chat on authenticated pages (not on auth, admin login pages)
  const isAuthPage = pathname?.startsWith("/auth")
  const isAdminPage = pathname?.startsWith("/admin")

  if (isAuthPage) return null

  return <FloatingChat />
}
