import { api } from "@/lib/api"
import type { UpdateProfileRequest, AssignMemberRequest, RemoveMemberRequest } from "@/types/userType"

export const getAllMember = async () => {
    return api(
        {
            method: "GET",
            url: "/user/all",
        },
        true,
    )
}
//
// export const getUserProfile = async (userId: string) => {
//   return api.get(`/users/${userId}`)
// }
//
// export const updateUserProfile = async (userId: string, data: UpdateProfileRequest) => {
//   return api.put(`/users/${userId}`, data)
// }
//
// export const assignMemberToProject = async (data: AssignMemberRequest) => {
//   return api.post("/users/assign", data)
// }
//
// export const removeMemberFromProject = async (data: RemoveMemberRequest) => {
//   return api.delete("/users/remove", { data })
// }
