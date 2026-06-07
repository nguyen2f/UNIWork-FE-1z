import { api } from "./http-client"
import type { Event } from "@/types/event.types"

export const eventService = {
  getAll: (page?: number, size?: number) =>
    api({ method: "GET", url: "/events/all", params: { page, size } }, true),

  getById: (eventId: number) =>
    api<Event>({ method: "GET", url: `/events/${eventId}` }),

  create: (event: any) =>
    api<Event>({ method: "POST", url: "/events/create", data: event }),

  update: (eventId: number, event: Partial<Event>) =>
    api<Event>({ method: "PUT", url: `/events/${eventId}`, data: event }),

  delete: (eventId: number) =>
    api<void>({ method: "DELETE", url: `/events/${eventId}` }),
}

// Backward-compatible aliases
export const getEventById = eventService.getById
export const createEvent = eventService.create
export const updateEvent = eventService.update
export const deleteEvent = eventService.delete
export const getAllEvents = eventService.getAll
