import { api } from "./http-client"

export const userService = {
  getAll: () =>
    api({ method: "GET", url: "/users/all" }, true),

  getProfile: (userId: string) =>
    api({ method: "GET", url: `/users/profile/${userId}` }, true),

  updateProfile: (userId: string, data: any) =>
    api({ method: "PUT", url: `/users/profile/${userId}`, data }, true),
}

// Backward-compatible aliases
export const getAllMember = userService.getAll
export const getAllUsers = userService.getAll
export const getUserProfile = userService.getProfile
export const updateUserProfile = userService.updateProfile
