// Mock API - Comment tất cả API calls thật
interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "member"
  avatar: string
  createdAt: string
}

interface LoginResponse {
  user: User
  token: string
}

interface RegisterResponse {
  user: User
  token: string
}

// Mock database
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "admin@company.com",
    role: "admin",
    avatar: "JD",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Sarah Miller",
    email: "sarah@company.com",
    role: "manager",
    avatar: "SM",
    createdAt: new Date().toISOString(),
  },
]

// Mock login function
export async function login(email: string, password: string): Promise<LoginResponse> {
  console.log("Mock login called with:", email, password)

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Find user
  const user = mockUsers.find((u) => u.email === email)

  if (!user || password !== "123456") {
    throw new Error("Invalid email or password")
  }

  console.log("Login successful:", user)

  return {
    user,
    token: "mock-token-" + Date.now(),
  }
}

// Mock register function
export async function register(name: string, email: string, password: string): Promise<RegisterResponse> {
  console.log("Mock register called with:", { name, email, password })

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Check if user exists
  const existingUser = mockUsers.find((u) => u.email === email)
  if (existingUser) {
    throw new Error("Email already registered")
  }

  // Create new user
  const newUser: User = {
    id: String(mockUsers.length + 1),
    name,
    email,
    role: "member",
    avatar: name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase(),
    createdAt: new Date().toISOString(),
  }

  mockUsers.push(newUser)
  console.log("Register successful:", newUser)

  return {
    user: newUser,
    token: "mock-token-" + Date.now(),
  }
}

// Mock logout function
export async function logout(): Promise<void> {
  console.log("Mock logout called")
  await new Promise((resolve) => setTimeout(resolve, 500))
}
