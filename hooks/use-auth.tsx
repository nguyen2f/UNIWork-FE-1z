"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authApi } from "@/lib/api"
import { toast } from "sonner"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await authApi.login(email, password)

      console.log("Full login response:", response)

      const authToken = response.token
      const userId = response.userId

      if (!authToken) {
        throw new Error("Không nhận được token từ server")
      }

      const userData: User = {
        id: String(userId),
        name: email.split("@")[0],
        email: email,
      }

      localStorage.setItem("token", authToken)
      localStorage.setItem("userId", String(userId))
      localStorage.setItem("user", JSON.stringify(userData))

      setToken(authToken)
      setUser(userData)

      toast.success("Đăng nhập thành công!")

      console.log("Navigating to dashboard...")

      window.location.href = "/dashboard"
    } catch (error: any) {
      console.error("Login error:", error)
      toast.error(error.message || "Đăng nhập thất bại")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await authApi.register(name, email, password)

      console.log("Register response:", response)

      toast.success("Đăng ký thành công! Vui lòng đăng nhập.")
      window.location.href = "/auth/login"
    } catch (error: any) {
      console.error("Register error:", error)
      toast.error(error.message || "Đăng ký thất bại")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    authApi.logout()
    setUser(null)
    setToken(null)
    toast.info("Đã đăng xuất")
    window.location.href = "/auth/login"
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
