const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8297"

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Helper function to get auth headers
function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

// Helper function to handle API errors
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json()

  if (!response.ok) {
    return {
      success: false,
      error: data.message || "An error occurred",
    }
  }

  return {
    success: true,
    data,
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
    login: async (email: string, password: string): Promise<ApiResponse> => {
      try {
        const response = await fetch(`${API_BASE_URL}/user/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        })

        return handleResponse(response)
      } catch (error) {
        return {
          success: false,
          error: "Network error. Please try again.",
        }
      }
    },

    register: async (name: string, email: string, password: string): Promise<ApiResponse> => {
      try {
        const response = await fetch(`${API_BASE_URL}/user/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        })

        return handleResponse(response)
      } catch (error) {
        return {
          success: false,
          error: "Network error. Please try again.",
        }
      }
    },

    getProfile: async (): Promise<ApiResponse> => {
      try {
        const response = await fetch(`${API_BASE_URL}/user/profile`, {
          headers: getAuthHeaders(),
        })

        return handleResponse(response)
      } catch (error) {
        return {
          success: false,
          error: "Network error. Please try again.",
        }
      }
    },
  },

  projects: {
    getAll: async (): Promise<ApiResponse> => {
      try {
        const response = await fetch(`${API_BASE_URL}/projects`, {
          headers: getAuthHeaders(),
        })

        return handleResponse(response)
      } catch (error) {
        return {
          success: false,
          error: "Network error. Please try again.",
        }
      }
    },

    getById: async (id: string): Promise<ApiResponse> => {
      try {
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
          headers: getAuthHeaders(),
        })

        return handleResponse(response)
      } catch (error) {
        return {
          success: false,
          error: "Network error. Please try again.",
        }
      }
    },

    create: async (projectData: any): Promise<ApiResponse> => {
      try {
        const response = await fetch(`${API_BASE_URL}/projects`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(projectData),
        })

        return handleResponse(response)
      } catch (error) {
        return {
          success: false,
          error: "Network error. Please try again.",
        }
      }
    },

    update: async (id: string, projectData: any): Promise<ApiResponse> => {
      try {
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(projectData),
        })

        return handleResponse(response)
      } catch (error) {
        return {
          success: false,
          error: "Network error. Please try again.",
        }
      }
    },

    delete: async (id: string): Promise<ApiResponse> => {
      try {
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        })

        return handleResponse(response)
      } catch (error) {
        return {
          success: false,
          error: "Network error. Please try again.",
        }
      }
    },
  },

  tasks: {
    getAll: async (projectId?: string): Promise<ApiResponse> => {
      try {
        const url = projectId ? `${API_BASE_URL}/tasks?projectId=${projectId}` : `${API_BASE_URL}/tasks`

        const response = await fetch(url, {
          headers: getAuthHeaders(),
        })

        return handleResponse(response)
      } catch (error) {
        return {
          success: false,
          error: "Network error. Please try again.",
        }
      }
    },

    create: async (taskData: any): Promise<ApiResponse> => {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(taskData),
        })

        return handleResponse(response)
      } catch (error) {
        return {
          success: false,
          error: "Network error. Please try again.",
        }
      }
    },

    update: async (id: string, taskData: any): Promise<ApiResponse> => {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(taskData),
        })

        return handleResponse(response)
      } catch (error) {
        return {
          success: false,
          error: "Network error. Please try again.",
        }
      }
    },

    delete: async (id: string): Promise<ApiResponse> => {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        })

        return handleResponse(response)
      } catch (error) {
        return {
          success: false,
          error: "Network error. Please try again.",
        }
      }
    },
  },
}
