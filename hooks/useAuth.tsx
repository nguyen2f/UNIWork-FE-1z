"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const token = localStorage.getItem("token")
      if (token) {
        const profile = await api.auth.getProfile()
        setUser(profile)
      }
    } catch (error) {
      localStorage.removeItem("token")
      localStorage.removeItem("userId")
    } finally {
      setIsLoading(false)
    }
  }

  async function login(email: string, password: string) {
    const response = await api.auth.login(email, password)
    localStorage.setItem("token", response.token)
    localStorage.setItem("userId", response.userId)

    const profile = await api.auth.getProfile()
    setUser(profile)
    router.push("/dashboard")
  }

  async function register(name: string, email: string, password: string) {
    await api.auth.register(name, email, password)
    await login(email, password)
  }

  function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    setUser(null)
    router.push("/auth/signin")
  }

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
