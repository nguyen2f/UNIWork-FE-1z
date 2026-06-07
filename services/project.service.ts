import { api } from "./http-client"
import type { 
  ProjectRequest, 
  UpdateProjectStatusRequest,
  ProjectAssignMemberRequest,
  ProjectDTO,
  ProjectDetailDTO,
  ProjectMemberDTO 
} from "@/types/project.types"

export const projectService = {
  getAll: (params?: { priority?: number; status?: number }) =>
    api<ProjectDTO[]>({ method: "GET", url: "/projects", params }),

  getById: (projectId: number) =>
    api<ProjectDetailDTO>({ method: "GET", url: `/projects/${projectId}` }),

  create: (data: ProjectRequest) =>
    api<ProjectDTO>({ method: "POST", url: "/projects", data }),

  update: (projectId: number, data: ProjectRequest) =>
    api<ProjectDTO>({ method: "PUT", url: `/projects/${projectId}`, data }),

  updateStatus: (projectId: number, data: UpdateProjectStatusRequest) =>
    api<ProjectDTO>({ method: "PUT", url: `/projects/${projectId}/status`, data }),

  delete: (projectId: number) =>
    api<string>({ method: "DELETE", url: `/projects/${projectId}` }),

  getMembers: (projectId: number) =>
    api<ProjectMemberDTO[]>({ method: "GET", url: `/projects/${projectId}/members` }),

  assignMember: (projectId: number, data: ProjectAssignMemberRequest) =>
    api<ProjectMemberDTO>({ method: "POST", url: `/projects/${projectId}/members`, data }),

  removeMember: (projectId: number, userId: number) =>
    api<string>({ method: "DELETE", url: `/projects/${projectId}/members/${userId}` })
}

// Backward-compatible aliases for transition (Will be removed later)
export const projectsApi = projectService
export const getAllProjects = projectService.getAll
export const getProjectMembers = projectService.getMembers
export const createProject = projectService.create
export const assignMemberToProject = projectService.assignMember
