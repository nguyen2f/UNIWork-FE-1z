// Event module types

export interface Event {
  eventId: number
  title: string
  projectId?: number
  date: string
  duration: string
  type: string
  location: string
  priority: string
  createdBy: number
}

export interface CreateEventRequest {
  title: string
  projectId: number
  date: string
  duration: string
  type: string
  location: string
  priority: number
  createdBy: number
}
