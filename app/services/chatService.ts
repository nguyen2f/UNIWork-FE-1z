import { api } from "@/lib/api"
import type { ChatMessageDTO, CreateGroupDTO } from "@/types/chatType"

export const sendMessage = async (message: ChatMessageDTO) => {
  return api<any>({
    method: "POST",
    url: "/chat/send",
    data: message,
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
