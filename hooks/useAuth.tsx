"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { api, ApiError } from "@/lib/api"

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

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token")
      if (token) {
        const profile = await api.getProfile()
        setUser(profile)
      }
    } catch (error) {
      localStorage.removeItem("token")
      localStorage.removeItem("userId")
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const { token, userId } = await api.login(email, password)
      localStorage.setItem("token", token)
      localStorage.setItem("userId", userId)

      const profile = await api.getProfile()
      setUser(profile)
      router.push("/dashboard")
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error("Email hoặc mật khẩu không đúng")
      }
      throw error
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      await api.register(name, email, password)
      await login(email, password)
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error("Email đã tồn tại hoặc thông tin không hợp lệ")
      }
      throw error
    }
  }

  const logout = () => {
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
