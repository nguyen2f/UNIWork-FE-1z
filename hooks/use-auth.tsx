"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const { login: apiLogin } = await import("@/lib/api")
    const response = await apiLogin(email, password)

    if (response.success) {
      setUser(response.user)
      setToken(response.token)
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
    } else {
      throw new Error("Login failed")
    }
  }

  const register = async (name: string, email: string, password: string) => {
    const { register: apiRegister } = await import("@/lib/api")
    const response = await apiRegister(name, email, password)

    if (response.success) {
      setUser(response.user)
      setToken(response.token)
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
    } else {
      throw new Error("Registration failed")
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
