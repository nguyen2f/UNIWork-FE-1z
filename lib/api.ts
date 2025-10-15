import axios from "axios"
import { LoginRequest, RegisterRequest } from "@/types/request";
import { User } from "@/types/index"
import { LoginResponse } from "@/types/response";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// apiClient.interceptors.request.use((config) => {
//   if (typeof window !== "undefined") {
//     const userId = localStorage.getItem("userId");
//     const authorization = localStorage.getItem("Authorization");

//     console.log("Headers being sent:", { userId, authorization });

//     if (userId && authorization) {
//       config.headers["userId"] = userId;
//       config.headers["Authorization"] = authorization;
//     }
//   }
//   return config;
// });

import Qs from 'qs'
// import { message } from "antd";

const request = axios.create();

request.interceptors.request.use(
  (config) => {
    // if (config.url.indexOf(tokenUrl) !== -1) {
    //   delete config.headers.Authorization;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error.response || { data: {} });
  }
);

request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      (error.response && error.response.status === 401) ||
      !localStorage.getItem("Authorization")
    ) {
      // message?.error(error?.response?.data?.status?.message)
      localStorage.removeItem("Authorization");
    } else {
      return Promise.reject(error?.response || { data: {} });
    }
  }
);

export const api_no_authen = (options: any) => {
  let config = {
    baseURL: API_BASE_URL,
    ...options,
    paramsSerializer: (params: any) =>
      Qs.stringify(params, { arrayFormat: "repeat" }),
    headers: {
      ...options.headers,
    },
  };
  return request(config);
};

export const api = (options: any, notRequireToken: any, auth = false) => {
  let config = {
    baseURL: API_BASE_URL,
    ...options,
    paramsSerializer: (params: any) =>
      Qs.stringify(params, { arrayFormat: "repeat" }),
    headers: {
      ...options.headers,
    },
  };
  if (localStorage.getItem("Authorization") && !notRequireToken) {
    config.headers.Authorization = `${localStorage.getItem("Authorization")}`;
  }
  return request(config);
};

export default api




export const login = (data: LoginRequest) => {
  return api({
    method: "POST",
    url: "/user/login",
    data: data,
  }, true);
};


export const register = (data: RegisterRequest) => {
  return api({
    method: "POST",
    url: "/user/register",
    data: data,
  }, true);
}

export const logout = () => {
  return api({
    method: "POST",
    url: "/user/logout",
  }, true);
}

export const fetchProjectReport = () => {
  return api({
    method: "GET",
    url: "/report/project-report",
  }, true);
}

export const fetchTaskReport = () => {
  return api({
    method: "GET",
    url: "/report/task-report",
  }, true);
}

export const fetchPendingTasks = () => {
  return api({
    method: "GET",
    url: "/report/task-report/pending-tasks",
  }, true);
}

export const fetchTasksPerformance = () => {
  return api({
    method: "GET",
    url: "/report/task-report/tasks-performance",
  }, true);
}

export const fetchUpcomingEvents = () => {
  return api({
    method: "GET",
    url: "/report/event-report/upcoming-events",
  }, true);
}
