"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

interface ChatMessageBubbleProps {
  message: {
    id: number
    roomId: number
    senderId: number
    senderName?: string
    content: string
    createdAt: string
  }
  isOwn: boolean
  userId: number
}

export function ChatMessageBubble({ message, isOwn, userId }: ChatMessageBubbleProps) {
  const timeAgo = formatDistanceToNow(new Date(message.createdAt), {
    addSuffix: true,
  })

  const senderInitial = (message.senderName || "U")?.charAt(0).toUpperCase()

  return (
    <div className={`flex gap-3 mb-4 ${isOwn ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className="text-xs">{senderInitial}</AvatarFallback>
      </Avatar>

      {/* Message content */}
      <div className={`flex flex-col max-w-xs ${isOwn ? "items-end" : "items-start"}`}>
        {/* Sender name - chỉ hiện khi không phải message của mình */}
        {!isOwn && <p className="text-xs font-medium text-gray-600 mb-1">{message.senderName || "User"}</p>}

        {/* Message bubble */}
        <div
          className={`px-4 py-2 rounded-2xl break-words ${
            isOwn ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-200 text-gray-900 rounded-bl-none"
          }`}
        >
          <p className="text-sm">{message.content}</p>
        </div>

        {/* Timestamp */}
        <p className={`text-xs text-gray-500 mt-1 ${isOwn ? "text-right" : ""}`}>{timeAgo}</p>
      </div>
    </div>
  )
}
