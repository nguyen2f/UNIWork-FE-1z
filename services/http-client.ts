import axios from "axios"
import Qs from "qs"
import { message } from "antd"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const request = axios.create()

request.interceptors.request.use(
  (config) => {
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
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("Authorization")
        localStorage.removeItem("userId")
        localStorage.removeItem("userName")
        localStorage.removeItem("role")
        document.cookie = "auth_token=; path=/; max-age=0;"
        message?.error(error?.response?.data?.message || "Phiên đăng nhập đã hết hạn")
        if (!window.location.pathname.startsWith("/auth")) {
          window.location.href = "/auth/login"
        }
      }
      return Promise.reject(error?.response || { data: {} })
    } else {
      const errMsg = error?.response?.data?.message || error?.message || "Đã xảy ra lỗi"
      message?.error(errMsg)
      return Promise.reject(error?.response || { data: {} })
    }
  },
)

export const apiNoAuth = (options: any) => {
  const config = {
    baseURL: API_BASE_URL,
    ...options,
    paramsSerializer: (params: any) =>
      Qs.stringify(params, { arrayFormat: "repeat" }),
    headers: {
      ...options.headers,
    },
  }
  return request(config)
}

export const api = <T = any>(
  options: any,
  notRequireToken?: boolean,
): Promise<T> => {
  const config = {
    baseURL: API_BASE_URL,
    ...options,
    paramsSerializer: (params: any) =>
      Qs.stringify(params, { arrayFormat: "repeat" }),
    headers: {
      ...options.headers,
    },
  }
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("Authorization")
    const userId = localStorage.getItem("userId")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    if (userId) {
      config.headers.userId = userId
    }
  }
  return request(config)
}

export default api
