import { api } from "@/lib/api"
import type { ProjectRequest } from "@/types/projectType"

export const createProject = async (project: ProjectRequest) => {
  return api<any>({
    method: "POST",
    url: "/project/create",
    data: project,
  })
}

export const getAllProjects = async () => {
  return api<any>({
    method: "GET",
    url: "/project/all",
  })
}

export const getDetailProject = async (projectId: number) => {
  return api<any>({
    method: "GET",
    url: `/project/detail/${projectId}`,
  })
}

export const getProjectMembers = async (projectId: number) => {
  return api<any>({
    method: "GET",
    url: `/project/${projectId}/members`,
  })
}

export const assignMemberToProject = async (projectId: number, userId: number, role: string) => {
  return api<any>({
    method: "POST",
    url: "/member/assign",
    data: {
      projectId,
      userId,
      role,
    },
  })
}
