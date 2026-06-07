"use client"

import { useEffect, useRef, useState } from "react"
import { Bell, Check, Trash2, MessageSquare, CheckSquare, AlertTriangle, Bug, Layers, FolderKanban } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
    getAllNotifications,
    markAllAsRead,
    markNotificationAsRead,
    deleteNotification,
    getUnreadCount,
} from "@/services/notification.service"
import type { NotificationDTO } from "@/types/notification.types"
import { getStompClient } from "@/services/socket"
import { useAuth } from "@/hooks/use-auth"
import { NotificationToast } from "./notification-toast"

export function NotificationsPopover() {
    const [notifications, setNotifications] = useState<NotificationDTO[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [newNotification, setNewNotification] = useState<NotificationDTO | null>(null)
    const [unreadBadgeCount, setUnreadBadgeCount] = useState(0)
    const wsSubscriptionRef = useRef<any>(null)
    const { user } = useAuth()

    const loadNotifications = async () => {
        try {
            const res: any = await getAllNotifications()
            setNotifications(res?.data ?? [])
        } catch (err) {
            console.error("Load notifications failed", err)
            setNotifications([])
        }
    }

    const loadUnreadCount = async () => {
        try {
            const res: any = await getUnreadCount()
            const count = typeof res === "number" ? res : (res?.data ?? 0)
            setUnreadBadgeCount(count)
        } catch (err) {
            console.error("Load unread count failed", err)
        }
    }

    useEffect(() => {
        loadNotifications()
        loadUnreadCount()
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
                loadUnreadCount()
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
        setUnreadBadgeCount((prev) => Math.max(0, prev - 1))
    }

    const handleMarkAllAsRead = async () => {
        await markAllAsRead()
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        setUnreadBadgeCount(0)
    }

    const handleDelete = async (notiId: number) => {
        try {
            await deleteNotification(notiId)
            const wasUnread = notifications.find(n => n.notiId === notiId && !n.read)
            setNotifications((prev) => prev.filter((n) => n.notiId !== notiId))
            if (wasUnread) {
                setUnreadBadgeCount((prev) => Math.max(0, prev - 1))
            }
        } catch (err) {
            console.error("Delete notification failed", err)
            // Fallback: remove locally even if API fails
            setNotifications((prev) => prev.filter((n) => n.notiId !== notiId))
        }
    }

    const unreadCount = notifications.filter((n) => !n.read).length

    const getIcon = (entityType: string) => {
        switch (entityType?.toUpperCase()) {
            case "PROJECT":
                return <FolderKanban className="h-4 w-4 text-blue-600" />
            case "TASK":
                return <CheckSquare className="h-4 w-4 text-indigo-600" />
            case "ISSUE":
                return <Bug className="h-4 w-4 text-orange-600" />
            case "STAGE":
                return <Layers className="h-4 w-4 text-purple-600" />
            case "MESSAGE":
            case "CHAT_ROOM":
                return <MessageSquare className="h-4 w-4 text-green-600" />
            default:
                return <Bell className="h-4 w-4 text-gray-600" />
        }
    }

    const getTypeLabel = (type: string) => {
        switch (type) {
            case "TASK_ASSIGNED": return "Task Assigned"
            case "TASK_STATUS_CHANGED": return "Task Updated"
            case "ISSUE_ASSIGNED": return "Issue Assigned"
            case "ISSUE_STATUS_CHANGED": return "Issue Updated"
            case "PROJECT_UPDATED": return "Project Updated"
            case "PROJECT_MEMBER_ADDED": return "Member Added"
            case "STAGE_COMPLETED": return "Stage Completed"
            case "STAGE_ACTIVATED": return "Stage Activated"
            case "CHAT_MESSAGE": return "New Message"
            default: return type
        }
    }

    return (
        <>
            {newNotification && (
                <NotificationToast
                    notification={newNotification as any}
                    onDismiss={() => setNewNotification(null)}
                />
            )}

            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
                        )}
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[420px] p-0 shadow-2xl border-0 rounded-xl" align="end">
                    <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
                        <div>
                            <h3 className="font-semibold text-lg">Thông báo</h3>
                            <p className="text-sm text-gray-500">{unreadCount} chưa đọc</p>
                        </div>

                        {unreadCount > 0 && (
                            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="text-blue-600 hover:text-blue-700 hover:bg-blue-100">
                                <Check className="h-4 w-4 mr-1" />
                                Đọc tất cả
                            </Button>
                        )}
                    </div>

                    <ScrollArea className="h-[400px]">
                        <div className="p-2 space-y-1">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center py-12 text-gray-500">
                                    <Bell className="h-12 w-12 mb-3 text-gray-300" />
                                    <p className="text-sm">Không có thông báo</p>
                                </div>
                            ) : (
                                notifications.map((n) => (
                                    <div
                                        key={n.notiId}
                                        className={`group flex gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm ${
                                            n.read ? "opacity-60 hover:opacity-80" : "bg-blue-50/60 hover:bg-blue-50"
                                        }`}
                                    >
                                        <div className="mt-0.5 flex-shrink-0">
                                            {getIcon(n.entityType)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <p className="text-sm font-semibold text-gray-900 truncate">
                                                    {n.title ?? getTypeLabel(n.type)}
                                                </p>
                                                {!n.read && (
                                                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-600 line-clamp-2">
                                                {n.message}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(n.createdDate).toLocaleString("vi-VN")}
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {!n.read && (
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-7 w-7 hover:bg-blue-100"
                                                    onClick={(e) => { e.stopPropagation(); handleMarkAsRead(n.notiId) }}
                                                    title="Đánh dấu đã đọc"
                                                >
                                                    <Check className="h-3.5 w-3.5 text-blue-600" />
                                                </Button>
                                            )}
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7 hover:bg-red-100"
                                                onClick={(e) => { e.stopPropagation(); handleDelete(n.notiId) }}
                                                title="Xóa thông báo"
                                            >
                                                <Trash2 className="h-3.5 w-3.5 text-red-500" />
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
                                    className="w-full text-sm text-gray-500 hover:text-red-600"
                                    onClick={() => setNotifications([])}
                                >
                                    Xóa tất cả thông báo
                                </Button>
                            </div>
                        </>
                    )}
                </PopoverContent>
            </Popover>
        </>
    )
}
