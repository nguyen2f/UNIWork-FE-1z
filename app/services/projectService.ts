import { api } from "@/lib/api";
import { Project } from "@/types";
import { ProjectRequest } from "@/types/projectType";

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
        url: "/project/all"
    })
}
