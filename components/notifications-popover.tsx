"use client"

import { useEffect, useRef, useState } from "react"
import { Bell, Check, Trash2, MessageSquare, CheckSquare, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
    getAllNotifications,
    markAllAsRead,
    markNotificationAsRead,
    type NotificationDTO,
} from "@/app/services/notificationService"
import { getStompClient } from "@/app/services/socket"
import { useAuth } from "@/hooks/use-auth"
import { NotificationToast } from "./notification-toast"

export function NotificationsPopover() {
    const [notifications, setNotifications] = useState<NotificationDTO[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [newNotification, setNewNotification] = useState<NotificationDTO | null>(null)
    const wsSubscriptionRef = useRef<any>(null)
    const { user } = useAuth()

    // 🔥 HOTFIX: unwrap data tại component
    const loadNotifications = async () => {
        try {
            const res: any = await getAllNotifications()
            setNotifications(res?.data ?? [])
        } catch (err) {
            console.error("Load notifications failed", err)
            setNotifications([])
        }
    }

    useEffect(() => {
        loadNotifications()
    }, [])

    // WebSocket realtime
    useEffect(() => {
        if (!user?.userId) return

        const client = getStompClient()
        if (!client || !client.connected) return

        wsSubscriptionRef.current = client.subscribe(
            `/topic/notifications/${user.userId}`,
            (message) => {
                const noti: NotificationDTO = JSON.parse(message.body)
                setNewNotification(noti)
                loadNotifications()
            }
        )

        return () => {
            wsSubscriptionRef.current?.unsubscribe()
        }
    }, [user])

    const handleMarkAsRead = async (notiId: number) => {
        await markNotificationAsRead(notiId)
        setNotifications((prev) =>
            prev.map((n) => (n.notiId === notiId ? { ...n, read: true } : n))
        )
    }

    const handleMarkAllAsRead = async () => {
        await markAllAsRead()
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    }

    const handleDeleteLocal = (notiId: number) => {
        setNotifications((prev) => prev.filter((n) => n.notiId !== notiId))
    }

    const unreadCount = notifications.filter((n) => !n.read).length

    const getIcon = (entityType: string) => {
        switch (entityType.toUpperCase()) {
            case "PROJECT":
                return <AlertTriangle className="h-4 w-4 text-orange-600" />
            case "TASK":
                return <CheckSquare className="h-4 w-4 text-blue-600" />
            case "MESSAGE":
            case "CHAT_ROOM":
                return <MessageSquare className="h-4 w-4 text-green-600" />
            default:
                return <Bell className="h-4 w-4 text-gray-600" />
        }
    }

    return (
        <>
            {newNotification && (
                <NotificationToast
                    notification={newNotification}
                    onDismiss={() => setNewNotification(null)}
                />
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
                            <p className="text-sm text-gray-500">{unreadCount} unread</p>
                        </div>

                        {unreadCount > 0 && (
                            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                                <Check className="h-4 w-4 mr-1" />
                                Mark all read
                            </Button>
                        )}
                    </div>

                    <ScrollArea className="h-[400px]">
                        <div className="p-2 space-y-1">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center py-12 text-gray-500">
                                    <Bell className="h-12 w-12 mb-3 text-gray-300" />
                                    No notifications
                                </div>
                            ) : (
                                notifications.map((n) => (
                                    <div
                                        key={n.notiId}
                                        className={`group flex gap-3 p-3 rounded-lg ${
                                            n.read ? "opacity-60" : "bg-blue-50/50"
                                        }`}
                                    >
                                        {getIcon(n.entityType)}

                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium">
                                                {n.title ?? "Notification"}
                                            </p>
                                            <p className="text-xs text-gray-600 line-clamp-2">
                                                {n.message}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(n.createdDate).toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                                            {!n.read && (
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleMarkAsRead(n.notiId)}
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => handleDeleteLocal(n.notiId)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
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
                                    onClick={() => setNotifications([])}
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
