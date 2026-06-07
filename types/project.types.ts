// Project module types

import type { User } from "./user.types"
import type { StageDetailDTO } from "./stage.types"

export interface ProjectDTO {
  projectId: number
  name: string
  description: string
  method: string
  priority: string
  status: string
  category: string
  client: string
  riskLevel: string
  ownerId: number
  departmentId: number
  startDate: string
  endDate: string
  createdDate: string
  totalMembers: number
  totalStages: number
  totalTasks: number
}

export interface ProjectDetailDTO {
  project: ProjectDTO
  members: User[]
  stages: StageDetailDTO[]
}

export interface ProjectMemberDTO {
  pmId: number
  userId: number
  userName: string
  email: string
  role: string
}

export interface ProjectRequest {
  name: string
  description: string
  priority: number
  category: string
  client: string
  departmentId: number
  riskLevel: string
  method: string
  startDate: string
  endDate: string
}

export interface UpdateProjectStatusRequest {
  status: number
}

export interface ProjectAssignMemberRequest {
  userId: number
  role: string
}

export interface ProjectParams {
  priority?: number
  status?: number
}

export type Project = ProjectDTO;

export interface ProjectReport {
  project: any | null
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  doingTasks: number
  completedPercent: number
  countMember: number
}
