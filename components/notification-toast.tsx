"use client"

import { useEffect } from "react"
import { Bell } from "lucide-react"
import { toast } from "sonner"
import type { Notification } from "@/app/services/notificationService"

interface NotificationToastProps {
  notification: Notification
  onDismiss: () => void
}

export function NotificationToast({ notification, onDismiss }: NotificationToastProps) {
  useEffect(() => {
    // Show toast notification with auto-dismiss after 5 seconds
    toast.custom(
      (id) => (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex items-start gap-3 max-w-sm animate-slide-in">
          <div className="flex-shrink-0 mt-0.5">
            {notification.type === "task" && <Bell className="h-5 w-5 text-blue-600" />}
            {notification.type === "project" && <Bell className="h-5 w-5 text-orange-600" />}
            {notification.type === "message" && <Bell className="h-5 w-5 text-green-600" />}
            {notification.type === "system" && <Bell className="h-5 w-5 text-purple-600" />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
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
