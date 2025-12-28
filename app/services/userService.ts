import { api } from "@/lib/api"

export const getAllMember = async () => {
  return api(
    {
      method: "GET",
      url: "/user/all",
    },
    true,
  )
}

export const getAllUsers = getAllMember

export const getUserProfile = async (userId: string) => {
  return api(
    {
      method: "GET",
      url: `/user/profile/${userId}`,
    },
    true,
  )
}

export const updateUserProfile = async (userId: string, data: any) => {
  return api(
    {
      method: "PUT",
      url: `/user/profile/${userId}`,
      data,
    },
    true,
  )
}
