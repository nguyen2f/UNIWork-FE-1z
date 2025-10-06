const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token")
  const userId = localStorage.getItem("userId")

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  if (userId) {
    headers["userId"] = userId
  }

  return headers
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`

  const config: RequestInit = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    const error = await response.text()
    throw new ApiError(response.status, error || response.statusText)
  }

  return response.json()
}

export const authApi = {
  login: async (email: string, password: string) => {
    return apiRequest<{ token: string; userId: string }>("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
  },

  register: async (name: string, email: string, password: string) => {
    return apiRequest<{ message: string }>("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })
  },
}
