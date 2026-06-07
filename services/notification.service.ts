import { api } from "./http-client"
import type { NotificationDTO } from "@/types/notification.types"

export const notificationService = {
  getAll: () =>
    api<any>({ method: "GET", url: "/notifications" }),

  getUnreadCount: () =>
    api<number>({ method: "GET", url: "/notifications/unread-count" }),

  markAsRead: (notiId: number) =>
    api({ method: "PATCH", url: `/notifications/${notiId}/read` }),

  markAllAsRead: () =>
    api({ method: "POST", url: "/notifications/read-all" }),

  delete: (notiId: number) =>
    api({ method: "DELETE", url: `/notifications/${notiId}` }),
}

// Backward-compatible aliases
export const getAllNotifications = notificationService.getAll
export const getUnreadCount = notificationService.getUnreadCount
export const markNotificationAsRead = notificationService.markAsRead
export const markAllAsRead = notificationService.markAllAsRead
export const deleteNotification = notificationService.delete
