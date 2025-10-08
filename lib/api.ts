// Mock API với delay để simulate backend
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock data
const mockUsers = [{ id: "1", name: "Admin User", email: "admin@example.com", password: "123456" }]

const mockProjects = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Complete overhaul of company website",
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
    description: "iOS and Android app for customers",
    status: "planning",
    progress: 20,
    startDate: "2024-02-01",
    endDate: "2024-06-30",
    budget: 100000,
    spent: 15000,
    teamSize: 8,
  },
]

const mockTasks = [
  {
    id: "1",
    title: "Design new homepage",
    description: "Create mockups for the new homepage",
    status: "in-progress",
    priority: "high",
    projectId: "1",
    assigneeId: "1",
    dueDate: "2024-01-15",
  },
  {
    id: "2",
    title: "Setup CI/CD pipeline",
    description: "Configure automated deployment",
    status: "todo",
    priority: "medium",
    projectId: "1",
    assigneeId: "1",
    dueDate: "2024-01-20",
  },
]

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      await delay(800)

      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // })

      const user = mockUsers.find((u) => u.email === email)
      if (!user) {
        throw new ApiError(401, "Invalid credentials")
      }

      return {
        token: "mock-jwt-token-" + Date.now(),
        userId: user.id,
      }
    },

    register: async (name: string, email: string, password: string) => {
      await delay(800)

      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, password })
      // })

      const newUser = {
        id: String(mockUsers.length + 1),
        name,
        email,
        password,
      }
      mockUsers.push(newUser)

      return { success: true }
    },

    getProfile: async () => {
      await delay(500)

      // TODO: Replace with actual API call
      // const token = localStorage.getItem('token')
      // const response = await fetch('/api/auth/profile', {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // })

      return mockUsers[0]
    },
  },

  projects: {
    getAll: async () => {
      await delay(600)

      // TODO: Replace with actual API call
      // const token = localStorage.getItem('token')
      // const response = await fetch('/api/projects', {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // })

      return mockProjects
    },

    getById: async (id: string) => {
      await delay(500)

      // TODO: Replace with actual API call
      // const token = localStorage.getItem('token')
      // const response = await fetch(`/api/projects/${id}`, {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // })

      return mockProjects.find((p) => p.id === id)
    },

    create: async (data: any) => {
      await delay(700)

      // TODO: Replace with actual API call
      // const token = localStorage.getItem('token')
      // const response = await fetch('/api/projects', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(data)
      // })

      const newProject = {
        id: String(mockProjects.length + 1),
        ...data,
        progress: 0,
        spent: 0,
      }
      mockProjects.push(newProject)
      return newProject
    },
  },

  tasks: {
    getAll: async () => {
      await delay(600)

      // TODO: Replace with actual API call
      // const token = localStorage.getItem('token')
      // const response = await fetch('/api/tasks', {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // })

      return mockTasks
    },

    getByProject: async (projectId: string) => {
      await delay(500)

      // TODO: Replace with actual API call
      // const token = localStorage.getItem('token')
      // const response = await fetch(`/api/projects/${projectId}/tasks`, {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // })

      return mockTasks.filter((t) => t.projectId === projectId)
    },
  },
}
