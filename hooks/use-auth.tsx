"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

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
    // Check for existing session on mount
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const response = await api.auth.login(email, password)

    if (response.success && response.data) {
      const { token: authToken, user: userData, ...rest } = response.data

      // Handle different response structures
      const userToken = authToken || response.data.accessToken || rest.token
      const userInfo = userData || rest.user || rest

      setUser(userInfo)
      setToken(userToken)

      localStorage.setItem("token", userToken)
      localStorage.setItem("user", JSON.stringify(userInfo))

      router.push("/dashboard")
    } else {
      throw new Error(response.error || "Login failed")
    }
  }

  const register = async (name: string, email: string, password: string) => {
    const response = await api.auth.register(name, email, password)

    if (response.success && response.data) {
      const { token: authToken, user: userData, ...rest } = response.data

      // Handle different response structures
      const userToken = authToken || response.data.accessToken || rest.token
      const userInfo = userData || rest.user || { name, email, ...rest }

      setUser(userInfo)
      setToken(userToken)

      localStorage.setItem("token", userToken)
      localStorage.setItem("user", JSON.stringify(userInfo))

      router.push("/dashboard")
    } else {
      throw new Error(response.error || "Registration failed")
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
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
