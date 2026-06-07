// Auth module types

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  name: string
  password: string
}

export interface LoginResponse {
  userId: string
  token: string
  role: string
}
