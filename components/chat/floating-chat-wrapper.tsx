"use client"

import { usePathname } from "next/navigation"
import { FloatingChat } from "./floating-chat"

export function FloatingChatWrapper() {
  const pathname = usePathname()

  // Only show floating chat on authenticated pages (not on auth, admin login pages, or messages page)
  const isAuthPage = pathname?.startsWith("/auth")
  const isMessagesPage = pathname?.startsWith("/messages")

  if (isAuthPage || isMessagesPage) return null

  return <FloatingChat />
}
