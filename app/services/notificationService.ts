import { api } from "@/lib/api"

export interface Notification {
  notiId: number
  recipientId: number
  entityType: "PROJECT" | "TASK" | "MESSAGE" | "SYSTEM"
  entityId: number
  type: "COMMENT" | "ASSIGNMENT" | "MENTION" | "STATUS_CHANGE" | "INVITE"
  title: string
  message: string
  isRead: boolean
  createdDate: string
}

export interface NotificationResponse {
  notiId: number
  recipientId: number
  entityType: string
  entityId: number
  type: string
  title: string
  message: string
  isRead: boolean
  createdDate: string
}

export const getAllNotifications = async (): Promise<Notification[]> => {
  const response = await api<NotificationResponse[]>({
    method: "GET",
    url: "/notification",
  })
  return response.map((noti) => ({
    ...noti,
    notiId: noti.notiId,
    createdDate: noti.createdDate,
  })) as Notification[]
}

export const markNotificationAsRead = async (notiId: number): Promise<void> => {
  await api({
    method: "PATCH",
    url: `/notification/${notiId}/read`,
  })
}

export const markAllAsRead = async (notifications: Notification[]): Promise<void> => {
  const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.notiId)
  await Promise.all(unreadIds.map((id) => markNotificationAsRead(id)))
}
