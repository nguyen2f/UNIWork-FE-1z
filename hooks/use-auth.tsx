"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import * as api from "@/lib/api"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "member"
  avatar: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Comment: Không load user từ localStorage nữa
    // const savedUser = localStorage.getItem('user')
    // if (savedUser) {
    //   setUser(JSON.parse(savedUser))
    // }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password)
    setUser(response.user)

    // Comment: Không lưu vào localStorage
    // localStorage.setItem('user', JSON.stringify(response.user))
    // localStorage.setItem('token', response.token)

    router.push("/dashboard")
  }

  const register = async (name: string, email: string, password: string) => {
    const response = await api.register(name, email, password)
    setUser(response.user)

    // Comment: Không lưu vào localStorage
    // localStorage.setItem('user', JSON.stringify(response.user))
    // localStorage.setItem('token', response.token)

    router.push("/dashboard")
  }

  const logout = async () => {
    await api.logout()
    setUser(null)

    // Comment: Không xóa localStorage
    // localStorage.removeItem('user')
    // localStorage.removeItem('token')

    router.push("/auth/login")
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
