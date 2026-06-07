import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/hooks/use-auth"
import { Toaster } from "sonner"
import { FloatingChatWrapper } from "@/components/chat/floating-chat-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "UNIWORK - Project Management Platform",
  description: "Enterprise-grade project management and collaboration platform",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <FloatingChatWrapper />
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}
