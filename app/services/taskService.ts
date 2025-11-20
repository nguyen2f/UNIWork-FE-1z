import { api } from "@/lib/api";
import { Project } from "@/types";
import { TaskRequest } from "@/types/taskType";

export const createTask = async (task: any) => {
    return api<TaskRequest>({
        method: "POST",
        url: "/task/create",
        data: task,
    })
}

export const getTask = async () => {
    return api<Project[]>({
        method: "GET",
        url: "/task/all"
    })
}

export const getAllTasksByProjectId = async (projectId: number) => {
    return api<any>({
        method: "GET",
        url: `/task/all/${projectId}`
    })
}
