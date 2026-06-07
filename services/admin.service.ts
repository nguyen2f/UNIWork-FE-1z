import { api } from "./http-client"
import type { AdminCreateUserRequest, AdminCreateDepartmentRequest } from "@/types/user.types"
import type { PaginatedResponse } from "@/types/common"
import type { User, Department } from "@/types/user.types"

export const adminService = {
  createUser: (data: AdminCreateUserRequest) =>
    api({ method: "POST", url: "/admin/user/create", data }),

  getAllUsers: (page?: number, size?: number) =>
    api<PaginatedResponse<User>>({
      method: "GET",
      url: "/admin/users",
      params: { page, size },
    }),

  getDepartments: () =>
    api<Department[]>({
      method: "GET",
      url: "/departments",
    }),

  createDepartment: (data: AdminCreateDepartmentRequest) =>
    api<Department>({
      method: "POST",
      url: "/admin/department/create",
      data,
    }),
}
