// Message module types

import type { User } from "./user.types"

export interface Message {
  messageId: number
  content: string
  senderId: number
  projectId?: number
  receiverId?: number
  type: "direct" | "project"
  createdAt: string
  sender: User
}
