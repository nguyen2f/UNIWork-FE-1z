// Notification module types

export type NotificationType =
  | "TASK_ASSIGNED"
  | "TASK_STATUS_CHANGED"
  | "ISSUE_ASSIGNED"
  | "ISSUE_STATUS_CHANGED"
  | "PROJECT_UPDATED"
  | "PROJECT_MEMBER_ADDED"
  | "STAGE_COMPLETED"
  | "STAGE_ACTIVATED"
  | "CHAT_MESSAGE"

export type NotificationEntityType =
  | "CHAT_ROOM"
  | "PROJECT"
  | "TASK"
  | "ISSUE"
  | "STAGE"

export interface Notification {
  notificationId: number
  title: string
  message: string
  type: NotificationType | string
  userId: number
  isRead: boolean
  createdAt: string
  data?: any
}

export interface NotificationDTO {
  notiId: number
  recipientId: number
  entityType: NotificationEntityType | string
  entityId: number
  type: NotificationType | string
  title: string | null
  message: string | null
  createdDate: string
  read: boolean
}
