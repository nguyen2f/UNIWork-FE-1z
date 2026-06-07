import { api } from "./http-client"
import type { 
  StageRequest, 
  StageSummaryDTO, 
  StageDetailDTO, 
  MoveTasksRequest,
  Stage
} from "@/types/stage.types"

export const stageService = {
  getByProject: (projectId: number) =>
    api<StageSummaryDTO[]>({ method: "GET", url: `/projects/${projectId}/stages` }),

  getById: (projectId: number, stageId: number) =>
    api<StageDetailDTO>({ method: "GET", url: `/projects/${projectId}/stages/${stageId}` }),

  create: (projectId: number, data: StageRequest) =>
    api<Stage>({ method: "POST", url: `/projects/${projectId}/stages`, data }),

  update: (projectId: number, stageId: number, data: StageRequest) =>
    api<Stage>({ method: "PUT", url: `/projects/${projectId}/stages/${stageId}`, data }),

  delete: (projectId: number, stageId: number) =>
    api<string>({ method: "DELETE", url: `/projects/${projectId}/stages/${stageId}` }),

  activate: (projectId: number, stageId: number) =>
    api<string>({ method: "POST", url: `/projects/${projectId}/stages/${stageId}/activate` }),

  complete: (projectId: number, stageId: number) =>
    api<string>({ method: "POST", url: `/projects/${projectId}/stages/${stageId}/complete` }),

  moveTasks: (projectId: number, stageId: number, data: MoveTasksRequest) =>
    api<string>({ method: "POST", url: `/projects/${projectId}/stages/${stageId}/move-tasks`, data })
}
