// Mock user database - không cần API thật
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@company.com",
    password: "123456", // Trong thực tế sẽ hash password
    role: "admin",
  },
  {
    id: "2",
    name: "Manager User",
    email: "manager@company.com",
    password: "123456",
    role: "manager",
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

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const authApi = {
  async login(email: string, password: string): Promise<ApiResponse> {
    try {
      // Simulate network delay
      await delay(1000)

      // Find user in mock database
      const user = MOCK_USERS.find((u) => u.email === email && u.password === password)

      if (!user) {
        return {
          success: false,
          error: "Email hoặc mật khẩu không đúng",
        }
      }

      // Generate mock token
      const token = `mock_token_${user.id}_${Date.now()}`

      return {
        success: true,
        token: token,
        userId: user.id,
        name: user.name,
        email: user.email,
        message: "Đăng nhập thành công",
      }
    } catch (error) {
      return {
        success: false,
        error: "Đã xảy ra lỗi khi đăng nhập",
      }
    }
  },

  async register(name: string, email: string, password: string): Promise<ApiResponse> {
    try {
      // Simulate network delay
      await delay(1000)

      // Check if user already exists
      const existingUser = MOCK_USERS.find((u) => u.email === email)

      if (existingUser) {
        return {
          success: false,
          error: "Email đã được sử dụng",
        }
      }

      // Create new user
      const newUser = {
        id: `${MOCK_USERS.length + 1}`,
        name,
        email,
        password,
        role: "member",
      }

      MOCK_USERS.push(newUser)

      return {
        success: true,
        message: "Đăng ký thành công",
        userId: newUser.id,
        name: newUser.name,
        email: newUser.email,
      }
    } catch (error) {
      return {
        success: false,
        error: "Đã xảy ra lỗi khi đăng ký",
      }
    }
  },

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("userId")
      localStorage.removeItem("user")
    }
  },
}

export const api = {
  auth: authApi,
}
