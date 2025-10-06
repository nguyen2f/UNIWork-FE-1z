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
  token: string | null
  userId: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUserId = localStorage.getItem("userId")

    if (storedToken && storedUserId) {
      setToken(storedToken)
      setUserId(storedUserId)

      api.auth
        .getProfile()
        .then((userData) => setUser(userData))
        .catch(() => {
          localStorage.removeItem("token")
          localStorage.removeItem("userId")
        })
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.auth.login(email, password)

      localStorage.setItem("token", response.token)
      localStorage.setItem("userId", response.userId)

      setToken(response.token)
      setUserId(response.userId)

      const userData = await api.auth.getProfile()
      setUser(userData)

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
      await api.auth.register(name, email, password)
      await login(email, password)
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error("Đăng ký thất bại. Email có thể đã được sử dụng.")
      }
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    setUser(null)
    setToken(null)
    setUserId(null)
    router.push("/auth/signin")
  }

  const value = {
    user,
    token,
    userId,
    isLoading,
    login,
    register,
    logout,
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
