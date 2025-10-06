const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

function getAuthHeaders(): HeadersInit {
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

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Unknown error" }))
    throw new ApiError(response.status, error.message || `HTTP ${response.status}`)
  }

  return response.json()
}

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      return handleResponse<{ token: string; userId: string }>(response)
    },

    register: async (name: string, email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      return handleResponse<{ message: string }>(response)
    },

    getProfile: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: getAuthHeaders(),
      })
      return handleResponse<{ id: string; name: string; email: string }>(response)
    },
  },

  projects: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        headers: getAuthHeaders(),
      })
      return handleResponse<any[]>(response)
    },

    getById: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        headers: getAuthHeaders(),
      })
      return handleResponse<any>(response)
    },

    create: async (data: any) => {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      })
      return handleResponse<any>(response)
    },

    update: async (id: string, data: any) => {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      })
      return handleResponse<any>(response)
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })
      return handleResponse<any>(response)
    },
  },

  tasks: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        headers: getAuthHeaders(),
      })
      return handleResponse<any[]>(response)
    },

    create: async (data: any) => {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      })
      return handleResponse<any>(response)
    },

    update: async (id: string, data: any) => {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      })
      return handleResponse<any>(response)
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })
      return handleResponse<any>(response)
    },
  },
}

export { API_BASE_URL }
