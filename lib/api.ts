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
    const error = await response.json().catch(() => ({ message: "An error occurred" }))
    throw new ApiError(response.status, error.message || "An error occurred")
  }

  return response.json()
}

// Auth APIs
export async function apiLogin(email: string, password: string) {
  return fetchApi<{ token: string; userId: string; name?: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export async function apiRegister(name: string, email: string, password: string) {
  return fetchApi<{ message: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  })
}

// Project APIs
export async function getProjects() {
  return fetchApi<any[]>("/projects", { method: "GET" })
}

export async function getProject(id: string) {
  return fetchApi<any>(`/projects/${id}`, { method: "GET" })
}

export async function createProject(data: any) {
  return fetchApi<any>("/projects", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateProject(id: string, data: any) {
  return fetchApi<any>(`/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteProject(id: string) {
  return fetchApi<void>(`/projects/${id}`, { method: "DELETE" })
}

// Task APIs
export async function getTasks(projectId?: string) {
  const endpoint = projectId ? `/projects/${projectId}/tasks` : "/tasks"
  return fetchApi<any[]>(endpoint, { method: "GET" })
}

export async function createTask(data: any) {
  return fetchApi<any>("/tasks", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateTask(id: string, data: any) {
  return fetchApi<any>(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteTask(id: string) {
  return fetchApi<void>(`/tasks/${id}`, { method: "DELETE" })
}

// Message APIs
export async function getMessages(projectId: string) {
  return fetchApi<any[]>(`/projects/${projectId}/messages`, { method: "GET" })
}

export async function sendMessage(projectId: string, content: string) {
  return fetchApi<any>("/messages", {
    method: "POST",
    body: JSON.stringify({ projectId, content }),
  })
}

// Notification APIs
export async function getNotifications() {
  return fetchApi<any[]>("/notifications", { method: "GET" })
}

export async function markNotificationAsRead(id: string) {
  return fetchApi<void>(`/notifications/${id}`, {
    method: "PUT",
    body: JSON.stringify({ read: true }),
  })
}
