"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { toast } from "sonner"

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password)
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
      setUser(response.user)
      toast.success("Đăng nhập thành công!")
      router.push("/dashboard")
    } catch (error) {
      toast.error("Đăng nhập thất bại. Vui lòng thử lại.")
      throw error
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await api.register(email, password, name)
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
      setUser(response.user)
      toast.success("Đăng ký thành công!")
      router.push("/dashboard")
    } catch (error) {
      toast.error("Đăng ký thất bại. Vui lòng thử lại.")
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    toast.success("Đăng xuất thành công!")
    router.push("/auth/signin")
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
