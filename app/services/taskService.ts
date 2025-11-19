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

export const getTask = async (params: any) => {
    return api<Project[]>({
        method: "GET",
        url: "/task/all",
        params,
    })
}

