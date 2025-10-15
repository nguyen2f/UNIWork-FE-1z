import axios from "axios"
import {LoginRequest, RegisterRequest} from "@/types/request";
import {User} from "@/types/index"
import {LoginResponse} from "@/types/response";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const userId = localStorage.getItem("userId");
    const authorization = localStorage.getItem("Authorization");

    console.log("Headers being sent:", { userId, authorization });

    if (userId && authorization) {
      config.headers["userId"] = userId;
      config.headers["Authorization"] = authorization;
    }
  }
  return config;
});



export async function login(data: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await axios.post<LoginResponse>(`${API_BASE_URL}/user/login`, data);
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed")
  }
}

export async function register(data: RegisterRequest): Promise<User> {
  try {
    const response = await axios.post<User>(`${API_BASE_URL}/user/register`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
}

export async function logout(): Promise<void> {
  console.log("Mock logout called")
  await new Promise((resolve) => setTimeout(resolve, 500))
}

export async function fetchProjectReport() {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/report/project-report`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch project report");
  }
}

export async function fetchTaskReport() {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/report/task-report`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch task report");
  }
}

export async function fetchPendingTasks() {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/report/task-report/pending-tasks`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch pending tasks");
  }
}

export async function fetchTasksPerformance() {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/report/task-report/tasks-performance`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch tasks performance");
  }
}

export async function fetchUpcomingEvents() {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/report/event-report/upcoming-events`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch upcoming events");
  }
}

export default apiClient;
