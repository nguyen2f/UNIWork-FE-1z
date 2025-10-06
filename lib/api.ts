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

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(userId && { userId }),
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text()
    throw new ApiError(response.status, error || "API Error")
  }
  return response.json()
}

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      return handleResponse<{ token: string; userId: string }>(response)
    },
    register: async (name: string, email: string, password: string) => {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      return handleResponse<{ message: string }>(response)
    },
    getProfile: async () => {
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: getAuthHeaders(),
      })
      return handleResponse<{ id: string; name: string; email: string }>(response)
    },
  },
  projects: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/projects`, {
        headers: getAuthHeaders(),
      })
      return handleResponse<any[]>(response)
    },
    create: async (data: any) => {
      const response = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      })
      return handleResponse<any>(response)
    },
  },
}
