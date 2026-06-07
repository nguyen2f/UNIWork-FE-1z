"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/services/auth.service"
import { userService } from "@/services/user.service"
import type { LoginRequest, RegisterRequest } from "@/types/auth.types"
import type { User } from "@/types/user.types"

interface AuthContextType {
  loading: boolean
  isAuthenticated: boolean
  user: User | null
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

    if (token && userId) {
      setIsAuthenticated(true)
    }

    setLoading(false)
  }, [])

  const login = async (data: LoginRequest) => {
    const response: any = await authService.login(data)
    const loginData = response.data || response;

    const userId = loginData.userId || loginData.id;
    const token = loginData.token || loginData.accessToken;
    const role = loginData.role || loginData.systemRole;

    if (userId) localStorage.setItem("userId", userId);
    if (token) localStorage.setItem("Authorization", token);
    if (role) localStorage.setItem("role", role);

    setIsAuthenticated(true)

    try {
      const res: any = await userService.getProfile(userId)
      const profileData = res?.data || res || {};
      
      if (profileData.name) localStorage.setItem("userName", profileData.name);
      if (profileData.systemRole || profileData.role) {
        localStorage.setItem("role", profileData.systemRole || profileData.role);
      }

      const finalRole = profileData.systemRole || profileData.role || role;
      if (finalRole === "ADMIN" || finalRole === "SUPER_ADMIN") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Could not fetch user profile:", error);
      // Fallback routing if getProfile fails (e.g. admin lacks permission for user endpoint)
      if (role === "ADMIN" || role === "SUPER_ADMIN") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    }
  }

  const register = async (data: RegisterRequest) => {
    await authService.register(data)
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
