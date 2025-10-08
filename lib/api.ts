// Mock API với delay để simulate real backend
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock users data
const mockUsers = [
  { id: "1", email: "admin@example.com", name: "Admin User", role: "admin" },
  { id: "2", email: "user@example.com", name: "Regular User", role: "user" },
]

// Mock authentication
export const api = {
  auth: {
    login: async (email: string, password: string) => {
      await delay(1000) // Simulate network delay

      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // })
      // return response.json()

      const user = mockUsers.find((u) => u.email === email)
      if (user) {
        return {
          success: true,
          data: {
            user,
            token: "mock-jwt-token-" + Date.now(),
          },
        }
      }
      return { success: false, error: "Invalid credentials" }
    },

    register: async (email: string, password: string, name: string) => {
      await delay(1000)

      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password, name })
      // })
      // return response.json()

      const newUser = {
        id: String(mockUsers.length + 1),
        email,
        name,
        role: "user",
      }
      mockUsers.push(newUser)
      return {
        success: true,
        data: {
          user: newUser,
          token: "mock-jwt-token-" + Date.now(),
        },
      }
    },

    logout: async () => {
      await delay(500)
      // TODO: Replace with actual API call
      // await fetch('/api/auth/logout', { method: 'POST' })
      return { success: true }
    },
  },

  projects: {
    getAll: async () => {
      await delay(800)
      // TODO: Replace with actual API call
      // const response = await fetch('/api/projects')
      // return response.json()

      return {
        success: true,
        data: [
          {
            id: "1",
            name: "Website Redesign",
            description: "Complete redesign of company website",
            status: "active",
            progress: 65,
            dueDate: "2024-12-31",
            team: ["John Doe", "Jane Smith"],
            tasks: 12,
            completedTasks: 8,
          },
          {
            id: "2",
            name: "Mobile App Development",
            description: "iOS and Android app for customers",
            status: "active",
            progress: 40,
            dueDate: "2025-03-15",
            team: ["Mike Johnson", "Sarah Wilson"],
            tasks: 24,
            completedTasks: 10,
          },
          {
            id: "3",
            name: "Marketing Campaign",
            description: "Q4 marketing initiatives",
            status: "planning",
            progress: 15,
            dueDate: "2024-11-30",
            team: ["Emily Brown"],
            tasks: 8,
            completedTasks: 1,
          },
        ],
      }
    },

    getById: async (id: string) => {
      await delay(600)
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/projects/${id}`)
      // return response.json()

      return {
        success: true,
        data: {
          id,
          name: "Website Redesign",
          description: "Complete redesign of company website with modern UI/UX",
          status: "active",
          progress: 65,
          dueDate: "2024-12-31",
          budget: 50000,
          spent: 32500,
          team: [
            { id: "1", name: "John Doe", role: "Lead Developer", avatar: "JD" },
            { id: "2", name: "Jane Smith", role: "UI Designer", avatar: "JS" },
          ],
          tasks: [
            { id: "1", title: "Design mockups", status: "completed", assignee: "Jane Smith" },
            { id: "2", title: "Frontend development", status: "in_progress", assignee: "John Doe" },
            { id: "3", title: "Backend integration", status: "todo", assignee: "John Doe" },
          ],
        },
      }
    },

    create: async (data: any) => {
      await delay(1000)
      // TODO: Replace with actual API call
      // const response = await fetch('/api/projects', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // })
      // return response.json()

      return {
        success: true,
        data: { id: String(Date.now()), ...data },
      }
    },
  },

  tasks: {
    getAll: async () => {
      await delay(700)
      // TODO: Replace with actual API call
      // const response = await fetch('/api/tasks')
      // return response.json()

      return {
        success: true,
        data: [
          {
            id: "1",
            title: "Design homepage mockup",
            description: "Create high-fidelity mockup for new homepage",
            status: "completed",
            priority: "high",
            dueDate: "2024-10-15",
            assignee: "Jane Smith",
            project: "Website Redesign",
          },
          {
            id: "2",
            title: "Implement user authentication",
            description: "Add login/signup functionality",
            status: "in_progress",
            priority: "high",
            dueDate: "2024-10-20",
            assignee: "John Doe",
            project: "Mobile App Development",
          },
          {
            id: "3",
            title: "Write API documentation",
            description: "Document all API endpoints",
            status: "todo",
            priority: "medium",
            dueDate: "2024-10-25",
            assignee: "Mike Johnson",
            project: "Mobile App Development",
          },
        ],
      }
    },
  },
}
