const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8297"

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

const mockUsers = [{ id: "1", email: "admin@example.com", name: "Admin User", role: "admin" }]

const mockProjects = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Redesign company website with modern UI",
    status: "in-progress",
    progress: 65,
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    budget: 50000,
    spent: 32500,
    teamSize: 5,
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "Build iOS and Android mobile application",
    status: "planning",
    progress: 20,
    startDate: "2024-02-01",
    endDate: "2024-06-30",
    budget: 100000,
    spent: 15000,
    teamSize: 8,
  },
  {
    id: "3",
    name: "Data Migration",
    description: "Migrate legacy data to new system",
    status: "completed",
    progress: 100,
    startDate: "2023-10-01",
    endDate: "2023-12-31",
    budget: 30000,
    spent: 28000,
    teamSize: 3,
  },
]

const mockTasks = [
  {
    id: "1",
    projectId: "1",
    title: "Design Homepage",
    description: "Create mockups for new homepage",
    status: "completed",
    priority: "high",
    assignee: "John Doe",
    dueDate: "2024-01-15",
  },
  {
    id: "2",
    projectId: "1",
    title: "Implement Navigation",
    description: "Build responsive navigation component",
    status: "in-progress",
    priority: "high",
    assignee: "Jane Smith",
    dueDate: "2024-01-20",
  },
  {
    id: "3",
    projectId: "2",
    title: "Setup Development Environment",
    description: "Configure React Native project",
    status: "todo",
    priority: "medium",
    assignee: "Bob Johnson",
    dueDate: "2024-02-10",
  },
]

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
