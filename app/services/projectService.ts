import { api } from "@/lib/api";
import { Project } from "@/types";
import { CreateProject, ProjectParams } from "@/types/projectType";

export const createProject = async (project: CreateProject) => {
    return api<CreateProject>({
        method: "POST",
        url: "/project/create-project",
        data: project,
    })
}

export const getProjects = async (params: ProjectParams) => {
    return api<Project[]>({
        method: "GET",
        url: "/project/get-all",
        params,
    })
}
