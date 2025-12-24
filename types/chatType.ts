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

export interface Conversation {
  roomId: number
  name: string | null
  type: "DIRECT" | "GROUP"
  createdAt: string
  lastMessage?: {
    content: string
    senderId: number
    createdAt: string
  }
}

export interface ChatMessageResponseDTO {
  id: number
  roomId: number
  senderId: number
  senderName?: string
  content: string
  createdAt: string
}

export interface PageMetadata {
  page: number
  size: number
  totalElements: number
}

export interface PaginatedResponse<T> {
  data: T[]
  metadata: PageMetadata
}
