// Mock API - không call backend thật
const mockUsers = [
  {
    id: "1",
    email: "admin@company.com",
    password: "123456",
    name: "Admin User",
    role: "admin",
  },
  {
    id: "2",
    email: "manager@company.com",
    password: "123456",
    name: "Project Manager",
    role: "manager",
  },
]

// Mock login - trả về user data
export async function login(email: string, password: string) {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const user = mockUsers.find((u) => u.email === email && u.password === password)

  if (!user) {
    throw new Error("Email hoặc mật khẩu không đúng")
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token: "mock-token-" + user.id,
  }
}

// Mock register
export async function register(name: string, email: string, password: string) {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const exists = mockUsers.find((u) => u.email === email)
  if (exists) {
    throw new Error("Email đã được sử dụng")
  }

  const newUser = {
    id: String(mockUsers.length + 1),
    email,
    password,
    name,
    role: "member",
  }

  mockUsers.push(newUser)

  return {
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    },
    token: "mock-token-" + newUser.id,
  }
}
