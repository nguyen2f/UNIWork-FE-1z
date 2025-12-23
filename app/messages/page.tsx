"use client"

import { useState, useEffect, Suspense } from "react"
import { Send, Search, Plus, Paperclip, MoreHorizontal, Phone, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sidebar } from "../../components/sidebar"
import { Header } from "../../components/header"
import { sendMessage, getUserChats } from "@/app/services/chatService"
import { toast } from "sonner"
import type { ChatMessageDTO } from "@/types/chatType"

function MessagesContent() {
  const [selectedConversation, setSelectedConversation] = useState(1)
  const [newMessage, setNewMessage] = useState("")
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: "CRM Migration Team",
      type: "group",
      participants: ["John Doe", "Sarah Miller", "Alex Johnson", "Rachel Wong"],
      lastMessage: "The data migration is scheduled for this weekend",
      lastMessageTime: "2 min ago",
      unreadCount: 3,
      project: "Enterprise CRM Migration",
      avatar: "CM",
    },
    {
      id: 2,
      name: "David Kim",
      type: "direct",
      participants: ["David Kim"],
      lastMessage: "Security audit documentation is ready for review",
      lastMessageTime: "15 min ago",
      unreadCount: 1,
      project: "SOC 2 Compliance",
      avatar: "DK",
    },
    {
      id: 3,
      name: "Digital Strategy Team",
      type: "group",
      participants: ["Sarah Miller", "Tom Harris", "Nina Kumar", "Lisa Smith"],
      lastMessage: "Budget approval received for Q2 initiatives",
      lastMessageTime: "1 hour ago",
      unreadCount: 0,
      project: "Digital Transformation",
      avatar: "DS",
    },
    {
      id: 4,
      name: "Michael Rodriguez",
      type: "direct",
      participants: ["Michael Rodriguez"],
      lastMessage: "ERP rollout timeline needs adjustment",
      lastMessageTime: "2 hours ago",
      unreadCount: 0,
      project: "Global ERP Rollout",
      avatar: "MR",
    },
    {
      id: 5,
      name: "Executive Team",
      type: "group",
      participants: ["John Doe", "Sarah Miller", "David Kim", "Michael Rodriguez"],
      lastMessage: "Q1 performance review scheduled for next week",
      lastMessageTime: "1 day ago",
      unreadCount: 0,
      project: "General",
      avatar: "ET",
    },
  ])

  const [messages] = useState([
    {
      id: 1,
      conversationId: 1,
      sender: "Sarah Miller",
      senderAvatar: "SM",
      message: "Good morning team! I wanted to update everyone on the CRM migration progress.",
      timestamp: "9:00 AM",
      type: "text",
    },
    {
      id: 2,
      conversationId: 1,
      sender: "Alex Johnson",
      senderAvatar: "AJ",
      message: "Thanks Sarah. How are we looking on the data validation phase?",
      timestamp: "9:05 AM",
      type: "text",
    },
    {
      id: 3,
      conversationId: 1,
      sender: "Sarah Miller",
      senderAvatar: "SM",
      message: "We've completed 78% of the validation. Found a few data inconsistencies that we're addressing.",
      timestamp: "9:07 AM",
      type: "text",
    },
    {
      id: 4,
      conversationId: 1,
      sender: "John Doe",
      senderAvatar: "JD",
      message:
        "Great work everyone. The data migration is scheduled for this weekend. Please make sure all stakeholders are informed.",
      timestamp: "9:15 AM",
      type: "text",
    },
    {
      id: 5,
      conversationId: 1,
      sender: "Rachel Wong",
      senderAvatar: "RW",
      message: "I'll send out the communication to all department heads today.",
      timestamp: "9:18 AM",
      type: "text",
    },
  ])

  useEffect(() => {
    const loadChats = async () => {
      try {
        const data = await getUserChats()
        console.log("[v0] Chats loaded:", data)
      } catch (error) {
        console.log("[v0] Error loading chats:", error)
      }
    }
    loadChats()
  }, [])

  const currentConversation = conversations.find((c) => c.id === selectedConversation)
  const conversationMessages = messages.filter((m) => m.conversationId === selectedConversation)

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedConversation) {
      try {
        const messageData: ChatMessageDTO = {
          chatId: selectedConversation,
          senderId: 1,
          content: newMessage,
          timestamp: new Date().toISOString(),
        }

        await sendMessage(messageData)
        toast.success("Message sent")
        setNewMessage("")
      } catch (error) {
        toast.error("Failed to send message")
        console.log("[v0] Error sending message:", error)
      }
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-hidden bg-white">
          <div className="h-full flex">
            {/* Conversations List */}
            <div className="w-80 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Messages</h2>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    New
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search conversations..." className="pl-10" />
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-2">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                        selectedConversation === conversation.id
                          ? "bg-blue-50 border border-blue-200"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                              {conversation.avatar}
                            </AvatarFallback>
                          </Avatar>
                          {conversation.type === "group" && (
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-sm truncate">{conversation.name}</h3>
                            <span className="text-xs text-gray-500">{conversation.lastMessageTime}</span>
                          </div>
                          <p className="text-sm text-gray-600 truncate mb-1">{conversation.lastMessage}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {conversation.project}
                            </Badge>
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-blue-500 text-white text-xs">{conversation.unreadCount}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {currentConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {currentConversation.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{currentConversation.name}</h3>
                          <p className="text-sm text-gray-600">
                            {currentConversation.type === "group"
                              ? `${currentConversation.participants.length} members`
                              : "Online"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {conversationMessages.map((message) => (
                        <div key={message.id} className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gray-100 text-gray-700 text-xs">
                              {message.senderAvatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-sm">{message.sender}</span>
                              <span className="text-xs text-gray-500">{message.timestamp}</span>
                            </div>
                            <div className="bg-gray-100 rounded-lg p-3 max-w-md">
                              <p className="text-sm">{message.message}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex items-end space-x-2">
                      <Button variant="ghost" size="icon">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <div className="flex-1">
                        <Textarea
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="min-h-[40px] max-h-32 resize-none"
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault()
                              handleSendMessage()
                            }
                          }}
                        />
                      </div>
                      <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-600">Choose a conversation from the sidebar to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={null}>
      <MessagesContent />
    </Suspense>
  )
}
