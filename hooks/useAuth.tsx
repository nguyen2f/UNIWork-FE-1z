"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { apiLogin, apiRegister } from "@/lib/api"

interface User {
  userId: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUserId = localStorage.getItem("userId")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUserId && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await apiLogin(email, password)

    localStorage.setItem("token", response.token)
    localStorage.setItem("userId", response.userId)
    localStorage.setItem(
      "user",
      JSON.stringify({
        userId: response.userId,
        email: email,
        name: response.name || email,
      }),
    )

    setToken(response.token)
    setUser({
      userId: response.userId,
      email: email,
      name: response.name || email,
    })

    router.push("/dashboard")
  }

  const register = async (name: string, email: string, password: string) => {
    await apiRegister(name, email, password)
    await login(email, password)
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
    router.push("/auth/signin")
  }

  const value = {
    user,
    token,
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
