"use client"

import { redirect } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function HomePage() {
  const { user, isLoading } = useAuth()

  if (!isLoading) {
    if (user) {
      redirect("/dashboard")
    } else {
      redirect("/auth/signin")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
