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
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setToken(storedToken)
      } catch (error) {
        console.error("Failed to parse user from localStorage", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await authApi.login(email, password)

      if (response.success && response.token && response.userId) {
        console.log("Login response:", response)
        const userId = response.userId.toString()

        const userData: User = {
          id: String(userId),
          name: response.name || "Unknown User",
          email: response.email || email,
        }

        localStorage.setItem("token", response.token)
        localStorage.setItem("userId", userId)
        localStorage.setItem("user", JSON.stringify(userData))

        setUser(userData)
        setToken(response.token)

        toast.success("Đăng nhập thành công!")
        router.push("/dashboard")
      } else {
        toast.error("Đăng nhập thất bại: " + response.message)
      }
    } catch (error: any) {
      console.error("Login error:", error)
      toast.error(error.message || "Đăng nhập thất bại")
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await authApi.register(name, email, password)

      if (response.success) {
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.")
        router.push("/auth/login")
      } else {
        toast.error("Đăng ký thất bại: " + response.message)
      }
    } catch (error: any) {
      console.error("Register error:", error)
      toast.error(error.message || "Đăng ký thất bại")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    authApi.logout()
    setUser(null)
    setToken(null)
    router.push("/auth/login")
    toast.success("Đăng xuất thành công!")
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
