import { api } from "./http-client"
import type { LoginRequest, RegisterRequest } from "@/types/auth.types"

export const authService = {
  login: (data: LoginRequest) =>
    api({ method: "POST", url: "/auth/login", data }, true),

  register: (data: RegisterRequest) =>
    api({ method: "POST", url: "/auth/register", data }, true),

  logout: () =>
    api({ method: "POST", url: "/auth/logout" }, true),
}
