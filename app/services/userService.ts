import { api } from "@/lib/api";
import { Project } from "@/types";
import { ProjectRequest, ProjectParams } from "@/types/projectType";

export const createProject = async (project: ProjectRequest) => {
    return api<ProjectRequest>({
        method: "POST",
        url: "/project/create",
        data: project,
    })
}

export const getProjects = async (params: ProjectParams) => {
    return api<Project[]>({
        method: "GET",
        url: "/project/all",
        params,
    })
}

