import { api } from "@/lib/api"

export interface NotificationDTO {
    notiId: number
    recipientId: number
    entityType: string
    entityId: number
    type: string
    title: string | null
    message: string | null
    createdDate: string
    read: boolean
}

// ⚠️ API trả về OBJECT, KHÔNG unwrap ở đây
export const getAllNotifications = async () => {
    return api<any>({
        method: "GET",
        url: "/notifications",
    })
}

export const markNotificationAsRead = async (notiId: number) => {
    return api({
        method: "PATCH",
        url: `/notifications/${notiId}/read`,
    })
}

export const markAllAsRead = async () => {
    return api({
        method: "POST",
        url: "/notifications/read-all",
    })
}
