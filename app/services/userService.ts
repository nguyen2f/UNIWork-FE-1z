import { api } from "@/lib/api";
import { User } from "@/types";
import { UpdateProfileRequest, AssignMemberRequest, RemoveMemberRequest } from "@/types/userType";

export const getAllMember = async () => {
    return api<any>({
        method: "GET",
        url: "/user/all"
    })
}
