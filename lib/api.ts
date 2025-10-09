const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://uniwork-ir2d.onrender.com"

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error || "Something went wrong",
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("API Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    }
  }
}

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      return fetchApi("/user/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })
    },
    register: async (name: string, email: string, password: string) => {
      return fetchApi("/user/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      })
    },
    logout: async () => {
      return { success: true }
    },
    getProfile: async () => {
      return fetchApi("/user/profile")
    },
  },

  projects: {
    getAll: async () => {
      return fetchApi("/projects")
    },

    getById: async (id: string) => {
      return fetchApi(`/projects/${id}`)
    },

    create: async (projectData: any) => {
      return fetchApi("/projects", {
        method: "POST",
        body: JSON.stringify(projectData),
      })
    },

    update: async (id: string, projectData: any) => {
      return fetchApi(`/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(projectData),
      })
    },

    delete: async (id: string) => {
      return fetchApi(`/projects/${id}`, {
        method: "DELETE",
      })
    },
  },

  tasks: {
    getAll: async (projectId?: string) => {
      const endpoint = projectId ? `/tasks?projectId=${projectId}` : "/tasks"
      return fetchApi(endpoint)
    },

    create: async (taskData: any) => {
      return fetchApi("/tasks", {
        method: "POST",
        body: JSON.stringify(taskData),
      })
    },

    update: async (id: string, taskData: any) => {
      return fetchApi(`/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify(taskData),
      })
    },

    delete: async (id: string) => {
      return fetchApi(`/tasks/${id}`, {
        method: "DELETE",
      })
    },
  },
}
