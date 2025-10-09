const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://uniwork-ir2d.onrender.com"

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type")

  if (contentType && contentType.includes("application/json")) {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`)
    }

    return data
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const text = await response.text()
  return text as any
}

export const authApi = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
    return handleResponse(response)
  },

  async register(name: string, email: string, password: string) {
    const response = await fetch(`${API_URL}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    })
    return handleResponse(response)
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
