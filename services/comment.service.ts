import { api } from "./http-client"
import type { AddComment } from "@/types/task.types"

export const commentService = {
  add: (body: AddComment) =>
    api<AddComment>({ method: "POST", url: "/comments/add", data: body }),

  getByTaskId: (taskId: number) =>
    api<any>({ method: "GET", url: `/comments/task/${taskId}` }),
}

// Backward-compatible aliases
export const addComment = commentService.add
export const addTaskComment = commentService.add
export const getAllCommentsByTaskId = commentService.getByTaskId
export const getTaskComments = commentService.getByTaskId
