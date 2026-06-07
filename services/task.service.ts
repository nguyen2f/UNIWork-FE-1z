import { api } from "./http-client"
import type { TaskRequest, TaskDTO, TaskDetailDTO, FileAttachmentDTO } from "@/types/task.types"

export const taskService = {
  getByStage: (stageId: number) =>
    api<TaskDTO[]>({ method: "GET", url: `/tasks/stage/${stageId}` }),

  getMyTasks: (params?: { priority?: number; status?: number }) =>
    api<TaskDTO[]>({ method: "GET", url: "/tasks/my-tasks", params }),

  getDetail: (taskId: number) =>
    api<TaskDetailDTO>({ method: "GET", url: `/tasks/${taskId}` }),

  create: (data: TaskRequest) =>
    api<TaskDTO[]>({ method: "POST", url: "/tasks", data }),

  update: (taskId: number, data: TaskRequest) =>
    api<TaskDTO>({ method: "PUT", url: `/tasks/${taskId}`, data }),

  delete: (taskId: number) =>
    api<TaskDTO>({ method: "DELETE", url: `/tasks/${taskId}` }),

  uploadFile: (taskId: number, file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    return api<FileAttachmentDTO>({
      method: "POST",
      url: `/tasks/${taskId}/files`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  },

  // Temporarily added back for backwards compatibility
  getByProject: (projectId: number) =>
    api<TaskDTO[]>({ method: "GET", url: `/projects/${projectId}/tasks` }),

  updateStatus: (projectId: number, stageId: number, taskId: number, body: Pick<TaskRequest, "status">) =>
    api({
      method: "POST",
      url: `tasks/${taskId}/status`,
      data: body,
      headers: { "Content-Type": "application/json" },
    }),
}

// Backward-compatible aliases for transition (Will be removed later)
export const tasksApi = taskService
