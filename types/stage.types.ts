import type { TaskDTO } from "./task.types"

export enum StageType {
  SPRINT = "SPRINT",
  PHASE = "PHASE",
  DEFAULT = "DEFAULT"
}

export enum StageStatus {
  PLANNED = "PLANNED",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

export interface Stage {
  stageId: number
  projectId: number
  name: string
  description?: string
  goal?: string
  type: StageType
  orderIndex: number
  startDate: string
  endDate: string
  status: StageStatus
  active: boolean
  isDeleted: boolean
}

export interface StageSummaryDTO {
  stageId: number
  projectId: number
  name: string
  type: string
  orderIndex: number
  status: string
  startDate?: string
  endDate?: string
  totalTasks: number
  completedTasks: number
  progressPercent: number
  totalIssues?: number
}

export interface StageDetailDTO {
  stageId: number
  projectId: number
  name: string
  description?: string
  goal?: string
  type: string
  orderIndex: number
  startDate: string
  endDate: string
  status: string
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  doingTasks: number
  progressPercent: number
  totalIssues?: number
  openIssues?: number
  resolvedIssues?: number
  tasks: TaskDTO[]
}

export interface StageRequest {
  name: string
  description?: string
  startDate: string
  endDate: string
  goal?: string
  type?: StageType
  status?: StageStatus
  orderIndex?: number
}

export interface MoveTasksRequest {
  taskIds: number[]
}
