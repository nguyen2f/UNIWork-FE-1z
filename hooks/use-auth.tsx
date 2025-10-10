"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
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
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Comment phần load từ localStorage để test
  // useEffect(() => {
  //   const storedToken = localStorage.getItem("token")
  //   const storedUser = localStorage.getItem("user")

  //   if (storedToken && storedUser) {
  //     try {
  //       const parsedUser = JSON.parse(storedUser)
  //       setUser(parsedUser)
  //       setToken(storedToken)
  //     } catch (error) {
  //       console.error("Failed to parse user from localStorage", error)
  //     }
  //   }
  // }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      console.log("Attempting login with:", { email, password })

      const response = await authApi.login(email, password)
      console.log("Login response:", response)

      if (response.success && response.token && response.userId) {
        const userData: User = {
          id: response.userId,
          name: response.name || "User",
          email: response.email || email,
        }

        // Comment phần lưu vào localStorage
        // localStorage.setItem("token", response.token)
        // localStorage.setItem("userId", response.userId)
        // localStorage.setItem("user", JSON.stringify(userData))

        // Set state để có thể sử dụng
        setUser(userData)
        setToken(response.token)

        toast.success("Đăng nhập thành công!")
        console.log("Navigating to dashboard...")

        // Navigate to dashboard
        router.push("/dashboard")
      } else {
        console.error("Login failed:", response.error)
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
      console.log("Attempting register with:", { name, email, password })

      const response = await authApi.register(name, email, password)
      console.log("Register response:", response)

      if (response.success) {
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.")
        router.push("/auth/login")
      } else {
        console.error("Register failed:", response.error)
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
