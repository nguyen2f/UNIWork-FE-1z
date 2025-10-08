const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const mockUsers = [{ id: "1", email: "admin@example.com", name: "Admin User", role: "admin" }]

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      await delay(800)
      const user = mockUsers.find((u) => u.email === email)
      if (user) {
        return {
          success: true,
          data: { user, token: "mock-jwt-token-" + Date.now() },
        }
      }
      return { success: false, error: "Invalid credentials" }
    },

    register: async (email: string, password: string, name: string) => {
      await delay(800)
      const newUser = {
        id: String(mockUsers.length + 1),
        email,
        name,
        role: "user",
      }
      mockUsers.push(newUser)
      return {
        success: true,
        data: { user: newUser, token: "mock-jwt-token-" + Date.now() },
      }
    },
  },

  projects: {
    getAll: async () => {
      await delay(600)
      return {
        success: true,
        data: [
          {
            id: "1",
            name: "Website Redesign",
            description: "Complete website redesign",
            status: "active",
            progress: 65,
          },
          {
            id: "2",
            name: "Mobile App",
            description: "iOS and Android app",
            status: "active",
            progress: 40,
          },
        ],
      }
    },
  },

  tasks: {
    getAll: async () => {
      await delay(600)
      return {
        success: true,
        data: [
          {
            id: "1",
            title: "Design homepage",
            description: "Create mockup",
            status: "completed",
            priority: "high",
          },
          {
            id: "2",
            title: "Implement auth",
            description: "Add login system",
            status: "in_progress",
            priority: "high",
          },
        ],
      }
    },
  },
}
