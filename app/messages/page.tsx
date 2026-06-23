"use client"

import { useEffect, useState, Suspense, useRef, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Plus, Send, Search, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { getUserChats, sendMessage, getChatHistory } from "@/services/chat.service"
import type { ChatMessageDTO, ChatMessageResponseDTO } from "@/types/chat.types"
import { CreateChatDialog } from "@/components/chat/create-chat-dialog"
import { ChatMessageBubble } from "@/components/chat/chat-message-bubble"
import { RenameChatDialog } from "@/components/chat/rename-chat-dialog"
import { connectSocket, disconnectSocket, onSocketConnected } from "@/services/socket"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Smile } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface Conversation {
  roomId: number
  name: string | null
  type: "DIRECT" | "GROUP"
  createdAt: string
  lastMessage?: string | null
  lastMessageTime?: string | null
  lastMessageSenderId?: number | null
  lastMessageSenderName?: string | null
}

function MessagesContent() {
  const searchParams = useSearchParams()
  const roomIdParam = searchParams.get("roomId")

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null)

  useEffect(() => {
    if (roomIdParam) {
      const roomIdNum = Number(roomIdParam)
      if (!isNaN(roomIdNum)) {
        setSelectedConversation(roomIdNum)
      }
    }
  }, [roomIdParam])

  const [newMessage, setNewMessage] = useState("")
  const [createChatOpen, setCreateChatOpen] = useState(false)
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [renamingRoomId, setRenamingRoomId] = useState<number | null>(null)
  const subscriptionRef = useRef<any>(null)
  const chatUpdateSubRef = useRef<any>(null)
  const unsubscribeConnectRef = useRef<(() => void) | null>(null)
  const [messages, setMessages] = useState<ChatMessageResponseDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const userId = typeof window !== "undefined" ? Number(localStorage.getItem("userId")) : 0

  // Connect socket + subscribe to chat-update for realtime sidebar
  useEffect(() => {
    connectSocket()

    if (!userId) return

    unsubscribeConnectRef.current = onSocketConnected((client) => {
      chatUpdateSubRef.current?.unsubscribe()

      chatUpdateSubRef.current = client.subscribe(
        `/topic/user/${userId}/chat-update`,
        (msg) => {
          const event = JSON.parse(msg.body)
          setConversations((prev) => {
            const updated = prev.map((c) =>
              c.roomId === event.roomId
                ? {
                    ...c,
                    lastMessage: event.lastMessage,
                    lastMessageTime: event.lastMessageTime,
                    lastMessageSenderId: event.lastMessageSenderId,
                    lastMessageSenderName: event.lastMessageSenderName,
                  }
                : c
            )
            // Move updated conversation to top
            const idx = updated.findIndex((c) => c.roomId === event.roomId)
            if (idx > 0) {
              const [item] = updated.splice(idx, 1)
              updated.unshift(item)
            }
            return updated
          })
        }
      )
    })

    return () => {
      chatUpdateSubRef.current?.unsubscribe()
      chatUpdateSubRef.current = null
      unsubscribeConnectRef.current?.()
      unsubscribeConnectRef.current = null
      disconnectSocket()
    }
  }, [])

  useEffect(() => {
    const loadChats = async () => {
      try {
        const res: any = await getUserChats()
        const data = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : [])
        setConversations(data)
      } catch (err) {
        console.error("Load chats error:", err)
        setConversations([])
      }
    }
    loadChats()
  }, [])

  const handleChatCreated = async () => {
    try {
      const res: any = await getUserChats()
      const data = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : [])
      setConversations(data)
    } catch (err) {
      console.error("Reload chats error:", err)
    }
  }

  const currentConversation = selectedConversation ? conversations.find((c) => c.roomId === selectedConversation) : null
    const EMOJIS = [
        "😀", "😄", "😂", "🤣", "😍",
        "😎", "😭", "😡", "👍", "👎",
        "❤️", "🔥", "🎉", "💯", "🙏",
    ]

  useEffect(() => {
    if (!selectedConversation) return

    const loadChatHistory = async () => {
      setLoading(true)
      setCurrentPage(0)
      try {
        const res = await getChatHistory(selectedConversation, 0, 20)
        setMessages(res.data.reverse())
        setHasMore(res.data.length === 20)
      } catch (err) {
        console.error("Load chat history error:", err)
      } finally {
        setLoading(false)
      }
    }

    loadChatHistory()
  }, [selectedConversation])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const payload: ChatMessageDTO = {
      roomId: selectedConversation,
      senderId: userId,
      content: newMessage,
    }

    sendMessage(payload)
    setNewMessage("")
  }

  // WebSocket subscription for messages in selected room
  useEffect(() => {
    if (!selectedConversation) return

    const unsubscribeConnect = onSocketConnected((client) => {
      subscriptionRef.current?.unsubscribe()

      subscriptionRef.current = client.subscribe(`/topic/chat/${selectedConversation}`, (msg) => {
        const data = JSON.parse(msg.body)
        setMessages((prev) => [
          ...prev,
          {
            id: data.id ?? data.messageId ?? Date.now(),
            roomId: data.roomId,
            senderId: data.senderId,
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
      unsubscribeConnect()
    }
  }, [selectedConversation])

  const handleLoadMore = useCallback(async () => {
    if (!selectedConversation || loading || !hasMore) return

    setLoading(true)
    try {
      const nextPage = currentPage + 1
      const res = await getChatHistory(selectedConversation, nextPage, 20)
      if (res.data.length === 0) {
        setHasMore(false)
      } else {
        setMessages((prev) => [...res.data.reverse(), ...prev])
        setCurrentPage(nextPage)
      }
    } catch (err) {
      console.error("Load more error:", err)
    } finally {
      setLoading(false)
    }
  }, [selectedConversation, currentPage, loading, hasMore])

  const handleOpenRename = (roomId: number) => {
    setRenamingRoomId(roomId)
    setRenameDialogOpen(true)
  }

  const handleRenamed = (newName: string) => {
    if (!renamingRoomId) return
    setConversations((prev) => prev.map((c) => (c.roomId === renamingRoomId ? { ...c, name: newName } : c)))
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-hidden bg-white">
          <div className="h-full flex">
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
                  {!Array.isArray(conversations) || conversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No conversations yet</div>
                  ) : (
                    conversations.map((c) => (
                      <div
                        key={c.roomId}
                        className={`p-3 rounded-lg cursor-pointer mb-1 transition-colors flex items-center justify-between group ${
                          selectedConversation === c.roomId ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedConversation(c.roomId)}
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.name ?? "C")}`}
                              alt={c.name ?? "Chat"}
                            />
                            <AvatarFallback>{c.name?.charAt(0) ?? "C"}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{c.name ?? "Direct Chat"}</p>
                            {c.lastMessage && <p className="text-xs text-gray-500 truncate">{c.lastMessageSenderName ? `${c.lastMessageSenderName}: ` : ""}{c.lastMessage}</p>}
                            <p className="text-xs text-gray-400">
                              {c.type === "DIRECT" ? "Direct chat" : "Group chat"}
                            </p>
                          </div>
                        </div>
                        {c.type === "GROUP" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenRename(c.roomId)}>
                                Rename Group
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            <div className="flex-1 flex flex-col">
              {currentConversation ? (
                <>
                  <div
                    className="p-4 border-b cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      if (currentConversation.type === "GROUP") {
                        handleOpenRename(currentConversation.roomId)
                      }
                    }}
                  >
                    <h3 className="font-semibold">{currentConversation.name ?? "Direct Chat"}</h3>
                    <p className="text-sm text-gray-500">
                      {currentConversation.type === "DIRECT" ? "Direct chat" : "Group chat (click to rename)"}
                    </p>
                  </div>

                  <ScrollArea
                    ref={scrollRef}
                    className="flex-1 p-4"
                    onScroll={(e) => {
                      const scrollTop = e.currentTarget.scrollTop
                      if (scrollTop === 0 && !loading && hasMore) {
                        handleLoadMore()
                      }
                    }}
                  >
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-500">No messages yet</div>
                    ) : (
                      <>
                        {loading && (
                          <div className="text-center text-sm text-gray-400 mb-4">Loading more messages...</div>
                        )}
                        {messages.map((m) => (
                          <ChatMessageBubble key={m.id} message={m} isOwn={m.senderId === userId} userId={userId} />
                        ))}
                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </ScrollArea>

                    <div className="p-4 border-t flex gap-2 items-end">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button type="button" variant="ghost">
                                    <Smile className="h-5 w-5" />
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-52">
                                <div className="grid grid-cols-5 gap-2">
                                    {EMOJIS.map((emoji) => (
                                        <button
                                            key={emoji}
                                            className="text-xl hover:bg-gray-100 rounded"
                                            onClick={() => setNewMessage((prev) => prev + emoji)}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>

                        <Textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSendMessage()
                                }
                            }}
                            placeholder="Type a message... (Shift+Enter for new line)"
                            className="resize-none"
                            rows={3}
                        />

                        <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
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
        {renamingRoomId && currentConversation && (
          <RenameChatDialog
            open={renameDialogOpen}
            onOpenChange={setRenameDialogOpen}
            roomId={renamingRoomId}
            currentName={currentConversation.name ?? ""}
            onRenamed={handleRenamed}
          />
        )}
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
