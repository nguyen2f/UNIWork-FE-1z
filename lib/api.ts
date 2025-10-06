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
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null

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

export async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new ApiError(response.status, errorText || "An error occurred")
  }

  return response.json()
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      apiCall<{ token: string; userId: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),

    register: (name: string, email: string, password: string) =>
      apiCall<{ message: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      }),

    getProfile: () => apiCall<any>("/auth/profile"),
  },

  projects: {
    getAll: () => apiCall<any[]>("/projects"),
    getById: (id: string) => apiCall<any>(`/projects/${id}`),
    create: (data: any) =>
      apiCall<any>("/projects", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      apiCall<any>(`/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      apiCall<void>(`/projects/${id}`, {
        method: "DELETE",
      }),
  },

  tasks: {
    getByProject: (projectId: string) => apiCall<any[]>(`/projects/${projectId}/tasks`),
    create: (data: any) =>
      apiCall<any>("/tasks", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      apiCall<any>(`/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      apiCall<void>(`/tasks/${id}`, {
        method: "DELETE",
      }),
  },

  messages: {
    getAll: () => apiCall<any[]>("/messages"),
    send: (data: any) =>
      apiCall<any>("/messages", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  notifications: {
    getAll: () => apiCall<any[]>("/notifications"),
    markAsRead: (id: string) =>
      apiCall<void>(`/notifications/${id}`, {
        method: "PUT",
      }),
  },
}
