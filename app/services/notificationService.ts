import { api } from "@/lib/api"

export interface Notification {
  id: string
  title: string
  message: string
  type: "task" | "project" | "message" | "system"
  isRead: boolean
  createdAt: string
  entityType?: string
  entityId?: number
}

export const getAllNotifications = async (): Promise<Notification[]> => {
  const response = await api<Notification[]>({
    method: "GET",
    url: "/notification",
  })
  return response
}

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  await api({
    method: "PATCH",
    url: `/notification/${notificationId}/read`,
  })
}

export const markAllAsRead = async (notifications: Notification[]): Promise<void> => {
  const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id)
  await Promise.all(unreadIds.map((id) => markNotificationAsRead(id)))
}
