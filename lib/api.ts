const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

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
      await delay(800)

      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // })
      // const data = await response.json()
      // return data

      // Mock response
      return {
        success: true,
        user: {
          id: "1",
          name: "Admin User",
          email: email,
          role: "admin",
        },
        token: "mock-jwt-token-" + Date.now(),
      }
    },

    register: async (email: string, password: string, name: string) => {
      await delay(800)

      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, password })
      // })
      // const data = await response.json()
      // return data

      // Mock response
      return {
        success: true,
        user: {
          id: "2",
          name: name,
          email: email,
          role: "user",
        },
        token: "mock-jwt-token-" + Date.now(),
      }
    },
  },

  projects: {
    getAll: async () => {
      await delay(500)

      // TODO: Replace with actual API call
      // const token = localStorage.getItem('token')
      // const response = await fetch('/api/projects', {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   }
      // })
      // const data = await response.json()
      // return data

      return mockProjects
    },

    getById: async (id: string) => {
      await delay(500)

      // TODO: Replace with actual API call
      // const token = localStorage.getItem('token')
      // const response = await fetch(`/api/projects/${id}`, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   }
      // })
      // const data = await response.json()
      // return data

      return mockProjects.find((p) => p.id === id)
    },

    create: async (projectData: any) => {
      await delay(800)

      // TODO: Replace with actual API call
      // const token = localStorage.getItem('token')
      // const response = await fetch('/api/projects', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(projectData)
      // })
      // const data = await response.json()
      // return data

      const newProject = {
        id: String(mockProjects.length + 1),
        ...projectData,
        status: "planning",
        progress: 0,
      }
      mockProjects.push(newProject)
      return newProject
    },
  },

  tasks: {
    getAll: async (projectId?: string) => {
      await delay(500)

      // TODO: Replace with actual API call
      // const token = localStorage.getItem('token')
      // const url = projectId ? `/api/tasks?projectId=${projectId}` : '/api/tasks'
      // const response = await fetch(url, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   }
      // })
      // const data = await response.json()
      // return data

      if (projectId) {
        return mockTasks.filter((t) => t.projectId === projectId)
      }
      return mockTasks
    },

    create: async (taskData: any) => {
      await delay(800)

      // TODO: Replace with actual API call
      // const token = localStorage.getItem('token')
      // const response = await fetch('/api/tasks', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(taskData)
      // })
      // const data = await response.json()
      // return data

      const newTask = {
        id: String(mockTasks.length + 1),
        ...taskData,
        status: "todo",
      }
      mockTasks.push(newTask)
      return newTask
    },
  },
}
