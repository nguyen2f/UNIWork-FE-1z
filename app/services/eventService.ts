import { api } from "@/lib/api"
import type { PaginatedResponse } from "@/types/chatType"

export interface Event {
  eventId: number
  title: string
  projectId: number
  date: string
  duration: string
  type: string
  location: string
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  createdBy: number
}

export const getAllEvents = async (begin?: number, end?: number, page = 0, size = 20) => {
  const params: any = { page, size }
  if (begin) params.begin = begin
  if (end) params.end = end

  return api<PaginatedResponse<Event>>({
    method: "GET",
    url: "/event/all",
    params,
  })
}

export const getEventById = async (eventId: number) => {
  return api<Event>({
    method: "GET",
    url: `/event/${eventId}`,
  })
}

export const createEvent = async (event: Omit<Event, "eventId">) => {
  return api<Event>({
    method: "POST",
    url: "/event",
    data: event,
  })
}

export const updateEvent = async (eventId: number, event: Partial<Event>) => {
  return api<Event>({
    method: "PUT",
    url: `/event/${eventId}`,
    data: event,
  })
}

export const deleteEvent = async (eventId: number) => {
  return api<void>({
    method: "DELETE",
    url: `/event/${eventId}`,
  })
}
