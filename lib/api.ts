const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://uniwork-ir2d.onrender.com"

interface ApiResponse<T = any> {
  success?: boolean
  data?: T
  error?: string
  message?: string
}

async function fetchApi<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  }

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error("API Error:", error)
    throw error
  }
}

export const authApi = {
  login: async (email: string, password: string) => {
    return fetchApi("/user/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },

  register: async (name: string, email: string, password: string) => {
    return fetchApi("/user/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    })
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      localStorage.removeItem("userId")
    }
  },
}
