const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any,
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

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Network error" }))
    throw new ApiError(response.status, error.message || "Request failed", error)
  }

  return response.json()
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      fetchApi<{ token: string; userId: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),

    register: (name: string, email: string, password: string) =>
      fetchApi<{ message: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      }),

    getProfile: () => fetchApi<{ id: string; name: string; email: string }>("/auth/profile"),
  },

  projects: {
    getAll: () => fetchApi<any[]>("/projects"),
    getById: (id: string) => fetchApi<any>(`/projects/${id}`),
    create: (data: any) =>
      fetchApi<any>("/projects", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      fetchApi<any>(`/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchApi<void>(`/projects/${id}`, {
        method: "DELETE",
      }),
  },

  tasks: {
    getAll: () => fetchApi<any[]>("/tasks"),
    getByProjectId: (projectId: string) => fetchApi<any[]>(`/projects/${projectId}/tasks`),
    create: (data: any) =>
      fetchApi<any>("/tasks", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      fetchApi<any>(`/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchApi<void>(`/tasks/${id}`, {
        method: "DELETE",
      }),
  },
}
