"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, Check, Trash2, MessageSquare, CheckSquare, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  getAllNotifications,
  markNotificationAsRead,
  markAllAsRead,
  type Notification,
} from "@/app/services/notificationService"
import { getStompClient } from "@/app/services/socket"
import { useAuth } from "@/hooks/use-auth"
import { NotificationToast } from "./notification-toast"

export function NotificationsPopover() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [newNotification, setNewNotification] = useState<Notification | null>(null)
  const { user } = useAuth()
  const wsSubscriptionRef = useRef<any>(null)

  useEffect(() => {
    loadNotifications()
  }, [])

  useEffect(() => {
    if (!user?.id) return

    const client = getStompClient()
    if (!client || !client.connected) {
      console.warn("WebSocket not connected for notifications")
      return
    }

    wsSubscriptionRef.current = client.subscribe(`/topic/notifications/${user.id}`, (message) => {
      try {
        const notification = JSON.parse(message.body)
        console.log("[v0] New notification received:", notification)

        // Show toast for new notification
        setNewNotification({
          ...notification,
          isRead: false,
        })

        // Reload notifications list
        loadNotifications()
      } catch (error) {
        console.error("Error parsing notification:", error)
      }
    })

    return () => {
      if (wsSubscriptionRef.current) {
        wsSubscriptionRef.current.unsubscribe()
      }
    }
  }, [user])

  const loadNotifications = async () => {
    try {
      const data = await getAllNotifications()
      setNotifications(data)
    } catch (error) {
      console.error("Failed to load notifications:", error)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id)
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(notifications)
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })))
    } catch (error) {
      console.error("Failed to mark all as read:", error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task":
        return <CheckSquare className="h-4 w-4 text-blue-600" />
      case "project":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "message":
        return <MessageSquare className="h-4 w-4 text-green-600" />
      case "system":
        return <Bell className="h-4 w-4 text-purple-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <>
      {newNotification && (
        <NotificationToast notification={newNotification} onDismiss={() => setNewNotification(null)} />
      )}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0" align="end">
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h3 className="font-semibold text-lg">Notifications</h3>
              <p className="text-sm text-gray-500">{unreadCount} unread notifications</p>
            </div>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                <Check className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
          </div>

          <ScrollArea className="h-[400px]">
            <div className="p-2">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bell className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">No notifications</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`group flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                        notification.isRead ? "opacity-60" : "bg-blue-50/50"
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${notification.isRead ? "text-gray-700" : "text-gray-900"}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.createdAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteNotification(notification.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          {notifications.length > 0 && (
            <>
              <Separator />
              <div className="p-2">
                <Button
                  variant="ghost"
                  className="w-full text-sm"
                  onClick={() => {
                    setNotifications([])
                    setIsOpen(false)
                  }}
                >
                  Clear all notifications
                </Button>
              </div>
            </>
          )}
        </PopoverContent>
      </Popover>
    </>
  )
}
