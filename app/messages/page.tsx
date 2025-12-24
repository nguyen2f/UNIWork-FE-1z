"use client"

import { useEffect, useState, Suspense, useRef, useCallback } from "react"
import { Plus, Send, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sidebar } from "../../components/sidebar"
import { Header } from "../../components/header"
import { getUserChats, sendMessage, getChatHistory } from "@/app/services/chatService"
import { toast } from "sonner"
import type { ChatMessageDTO, Conversation } from "@/types/chatType"
import { CreateChatDialog } from "@/components/create-chat-dialog"
import { connectSocket, disconnectSocket, getStompClient } from "@/app/services/socket"

interface Message {
  id: number
  roomId: number
  senderId: string
  senderName?: string
  content: string
  createdAt: string
}

function MessagesContent() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [createChatOpen, setCreateChatOpen] = useState(false)
  const subscriptionRef = useRef<any>(null)
  const [messages, setMessages] = useState<Message[]>([])

  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log("🔥 CALL connectSocket")
    connectSocket()

    return () => {
      disconnectSocket()
    }
  }, [])

  useEffect(() => {
    const loadChats = async () => {
      try {
        const res = await getUserChats()
        setConversations(res.data)
      } catch (err) {
        console.log("Load chats error:", err)
      }
    }
    loadChats()
  }, [])

  const handleChatCreated = async () => {
    const res = await getUserChats()
    setConversations(res.data)
  }

  const loadChatHistory = useCallback(async (roomId: number) => {
    try {
      setLoading(true)
      setPage(0)
      setMessages([])
      const res = await getChatHistory(roomId, 0, 20)

      if (res.data && Array.isArray(res.data)) {
        const sortedMessages = res.data
          .map((msg) => ({
            id: msg.id,
            roomId: msg.roomId,
            senderId: msg.senderId.toString(),
            senderName: msg.senderName,
            content: msg.content,
            createdAt: msg.createdAt,
          }))
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

        setMessages(sortedMessages)
        setHasMore(sortedMessages.length >= 20)
      }
    } catch (err) {
      console.error("Load chat history error:", err)
      toast.error("Failed to load chat history")
    } finally {
      setLoading(false)
    }
  }, [])

  const loadMoreMessages = useCallback(async () => {
    if (!selectedConversation || !hasMore || loading) return

    try {
      setLoading(true)
      const nextPage = page + 1
      const res = await getChatHistory(selectedConversation, nextPage, 20)

      if (res.data && Array.isArray(res.data)) {
        const newMessages = res.data
          .map((msg) => ({
            id: msg.id,
            roomId: msg.roomId,
            senderId: msg.senderId.toString(),
            senderName: msg.senderName,
            content: msg.content,
            createdAt: msg.createdAt,
          }))
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

        setMessages((prev) => [...newMessages, ...prev])
        setPage(nextPage)
        setHasMore(newMessages.length >= 20)
      }
    } catch (err) {
      console.error("Load more messages error:", err)
    } finally {
      setLoading(false)
    }
  }, [selectedConversation, page, hasMore, loading])

  useEffect(() => {
    if (selectedConversation) {
      loadChatHistory(selectedConversation)
    }
  }, [selectedConversation, loadChatHistory])

  const currentConversation = selectedConversation ? conversations.find((c) => c.roomId === selectedConversation) : null

  const conversationMessages = messages.filter((m) => m.roomId === selectedConversation)

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) {
      return
    }

    const payload: ChatMessageDTO = {
      roomId: selectedConversation,
      senderId: Number(localStorage.getItem("userId")),
      content: newMessage,
    }

    sendMessage(payload)
    setNewMessage("")
  }

  const waitForSocket = (client: any, cb: () => void) => {
    if (client.connected) {
      cb()
    } else {
      setTimeout(() => waitForSocket(client, cb), 100)
    }
  }

  useEffect(() => {
    if (!selectedConversation) return

    const client = getStompClient()
    if (!client) return

    waitForSocket(client, () => {
      subscriptionRef.current?.unsubscribe()

      subscriptionRef.current = client.subscribe(`/topic/chat/${selectedConversation}`, (msg) => {
        const data = JSON.parse(msg.body)

        setMessages((prev) => [
          ...prev,
          {
            id: data.id ?? Date.now(),
            roomId: data.roomId,
            senderId: data.senderId.toString(),
            senderName: data.senderName,
            content: data.content,
            createdAt: data.createdAt ?? new Date().toISOString(),
          },
        ])
      })
    })

    return () => {
      subscriptionRef.current?.unsubscribe()
      subscriptionRef.current = null
    }
  }, [selectedConversation])

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-hidden bg-white">
          <div className="h-full flex">
            {/* ===== SIDEBAR ===== */}
            <div className="w-80 border-r flex flex-col">
              <div className="p-4 border-b">
                <div className="flex justify-between mb-4">
                  <h2 className="font-semibold">Messages</h2>
                  <Button size="sm" onClick={() => setCreateChatOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    New
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input className="pl-10" placeholder="Search..." />
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-2">
                  {conversations.map((c) => (
                    <div
                      key={c.roomId}
                      onClick={() => setSelectedConversation(c.roomId)}
                      className={`p-3 rounded-lg cursor-pointer mb-1 ${
                        selectedConversation === c.roomId ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{c.name?.charAt(0) ?? "C"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{c.name ?? "Direct Chat"}</p>
                          {c.lastMessage ? (
                            <p className="text-xs text-gray-600 truncate">{c.lastMessage.content}</p>
                          ) : (
                            <p className="text-xs text-gray-500">
                              {c.type === "DIRECT" ? "Direct chat" : "Group chat"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* ===== CHAT AREA ===== */}
            <div className="flex-1 flex flex-col">
              {currentConversation ? (
                <>
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">{currentConversation.name ?? "Direct Chat"}</h3>
                    <p className="text-sm text-gray-500">{currentConversation.type}</p>
                  </div>

                  <ScrollArea
                    ref={scrollAreaRef}
                    className="flex-1 p-4"
                    onScroll={(e) => {
                      const scrollPosition = e.currentTarget.scrollTop
                      if (scrollPosition === 0 && hasMore && !loading) {
                        loadMoreMessages()
                      }
                    }}
                  >
                    {conversationMessages.map((m) => (
                      <div key={m.id} className="mb-4">
                        <p className="text-xs font-medium text-gray-600">{m.senderName || m.senderId}</p>
                        <p className="text-sm text-gray-800 bg-gray-100 p-2 rounded max-w-md">{m.content}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(m.createdAt).toLocaleTimeString()}</p>
                      </div>
                    ))}
                  </ScrollArea>

                  <div className="p-4 border-t flex gap-2">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      placeholder="Type a message..."
                      className="resize-none"
                    />
                    <Button onClick={handleSendMessage} disabled={loading}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  Select or create a conversation
                </div>
              )}
            </div>
          </div>
        </main>

        <CreateChatDialog open={createChatOpen} onOpenChange={setCreateChatOpen} onChatCreated={handleChatCreated} />
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
