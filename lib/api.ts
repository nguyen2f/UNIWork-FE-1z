// Mock user database - không cần API thật
const mockUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@company.com",
    password: "123456",
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@example.com",
    password: "123456",
  },
]

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  token?: string
  userId?: string
  name?: string
  email?: string
}

interface LoginResponse {
  success: boolean
  token?: string
  userId?: string
  name?: string
  email?: string
  error?: string
}

interface RegisterResponse {
  success: boolean
  error?: string
}

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const authApi = {
  // Mock login - không call API thật
  login: async (email: string, password: string): Promise<LoginResponse> => {
    console.log("Mock login:", { email, password })

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Find user in mock database
    const user = mockUsers.find((u) => u.email === email && u.password === password)

    if (user) {
      return {
        success: true,
        token: `mock-token-${user.id}-${Date.now()}`,
        userId: user.id,
        name: user.name,
        email: user.email,
      }
    }

    return {
      success: false,
      error: "Email hoặc mật khẩu không đúng",
    }
  },

  // Mock register - không call API thật
  register: async (name: string, email: string, password: string): Promise<RegisterResponse> => {
    console.log("Mock register:", { name, email, password })

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === email)
    if (existingUser) {
      return {
        success: false,
        error: "Email đã được sử dụng",
      }
    }

    // Add new user to mock database
    const newUser = {
      id: String(mockUsers.length + 1),
      name,
      email,
      password,
    }
    mockUsers.push(newUser)

    return {
      success: true,
    }
  },

  // Mock logout - chỉ clear localStorage
  logout: () => {
    console.log("Mock logout")
    // Comment phần lưu token
    // localStorage.removeItem("token")
    // localStorage.removeItem("userId")
    // localStorage.removeItem("user")
  },
}

export const api = {
  auth: authApi,
}
