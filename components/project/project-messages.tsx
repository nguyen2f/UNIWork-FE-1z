"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"
const mockMessages: any[] = []

interface ProjectMessagesProps {
  projectId: number
}

export function ProjectMessages({ projectId }: ProjectMessagesProps) {
  const [messages, setMessages] = useState(mockMessages.filter((m) => m.projectId === projectId))
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Trong thực tế sẽ gọi API để gửi tin nhắn
      const message = {
        messageId: 1,
        content: newMessage,
        senderId: 1, // Current user ID
        projectId,
        type: "project" as const,
        createdAt: new Date().toISOString(),
        sender: {
          userId: 1,
          name: "Bạn",
          email: "you@company.com",
        },
      }
      setMessages([...messages, message])
      setNewMessage("")
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Tin nhắn dự án</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.messageId} className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">{message.sender.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm">{message.sender.name}</span>
                    <span className="text-xs text-gray-500">{new Date(message.createdAt).toLocaleString("vi-VN")}</span>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-md">
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Chưa có tin nhắn nào</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex items-center space-x-2 mt-4 pt-4 border-t">
          <Input
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage()
              }
            }}
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
