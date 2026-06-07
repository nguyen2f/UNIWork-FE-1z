import { api } from "./http-client"
import type {
  ChatMessageDTO,
  CreateGroupDTO,
  ChatPaginatedResponse,
  ChatMessageResponseDTO,
  ChatRoomDTO,
} from "@/types/chat.types"
import { getStompClient } from "./socket"

export const chatService = {
  sendMessage: (message: ChatMessageDTO) => {
    const client = getStompClient()
    if (!client || !client.connected) {
      console.error("WebSocket not connected")
      return
    }
    client.publish({
      destination: "/app/send",
      body: JSON.stringify(message),
    })
  },

  createDirectChat: (user1: number, user2: number) =>
    api<number>({ method: "POST", url: "/chats/direct", params: { user1, user2 } }),

  createGroupChat: (dto: CreateGroupDTO) =>
    api<number>({ method: "POST", url: "/chats/group", data: dto }),

  getMessages: (roomId: number) =>
    api<ChatMessageDTO[]>({ method: "GET", url: `/chats/${roomId}/messages` }),

  getUserChats: () =>
    api<ChatRoomDTO[]>({ method: "GET", url: "/chats" }),

  getDirectChat: (userId: number) =>
    api<number>({ method: "GET", url: `/chats/direct/${userId}` }),

  getHistory: (roomId: number, page = 0, size = 20) =>
    api<ChatPaginatedResponse<ChatMessageResponseDTO>>({
      method: "GET",
      url: `/chat/${roomId}/messages`,
      params: { page, size },
    }),

  renameGroup: (roomId: number, newName: string) =>
    api<any>({ method: "PUT", url: `/chats/${roomId}/rename`, params: { newName } }),

  addMember: (roomId: number, memberId: number) =>
    api<any>({ method: "POST", url: `/chats/${roomId}/members`, params: { memberId } }),

  removeMember: (roomId: number, userId: number) =>
    api<any>({ method: "DELETE", url: `/chats/${roomId}/members/${userId}` }),
}

// Backward-compatible aliases
export const sendMessage = chatService.sendMessage
export const createDirectChat = chatService.createDirectChat
export const createGroupChat = chatService.createGroupChat
export const getChatMessages = chatService.getMessages
export const getUserChats = chatService.getUserChats
export const getDirectChat = chatService.getDirectChat
export const getChatHistory = chatService.getHistory
export const renameGroupChat = chatService.renameGroup
export const addChatMember = chatService.addMember
export const removeChatMember = chatService.removeMember
