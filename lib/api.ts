interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  token?: string
  userId?: number
  name?: string
  email?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://uniwork-ir2d.onrender.com"

async function fetchApi<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const data: ApiResponse<T> = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.message || `HTTP error! status: ${response.status}`,
      }
    }

    return {
      success: true,
      data,
      token: data.token,
      userId: data.userId,
      name: data.name,
      email: data.email,
    }
  } catch (error) {
    console.error("API Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    }
  }
}

export const authApi = {
  async login(email: string, password: string): Promise<ApiResponse> {
    return fetchApi("/user/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },

  async register(name: string, email: string, password: string): Promise<ApiResponse> {
    return fetchApi("/user/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    })
  },

  logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    localStorage.removeItem("user")
  },
}

export const api = {
  auth: authApi,
}
