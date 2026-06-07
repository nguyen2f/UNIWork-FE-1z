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
    if (
      (error.response && error.response.status === 401) ||
      !localStorage.getItem("Authorization")
    ) {
      message?.error(error?.response?.data?.message)
      localStorage.removeItem("Authorization")
    } else {
      message?.error(error?.response?.data?.message)
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
  if (localStorage.getItem("Authorization")) {
    config.headers.Authorization = `Bearer ${localStorage.getItem("Authorization")}`
    config.headers.userId = `${localStorage.getItem("userId")}`
  }
  return request(config)
}

export default api
