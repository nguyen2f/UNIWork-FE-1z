export interface ChatMessageDTO {
  messageId?: number
  chatId: number
  senderId: number
  content: string
  timestamp: string
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
