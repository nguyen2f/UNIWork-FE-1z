class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

function getAuthHeaders(): HeadersInit {
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

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`
  const headers = getAuthHeaders()

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "An error occurred" }))
    throw new ApiError(response.status, error.message || "Request failed")
  }

  return response.json()
}

export const api = {
  // Auth
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

  // Projects
  getProjects: () => fetchApi<any[]>("/projects"),

  getProject: (id: string) => fetchApi<any>(`/projects/${id}`),

  createProject: (data: any) =>
    fetchApi<any>("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateProject: (id: string, data: any) =>
    fetchApi<any>(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteProject: (id: string) =>
    fetchApi<void>(`/projects/${id}`, {
      method: "DELETE",
    }),

  // Tasks
  getTasks: (projectId?: string) => {
    const endpoint = projectId ? `/tasks?projectId=${projectId}` : "/tasks"
    return fetchApi<any[]>(endpoint)
  },

  createTask: (data: any) =>
    fetchApi<any>("/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateTask: (id: string, data: any) =>
    fetchApi<any>(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteTask: (id: string) =>
    fetchApi<void>(`/tasks/${id}`, {
      method: "DELETE",
    }),

  // Messages
  getMessages: (projectId: string) => fetchApi<any[]>(`/messages?projectId=${projectId}`),

  sendMessage: (projectId: string, content: string) =>
    fetchApi<any>("/messages", {
      method: "POST",
      body: JSON.stringify({ projectId, content }),
    }),

  // Notifications
  getNotifications: () => fetchApi<any[]>("/notifications"),

  markAsRead: (id: string) =>
    fetchApi<void>(`/notifications/${id}/read`, {
      method: "PUT",
    }),
}

export { ApiError }
