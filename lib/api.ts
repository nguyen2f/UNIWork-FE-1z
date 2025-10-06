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
    const error = await response.json().catch(() => ({ message: "An error occurred" }))
    throw new ApiError(response.status, error.message || "An error occurred")
  }

  return response.json()
}

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await handleResponse<{ token: string; userId: string }>(response)

      localStorage.setItem("token", data.token)
      localStorage.setItem("userId", data.userId)

      return data
    },

    register: async (name: string, email: string, password: string) => {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      return handleResponse<{ message: string }>(response)
    },

    getProfile: async () => {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: "GET",
        headers: getAuthHeaders(),
      })

      return handleResponse<{ id: string; name: string; email: string }>(response)
    },

    logout: () => {
      localStorage.removeItem("token")
      localStorage.removeItem("userId")
    },
  },

  projects: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/projects`, {
        method: "GET",
        headers: getAuthHeaders(),
      })

      return handleResponse<any[]>(response)
    },

    create: async (project: any) => {
      const response = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(project),
      })

      return handleResponse<any>(response)
    },

    getById: async (id: string) => {
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      })

      return handleResponse<any>(response)
    },

    update: async (id: string, project: any) => {
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(project),
      })

      return handleResponse<any>(response)
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      return handleResponse<{ message: string }>(response)
    },
  },

  tasks: {
    getByProject: async (projectId: string) => {
      const response = await fetch(`${API_URL}/projects/${projectId}/tasks`, {
        method: "GET",
        headers: getAuthHeaders(),
      })

      return handleResponse<any[]>(response)
    },

    create: async (task: any) => {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(task),
      })

      return handleResponse<any>(response)
    },

    update: async (id: string, task: any) => {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(task),
      })

      return handleResponse<any>(response)
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      return handleResponse<{ message: string }>(response)
    },
  },
}
