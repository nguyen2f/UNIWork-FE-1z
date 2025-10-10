"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { login as apiLogin, register as apiRegister } from "@/lib/api"

interface User {
  id: string
  email: string
  name: string
  role: string
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
    // Comment localStorage để test - không lưu trữ gì cả
    // const savedToken = localStorage.getItem("token")
    // const savedUser = localStorage.getItem("user")
    // if (savedToken && savedUser) {
    //   setToken(savedToken)
    //   setUser(JSON.parse(savedUser))
    // }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await apiLogin(email, password)
      setUser(response.user)
      setToken(response.token)

      // Comment localStorage
      // localStorage.setItem("token", response.token)
      // localStorage.setItem("user", JSON.stringify(response.user))

      router.push("/dashboard")
    } catch (error: any) {
      throw new Error(error.message || "Đăng nhập thất bại")
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await apiRegister(name, email, password)
      setUser(response.user)
      setToken(response.token)

      // Comment localStorage
      // localStorage.setItem("token", response.token)
      // localStorage.setItem("user", JSON.stringify(response.user))

      router.push("/dashboard")
    } catch (error: any) {
      throw new Error(error.message || "Đăng ký thất bại")
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    // localStorage.removeItem("token")
    // localStorage.removeItem("user")
    router.push("/auth/login")
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
