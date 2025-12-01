import { api } from "@/lib/api";
import {AddComment} from "@/types/request";
export const addComment = async (body: AddComment) => {
    return api<AddComment>({
        method: "GET",
        url: "/comment/add",
        data: body
    })
}

export const getAllCommentsByTaskId = async (taskId: number) => {
    return api<any>({
        method: "GET",
        url: `/comment/task/${taskId}`
    })
}