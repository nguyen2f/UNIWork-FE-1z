const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

// API utility functions
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token")

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(response.status, errorData.message || "API Error")
  }

  return response.json()
}

// Auth API
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiRequest<{ token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (userData: { name: string; email: string; password: string }) =>
    apiRequest<{ message: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  getProfile: () => apiRequest<any>("/auth/profile"),

  refreshToken: () => apiRequest<{ token: string }>("/auth/refresh"),
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

  updateMemberRole: (id: string, userId: string, role: string) =>
    apiRequest<any>(`/projects/${id}/members/${userId}`, {
      method: "PUT",
      body: JSON.stringify({ role }),
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
      method: "PUT",
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

  getDirectMessages: (userId: string) => apiRequest<any[]>(`/messages/direct/${userId}`),
}

// Notifications API
export const notificationsApi = {
  getAll: () => apiRequest<any[]>("/notifications"),

  markAsRead: (id: string) =>
    apiRequest<any>(`/notifications/${id}/read`, {
      method: "PUT",
    }),

  markAllAsRead: () =>
    apiRequest<{ message: string }>("/notifications/read-all", {
      method: "PUT",
    }),
}

// Users API
export const usersApi = {
  getAll: () => apiRequest<any[]>("/users"),

  getById: (id: string) => apiRequest<any>(`/users/${id}`),

  search: (query: string) => apiRequest<any[]>(`/users/search?q=${encodeURIComponent(query)}`),
}

// Reports API
export const reportsApi = {
  getProjectStats: (projectId: string) => apiRequest<any>(`/reports/projects/${projectId}/stats`),

  getDashboardStats: () => apiRequest<any>("/reports/dashboard"),

  getUserStats: (userId: string) => apiRequest<any>(`/reports/users/${userId}/stats`),

  exportProject: (projectId: string, format: "pdf" | "excel") =>
    apiRequest<{ downloadUrl: string }>(`/reports/projects/${projectId}/export?format=${format}`),
}
