"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { toast } from "sonner"

interface User {
  id?: string
  name: string
  email: string
  [key: string]: any
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
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
      const response = await api.auth.login(email, password)

      if (response.success && response.data) {
        console.log("Login response:", response.data)

        const { token: authToken, user: userData, ...rest } = response.data
        const userToken = authToken || response.data.accessToken || rest.token
        const userInfo = userData || rest.user || rest

        if (!userToken) {
          throw new Error("No token received from server")
        }

        setUser(userInfo)
        setToken(userToken)

        localStorage.setItem("token", userToken)
        localStorage.setItem("user", JSON.stringify(userInfo))

        toast.success("Đăng nhập thành công!")

        // Force navigation with a small delay to ensure state is set
        setTimeout(() => {
          router.push("/dashboard")
          router.refresh()
        }, 100)
      } else {
        throw new Error(response.error || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.auth.register(name, email, password)

      if (response.success && response.data) {
        console.log("Register response:", response.data)

        const { token: authToken, user: userData, ...rest } = response.data
        const userToken = authToken || response.data.accessToken || rest.token
        const userInfo = userData || rest.user || { name, email, ...rest }

        if (!userToken) {
          throw new Error("No token received from server")
        }

        setUser(userInfo)
        setToken(userToken)

        localStorage.setItem("token", userToken)
        localStorage.setItem("user", JSON.stringify(userInfo))

        toast.success("Đăng ký thành công!")

        // Force navigation
        setTimeout(() => {
          router.push("/dashboard")
          router.refresh()
        }, 100)
      } else {
        throw new Error(response.error || "Registration failed")
      }
    } catch (error) {
      console.error("Register error:", error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Đăng xuất thành công!")
    router.push("/auth/signin")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
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
