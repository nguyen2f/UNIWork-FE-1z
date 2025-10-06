const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

// API Error Class
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// Get token and userId from localStorage
function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null

  return {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(userId && { userId }),
  }
}

// Base API request function
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Network error" }))
      throw new ApiError(response.status, errorData.message || `Error ${response.status}`)
    }

    // Handle empty responses
    const text = await response.text()
    return text ? JSON.parse(text) : {}
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(0, "Network error occurred")
  }
}

// Auth API
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await apiRequest<{ token: string; userId: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })

    // Save token and userId to localStorage
    if (response.token && response.userId) {
      localStorage.setItem("token", response.token)
      localStorage.setItem("userId", response.userId)
    }

    return response
  },

  register: (userData: { name: string; email: string; password: string }) =>
    apiRequest<{ message: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  logout: () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
  },

  getProfile: () => apiRequest<any>("/auth/profile"),
}

// Projects API
export const projectsApi = {
  getAll: () => apiRequest<any[]>("/projects"),

  getById: (id: string) => apiRequest<any>(`/projects/${id}`),

  create: (projectData: any) =>
    apiRequest<any>("/projects", {
      method: "POST",
      body: JSON.stringify(projectData),
    }),

  update: (id: string, projectData: any) =>
    apiRequest<any>(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(projectData),
    }),

  delete: (id: string) =>
    apiRequest<{ message: string }>(`/projects/${id}`, {
      method: "DELETE",
    }),

  getMembers: (id: string) => apiRequest<any[]>(`/projects/${id}/members`),

  addMember: (id: string, memberData: { userId: string; role: string }) =>
    apiRequest<any>(`/projects/${id}/members`, {
      method: "POST",
      body: JSON.stringify(memberData),
    }),

  removeMember: (id: string, userId: string) =>
    apiRequest<{ message: string }>(`/projects/${id}/members/${userId}`, {
      method: "DELETE",
    }),
}

// Tasks API
export const tasksApi = {
  getByProject: (projectId: string) => apiRequest<any[]>(`/projects/${projectId}/tasks`),

  getById: (id: string) => apiRequest<any>(`/tasks/${id}`),

  create: (taskData: any) =>
    apiRequest<any>("/tasks", {
      method: "POST",
      body: JSON.stringify(taskData),
    }),

  update: (id: string, taskData: any) =>
    apiRequest<any>(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(taskData),
    }),

  delete: (id: string) =>
    apiRequest<{ message: string }>(`/tasks/${id}`, {
      method: "DELETE",
    }),

  updateStatus: (id: string, status: string) =>
    apiRequest<any>(`/tasks/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
}

// Messages API
export const messagesApi = {
  getByProject: (projectId: string) => apiRequest<any[]>(`/projects/${projectId}/messages`),

  send: (messageData: { content: string; projectId?: string; receiverId?: string }) =>
    apiRequest<any>("/messages", {
      method: "POST",
      body: JSON.stringify(messageData),
    }),
}

// Notifications API
export const notificationsApi = {
  getAll: () => apiRequest<any[]>("/notifications"),

  markAsRead: (id: string) =>
    apiRequest<any>(`/notifications/${id}/read`, {
      method: "PATCH",
    }),
}

// Users API
export const usersApi = {
  getAll: () => apiRequest<any[]>("/users"),

  getById: (id: string) => apiRequest<any>(`/users/${id}`),

  search: (query: string) => apiRequest<any[]>(`/users/search?q=${encodeURIComponent(query)}`),
}
