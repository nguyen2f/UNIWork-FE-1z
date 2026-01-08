"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import * as api from "@/lib/api"
import { LoginRequest, RegisterRequest } from "@/types/request"
import {getUserProfile} from "@/app/services/userService";
import {User} from "@/types";

interface AuthContextType {
  loading: boolean
  isAuthenticated: boolean
    user: User | null   // ✅ THÊM DÒNG NÀY
    login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("Authorization")
    const userId = localStorage.getItem("userId")
      const role = localStorage.getItem("role")

    if (token && userId) {
      setIsAuthenticated(true)   // giữ trạng thái đăng nhập
    }

    setLoading(false)
  }, [])

  const login = async (data: LoginRequest) => {
    const response = await api.login(data)

      console.log(response)
    localStorage.setItem("userId", response.userId)
    localStorage.setItem("Authorization", response.token)
      localStorage.setItem("role", response.role)

    setIsAuthenticated(true)
      const res = await getUserProfile(response.userId)
      console.log(res.data)
      localStorage.setItem("userName", res.data.name)
      localStorage.setItem("role", res.data.systemRole)
      router.push("/dashboard")
  }

  const register = async (data: RegisterRequest) => {
    const response = await api.register(data)
    router.push("/auth/login")
  }

  const logout = async () => {
    localStorage.removeItem("userId")
    localStorage.removeItem("Authorization")
      localStorage.removeItem("userName")
      localStorage.removeItem("role")
    setIsAuthenticated(false)
    router.push("/auth/login")
  }

  return (
      <AuthContext.Provider value={{ loading, isAuthenticated, user, login, register, logout }}>
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
