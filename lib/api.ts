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

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text()
    throw new ApiError(response.status, error || response.statusText)
  }
  return response.json()
}

export const api = {
  // Auth endpoints
  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    return handleResponse<{ token: string; userId: string }>(response)
  },

  async register(name: string, email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })
    return handleResponse<{ message: string }>(response)
  },

  async getProfile() {
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: getAuthHeaders(),
    })
    return handleResponse<{ id: string; name: string; email: string }>(response)
  },

  // Projects endpoints
  async getProjects() {
    const response = await fetch(`${API_URL}/projects`, {
      headers: getAuthHeaders(),
    })
    return handleResponse(response)
  },

  async createProject(data: any) {
    const response = await fetch(`${API_URL}/projects`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async updateProject(id: string, data: any) {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async deleteProject(id: string) {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    return handleResponse(response)
  },

  // Tasks endpoints
  async getTasks(projectId?: string) {
    const url = projectId ? `${API_URL}/projects/${projectId}/tasks` : `${API_URL}/tasks`
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    })
    return handleResponse(response)
  },

  async createTask(data: any) {
    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async updateTask(id: string, data: any) {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async deleteTask(id: string) {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    return handleResponse(response)
  },
}
