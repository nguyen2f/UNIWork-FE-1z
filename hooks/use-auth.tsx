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
    const initializeAuth = async () => {
      const token = localStorage.getItem("Authorization")
      const userId = localStorage.getItem("userId")
      const userName = localStorage.getItem("userName")
      const role = localStorage.getItem("role")

      if (token && userId) {
        setIsAuthenticated(true)
        if (typeof document !== "undefined") {
          document.cookie = `auth_token=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax`;
        }
        // Fallback user object from local storage
        setUser({
          userId: Number(userId),
          email: "",
          name: userName || "User",
          systemRole: role || undefined,
        })

        // Attempt to fetch fresh profile
        try {
          const res: any = await userService.getProfile(userId)
          const profile = res?.data || res
          if (profile && (profile.userId || profile.name)) {
            setUser({
              userId: Number(profile.userId || userId),
              email: profile.email || "",
              name: profile.name || userName || "User",
              department: profile.department,
              departmentId: profile.departmentId,
              avatar: profile.avatarUrl || profile.avatar,
              systemRole: profile.systemRole || role || undefined,
              phone: profile.phone,
            })
          }
        } catch (e) {
          console.warn("Could not load full profile on init", e)
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (data: LoginRequest) => {
    const response: any = await authService.login(data)
    const loginData = response.data || response;

    const userId = loginData.userId || loginData.id;
    const token = loginData.token || loginData.accessToken;
    const role = loginData.role || loginData.systemRole;

    if (userId) localStorage.setItem("userId", userId);
    if (token) {
      localStorage.setItem("Authorization", token);
      if (typeof document !== "undefined") {
        document.cookie = `auth_token=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax`;
      }
    }
    if (role) localStorage.setItem("role", role);

    setIsAuthenticated(true)

    try {
      const res: any = await userService.getProfile(userId)
      const profileData = res?.data || res || {};
      
      if (profileData.name) localStorage.setItem("userName", profileData.name);
      if (profileData.systemRole || profileData.role) {
        localStorage.setItem("role", profileData.systemRole || profileData.role);
      }

      setUser({
        userId: Number(userId),
        email: profileData.email || "",
        name: profileData.name || "User",
        systemRole: profileData.systemRole || role,
        department: profileData.department,
        departmentId: profileData.departmentId,
        avatar: profileData.avatarUrl || profileData.avatar,
      })

      const finalRole = profileData.systemRole || profileData.role || role;
      if (finalRole === "ADMIN" || finalRole === "SUPER_ADMIN") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Could not fetch user profile:", error);
      setUser({
        userId: Number(userId),
        email: "",
        name: "User",
        systemRole: role,
      })
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
    if (typeof document !== "undefined") {
      document.cookie = "auth_token=; path=/; max-age=0";
    }
    setUser(null)
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
