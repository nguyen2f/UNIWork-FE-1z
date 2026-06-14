// Chat module types

import type { PageMetadata } from "./common"

export interface ChatMessageDTO {
  messageId?: number
  roomId: number
  senderId: number
  content: string
  timestamp?: string
  createdAt?: string
}

export interface CreateGroupDTO {
  name: string
  description?: string
  members: number[]
}

export interface DirectChat {
  chatId: number
  user1Id: number
  user2Id: number
  createdAt: string
}

export interface GroupChat {
  chatId: number
  name: string
  description?: string
  ownerId: number
  members: number[]
  createdAt: string
  updatedAt?: string
}

export type Chat = DirectChat | GroupChat

export interface ChatRoomDTO {
  roomId: number
  name: string | null
  type: "DIRECT" | "GROUP"
  createdAt: string
  lastMessage?: string | null
  lastMessageTime?: string | null
  lastMessageSenderId?: number | null
  lastMessageSenderName?: string | null
}

export interface Conversation {
  roomId: number
  name: string | null
  type: "DIRECT" | "GROUP"
  createdAt: string
  lastMessage?: string | null
  lastMessageTime?: string | null
  lastMessageSenderId?: number | null
  lastMessageSenderName?: string | null
}

export interface ChatMessageResponseDTO {
  id: number
  roomId: number
  senderId: number
  senderName?: string
  content: string
  createdAt: string
}

export interface ChatPaginatedResponse<T> {
  data: T[]
  metadata: PageMetadata
}

export interface ChatRoomRenameEvent {
  roomId: number
  newName: string
  updatedBy: number
  updatedAt: string
}

export interface ChatListUpdateEvent {
  roomId: number
  lastMessage: string
  lastMessageTime: string
  lastMessageSenderId: number
  lastMessageSenderName: string
}
