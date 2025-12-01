import { api } from "@/lib/api"
import type { AddComment } from "@/types/request"

export const addComment = async (body: AddComment) => {
  return api<AddComment>({
    method: "POST", // Fixed method from GET to POST for adding data
    url: "/comment/add",
    data: body,
  })
}

export const getAllCommentsByTaskId = async (taskId: number) => {
  return api<any>({
    method: "GET",
    url: `/comment/task/${taskId}`,
  })
}

export const getTaskComments = getAllCommentsByTaskId
export const addTaskComment = addComment
