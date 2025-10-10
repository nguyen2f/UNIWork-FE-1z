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
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Load user from localStorage on mount
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
        const userData: User = {
          id: response.userId,
          name: response.name || "User",
          email: response.email || email,
        }

        // Save to localStorage
        localStorage.setItem("token", response.token)
        localStorage.setItem("userId", response.userId)
        localStorage.setItem("user", JSON.stringify(userData))

        setUser(userData)
        setToken(response.token)

        toast.success("Đăng nhập thành công!")

        // Wait a bit for state to update, then navigate
        setTimeout(() => {
          router.push("/dashboard")
        }, 100)
      } else {
        toast.error(response.error || "Đăng nhập thất bại")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      toast.error("Đã xảy ra lỗi khi đăng nhập")
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
        setTimeout(() => {
          router.push("/auth/login")
        }, 100)
      } else {
        toast.error(response.error || "Đăng ký thất bại")
      }
    } catch (error: any) {
      console.error("Register error:", error)
      toast.error("Đã xảy ra lỗi khi đăng ký")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    authApi.logout()
    setUser(null)
    setToken(null)
    toast.success("Đăng xuất thành công!")
    router.push("/auth/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isLoading,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
