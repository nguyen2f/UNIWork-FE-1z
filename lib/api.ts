import axios from "axios"
import type { LoginRequest, RegisterRequest } from "@/types/request"
import Qs from "qs"
import { message } from "antd"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const request = axios.create()

request.interceptors.request.use(
  (config) => {
    // if (config.url.indexOf(tokenUrl) !== -1) {
    //   delete config.headers.Authorization;
    // }
    return config
  },
  (error) => {
    return Promise.reject(error.response || { data: {} })
  },
)

request.interceptors.response.use(
  (response) => {
    return response?.data
  },
  (error) => {
    if ((error.response && error.response.status === 401) || !localStorage.getItem("Authorization")) {
      message?.error(error?.response?.data?.message)
      localStorage.removeItem("Authorization")
    } else {
      message?.error(error?.response?.data?.message)
      return Promise.reject(error?.response || { data: {} })
    }
  },
)

export const api_no_authen = (options: any) => {
  const config = {
    baseURL: API_BASE_URL,
    ...options,
    paramsSerializer: (params: any) => Qs.stringify(params, { arrayFormat: "repeat" }),
    headers: {
      ...options.headers,
    },
  }
  return request(config)
}

export const api = <T = any>(options: any, notRequireToken?: boolean, auth = false): Promise<T> => {
  const config = {
    baseURL: API_BASE_URL,
    ...options,
    paramsSerializer: (params: any) => Qs.stringify(params, { arrayFormat: "repeat" }),
    headers: {
      ...options.headers,
    },
  }
  if (localStorage.getItem("Authorization")) {
    config.headers.Authorization = `${localStorage.getItem("Authorization")}`
    config.headers.userId = `${localStorage.getItem("userId")}`
  }
  return request(config)
}

export default api

export const login = (data: LoginRequest) => {
  return api(
    {
      method: "POST",
      url: "/user/login",
      data: data,
    },
    true,
  )
}

export const register = (data: RegisterRequest) => {
  return api(
    {
      method: "POST",
      url: "/user/register",
      data: data,
    },
    true,
  )
}

export const logout = () => {
  return api(
    {
      method: "POST",
      url: "/user/logout",
    },
    true,
  )
}

export const fetchProjectReport = () => {
  return api(
    {
      method: "GET",
      url: "/report/project-report",
    },
    true,
  )
}

export const fetchTaskReport = () => {
  return api(
    {
      method: "GET",
      url: "/report/task-report",
    },
    true,
  )
}

export const fetchPendingTasks = () => {
  return api(
    {
      method: "GET",
      url: "/report/task-report/pending-tasks",
    },
    true,
  )
}

export const fetchTasksPerformance = () => {
  return api(
    {
      method: "GET",
      url: "/report/task-report/tasks-performance",
    },
    true,
  )
}

export const fetchUpcomingEvents = () => {
  return api(
    {
      method: "GET",
      url: "/report/event-report/upcoming-events",
    },
    true,
  )
}

export const projectsApi = {
  getAll: () =>
    api({
      method: "GET",
      url: "/project/get-all",
    }),
  getById: (id: string) =>
    api({
      method: "GET",
      url: `/project/get-by-id/${id}`,
    }),
  create: (data: any) =>
    api({
      method: "POST",
      url: "/project/create-project",
      data,
    }),
  update: (id: string, data: any) =>
    api({
      method: "PUT",
      url: `/project/update/${id}`,
      data,
    }),
  delete: (id: string) =>
    api({
      method: "DELETE",
      url: `/project/delete/${id}`,
    }),
}

export const tasksApi = {
  getByProject: (projectId: string) =>
    api({
      method: "GET",
      url: `/task/get-by-project/${projectId}`,
    }),
  create: (data: any) =>
    api({
      method: "POST",
      url: "/task/create-task",
      data,
    }),
  update: (id: string, data: any) =>
    api({
      method: "PUT",
      url: `/task/update/${id}`,
      data,
    }),
  updateStatus: (id: string, status: string) =>
    api({
      method: "PUT",
      url: `/task/update-status/${id}`,
      data: { status },
    }),
  delete: (id: string) =>
    api({
      method: "DELETE",
      url: `/task/delete/${id}`,
    }),
}
