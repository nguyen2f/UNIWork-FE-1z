"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authApi } from "@/lib/api"
import { useRouter } from "next/navigation"

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
    const storedUserName = localStorage.getItem("userName")
    const storedUserEmail = localStorage.getItem("userEmail")

    if (storedToken && storedUserId) {
      setToken(storedToken)
      setUser({
        id: storedUserId,
        name: storedUserName || "",
        email: storedUserEmail || "",
      })
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password)

    localStorage.setItem("token", response.token)
    localStorage.setItem("userId", response.userId)
    localStorage.setItem("userEmail", email)

    setToken(response.token)
    setUser({
      id: response.userId,
      name: email.split("@")[0],
      email: email,
    })

    router.push("/dashboard")
  }

  const register = async (name: string, email: string, password: string) => {
    await authApi.register(name, email, password)
    await login(email, password)
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    localStorage.removeItem("userName")
    localStorage.removeItem("userEmail")

    setToken(null)
    setUser(null)

    router.push("/auth/signin")
  }

  const value: AuthContextType = {
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
