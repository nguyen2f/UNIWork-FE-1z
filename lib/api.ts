// Mock API với setTimeout để simulate backend
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock user data
const mockUsers = [
  { id: "1", email: "admin@example.com", name: "Admin User", role: "admin" },
  { id: "2", email: "user@example.com", name: "Regular User", role: "user" },
]

// Mock projects data
const mockProjects = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Complete website redesign project",
    status: "in-progress",
    priority: "high",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    progress: 65,
    budget: 50000,
    spent: 32500,
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "New mobile app for iOS and Android",
    status: "planning",
    priority: "high",
    startDate: "2024-02-01",
    endDate: "2024-06-30",
    progress: 25,
    budget: 100000,
    spent: 15000,
  },
]

// Mock tasks data
const mockTasks = [
  {
    id: "1",
    title: "Design homepage mockup",
    description: "Create initial homepage design",
    status: "completed",
    priority: "high",
    projectId: "1",
    assignedTo: "1",
    dueDate: "2024-01-15",
  },
  {
    id: "2",
    title: "Implement authentication",
    description: "Set up user authentication system",
    status: "in-progress",
    priority: "high",
    projectId: "1",
    assignedTo: "2",
    dueDate: "2024-01-30",
  },
]

export const api = {
  // Auth APIs
  async login(email: string, password: string) {
    await delay(800)
    // TODO: Replace with actual API call
    // const response = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password })
    // })
    // const data = await response.json()

    const user = mockUsers.find((u) => u.email === email)
    if (user) {
      return {
        success: true,
        user,
        token: "mock-jwt-token-" + user.id,
      }
    }
    throw new Error("Invalid credentials")
  },

  async register(email: string, password: string, name: string) {
    await delay(800)
    // TODO: Replace with actual API call
    // const response = await fetch('/api/auth/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password, name })
    // })

    const newUser = {
      id: String(mockUsers.length + 1),
      email,
      name,
      role: "user",
    }
    mockUsers.push(newUser)
    return {
      success: true,
      user: newUser,
      token: "mock-jwt-token-" + newUser.id,
    }
  },

  // Projects APIs
  async getProjects() {
    await delay(500)
    // TODO: Replace with actual API call
    // const response = await fetch('/api/projects', {
    //   headers: {
    //     'Authorization': `Bearer ${localStorage.getItem('token')}`
    //   }
    // })

    return mockProjects
  },

  async getProject(id: string) {
    await delay(500)
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/projects/${id}`, {
    //   headers: {
    //     'Authorization': `Bearer ${localStorage.getItem('token')}`
    //   }
    // })

    return mockProjects.find((p) => p.id === id)
  },

  async createProject(data: any) {
    await delay(800)
    // TODO: Replace with actual API call
    // const response = await fetch('/api/projects', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${localStorage.getItem('token')}`
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

  // Tasks APIs
  async getTasks(projectId?: string) {
    await delay(500)
    // TODO: Replace with actual API call
    // const url = projectId ? `/api/tasks?projectId=${projectId}` : '/api/tasks'
    // const response = await fetch(url, {
    //   headers: {
    //     'Authorization': `Bearer ${localStorage.getItem('token')}`
    //   }
    // })

    return projectId ? mockTasks.filter((t) => t.projectId === projectId) : mockTasks
  },

  async createTask(data: any) {
    await delay(800)
    // TODO: Replace with actual API call
    // const response = await fetch('/api/tasks', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${localStorage.getItem('token')}`
    //   },
    //   body: JSON.stringify(data)
    // })

    const newTask = {
      id: String(mockTasks.length + 1),
      ...data,
      status: "todo",
    }
    mockTasks.push(newTask)
    return newTask
  },

  async updateTask(id: string, data: any) {
    await delay(800)
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/tasks/${id}`, {
    //   method: 'PATCH',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${localStorage.getItem('token')}`
    //   },
    //   body: JSON.stringify(data)
    // })

    const taskIndex = mockTasks.findIndex((t) => t.id === id)
    if (taskIndex !== -1) {
      mockTasks[taskIndex] = { ...mockTasks[taskIndex], ...data }
      return mockTasks[taskIndex]
    }
    throw new Error("Task not found")
  },
}
