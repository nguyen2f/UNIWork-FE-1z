"use client"

import { useEffect } from "react"
import { Bell, CheckSquare, Bug, Layers, FolderKanban, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import type { NotificationDTO } from "@/types/notification.types"

interface NotificationToastProps {
  notification: NotificationDTO
  onDismiss: () => void
}

export function NotificationToast({ notification, onDismiss }: NotificationToastProps) {
  useEffect(() => {
    const getIcon = () => {
      switch (notification.entityType?.toUpperCase()) {
        case "TASK":
          return <CheckSquare className="h-5 w-5 text-blue-600" />
        case "ISSUE":
          return <Bug className="h-5 w-5 text-orange-600" />
        case "STAGE":
          return <Layers className="h-5 w-5 text-purple-600" />
        case "PROJECT":
          return <FolderKanban className="h-5 w-5 text-indigo-600" />
        case "CHAT_ROOM":
          return <MessageSquare className="h-5 w-5 text-green-600" />
        default:
          return <Bell className="h-5 w-5 text-gray-600" />
      }
    }

    // Show toast notification with auto-dismiss after 5 seconds
    toast.custom(
      (id) => (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex items-start gap-3 max-w-sm animate-slide-in">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">
              {notification.title ?? "Thông báo mới"}
            </p>
            <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
          </div>
        </div>
      ),
      {
        duration: 5000,
      },
    )

    onDismiss()
  }, [notification, onDismiss])

  return null
}
