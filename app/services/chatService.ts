import { api } from "@/lib/api"
import type { ChatMessageDTO, CreateGroupDTO } from "@/types/chatType"
import {getStompClient} from "@/app/services/socket";

export const sendMessage = (message: ChatMessageDTO) => {
    console.log("SEND MESSAGE CALLED", message)

    const client = getStompClient()
    console.log("STOMP CLIENT:", client)

    if (!client || !client.connected) {
        console.error("WebSocket not connected")
        return
    }

    console.log("PUBLISHING TO /app/send")

    client.publish({
        destination: "/app/send",
        body: JSON.stringify(message),
    })
}



export const createDirectChat = async (user1: number, user2: number) => {
  return api<number>({
    method: "POST",
    url: "/chat/direct",
    params: {
      user1,
      user2,
    },
  })
}

export const createGroupChat = async (dto: CreateGroupDTO) => {
  return api<number>({
    method: "POST",
    url: "/chat/group",
    data: dto,
  })
}

export const getChatMessages = async (roomId: number) => {
  return api<ChatMessageDTO[]>({
    method: "GET",
    url: `/chat/${roomId}/messages`,
  })
}

export const getUserChats = async () => {
  return api<any[]>({
    method: "GET",
    url: "/chat",
  })
}

export const getDirectChat = async (userId: number) => {
    return api<number>({
        method: "GET",
        url: `/chat/direct/${userId}`,
    })


}
