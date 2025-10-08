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

// Mock Data for Demo
const MOCK_USER = {
  id: "user-123",
  name: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
}

const MOCK_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.token"

const MOCK_PROJECTS = [
  {
    id: "proj-1",
    name: "Website E-commerce",
    description: "Xây dựng website bán hàng trực tuyến",
    status: "in-progress",
    progress: 65,
    startDate: "2024-01-01",
    endDate: "2024-06-30",
  },
  {
    id: "proj-2",
    name: "Mobile App",
    description: "Phát triển ứng dụng di động",
    status: "planning",
    progress: 20,
    startDate: "2024-02-01",
    endDate: "2024-08-31",
  },
]

const MOCK_TASKS = [
  {
    id: "task-1",
    projectId: "proj-1",
    title: "Thiết kế giao diện",
    description: "Thiết kế UI/UX cho trang chủ",
    status: "completed",
    priority: "high",
    assignee: "Nguyễn Văn B",
    dueDate: "2024-03-15",
  },
  {
    id: "task-2",
    projectId: "proj-1",
    title: "Phát triển API",
    description: "Xây dựng RESTful API",
    status: "in-progress",
    priority: "high",
    assignee: "Trần Thị C",
    dueDate: "2024-03-30",
  },
  {
    id: "task-3",
    projectId: "proj-1",
    title: "Tích hợp thanh toán",
    description: "Tích hợp cổng thanh toán VNPay",
    status: "todo",
    priority: "medium",
    assignee: "Lê Văn D",
    dueDate: "2024-04-15",
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const api = {
  auth: {
    // Sẽ thay thế bằng: POST /api/auth/login
    async login(email: string, password: string) {
      await delay(500)
      // TODO: Replace with actual API call
      // const response = await fetch(`${API_URL}/auth/login`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password }),
      // })
      // const data = await response.json()
      // return { token: data.token, userId: data.userId }

      // Mock response
      if (email && password) {
        return {
          token: MOCK_TOKEN,
          userId: MOCK_USER.id,
        }
      }
      throw new Error("Invalid credentials")
    },

    // Sẽ thay thế bằng: POST /api/auth/register
    async register(name: string, email: string, password: string) {
      await delay(500)
      // TODO: Replace with actual API call
      // const response = await fetch(`${API_URL}/auth/register`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ name, email, password }),
      // })
      // return await response.json()

      // Mock response
      return { message: "User registered successfully" }
    },

    // Sẽ thay thế bằng: GET /api/auth/profile (với Authorization header)
    async getProfile() {
      await delay(300)
      // TODO: Replace with actual API call
      // const token = localStorage.getItem("token")
      // const userId = localStorage.getItem("userId")
      // const response = await fetch(`${API_URL}/auth/profile`, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     userId: userId || "",
      //   },
      // })
      // return await response.json()

      // Mock response
      return MOCK_USER
    },
  },

  projects: {
    // Sẽ thay thế bằng: GET /api/projects
    async getAll() {
      await delay(300)
      // TODO: Replace with actual API call
      // const token = localStorage.getItem("token")
      // const userId = localStorage.getItem("userId")
      // const response = await fetch(`${API_URL}/projects`, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     userId: userId || "",
      //   },
      // })
      // return await response.json()

      // Mock response
      return MOCK_PROJECTS
    },

    // Sẽ thay thế bằng: GET /api/projects/:id
    async getById(id: string) {
      await delay(300)
      // TODO: Replace with actual API call

      // Mock response
      return MOCK_PROJECTS.find((p) => p.id === id) || null
    },

    // Sẽ thay thế bằng: POST /api/projects
    async create(data: any) {
      await delay(500)
      // TODO: Replace with actual API call
      // const token = localStorage.getItem("token")
      // const userId = localStorage.getItem("userId")
      // const response = await fetch(`${API_URL}/projects`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //     userId: userId || "",
      //   },
      //   body: JSON.stringify(data),
      // })
      // return await response.json()

      // Mock response
      const newProject = {
        id: `proj-${Date.now()}`,
        ...data,
        status: "planning",
        progress: 0,
      }
      MOCK_PROJECTS.push(newProject)
      return newProject
    },

    // Sẽ thay thế bằng: PUT /api/projects/:id
    async update(id: string, data: any) {
      await delay(500)
      // TODO: Replace with actual API call

      // Mock response
      const index = MOCK_PROJECTS.findIndex((p) => p.id === id)
      if (index !== -1) {
        MOCK_PROJECTS[index] = { ...MOCK_PROJECTS[index], ...data }
        return MOCK_PROJECTS[index]
      }
      throw new Error("Project not found")
    },

    // Sẽ thay thế bằng: DELETE /api/projects/:id
    async delete(id: string) {
      await delay(500)
      // TODO: Replace with actual API call

      // Mock response
      const index = MOCK_PROJECTS.findIndex((p) => p.id === id)
      if (index !== -1) {
        MOCK_PROJECTS.splice(index, 1)
        return { message: "Project deleted successfully" }
      }
      throw new Error("Project not found")
    },
  },

  tasks: {
    // Sẽ thay thế bằng: GET /api/tasks hoặc GET /api/projects/:projectId/tasks
    async getAll(projectId?: string) {
      await delay(300)
      // TODO: Replace with actual API call

      // Mock response
      if (projectId) {
        return MOCK_TASKS.filter((t) => t.projectId === projectId)
      }
      return MOCK_TASKS
    },

    // Sẽ thay thế bằng: POST /api/tasks
    async create(data: any) {
      await delay(500)
      // TODO: Replace with actual API call

      // Mock response
      const newTask = {
        id: `task-${Date.now()}`,
        ...data,
        status: "todo",
      }
      MOCK_TASKS.push(newTask)
      return newTask
    },

    // Sẽ thay thế bằng: PUT /api/tasks/:id
    async update(id: string, data: any) {
      await delay(500)
      // TODO: Replace with actual API call

      // Mock response
      const index = MOCK_TASKS.findIndex((t) => t.id === id)
      if (index !== -1) {
        MOCK_TASKS[index] = { ...MOCK_TASKS[index], ...data }
        return MOCK_TASKS[index]
      }
      throw new Error("Task not found")
    },

    // Sẽ thay thế bằng: DELETE /api/tasks/:id
    async delete(id: string) {
      await delay(500)
      // TODO: Replace with actual API call

      // Mock response
      const index = MOCK_TASKS.findIndex((t) => t.id === id)
      if (index !== -1) {
        MOCK_TASKS.splice(index, 1)
        return { message: "Task deleted successfully" }
      }
      throw new Error("Task not found")
    },
  },
}
