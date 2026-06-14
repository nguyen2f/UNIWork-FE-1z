"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { MessageSquare, X, Plus, Send, Search, MoreVertical, ArrowLeft, Smile, UserPlus, UserMinus, Minimize2, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { getUserChats, sendMessage, getChatHistory } from "@/services/chat.service"
import type { ChatMessageDTO, ChatMessageResponseDTO, Conversation } from "@/types/chat.types"
import { CreateChatDialog } from "./create-chat-dialog"
import { ChatMessageBubble } from "./chat-message-bubble"
import { RenameChatDialog } from "./rename-chat-dialog"
import { connectSocket, disconnectSocket, onSocketConnected } from "@/services/socket"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null)
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
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const userId = typeof window !== "undefined" ? Number(localStorage.getItem("userId")) : 0
  const [unreadCount, setUnreadCount] = useState(0)

  const EMOJIS = [
    "😀", "😄", "😂", "🤣", "😍",
    "😎", "😭", "😡", "👍", "👎",
    "❤️", "🔥", "🎉", "💯", "🙏",
  ]

  useEffect(() => {
    if (isOpen) {
      loadChats()
    }
  }, [isOpen])

  // Connect socket once on mount + subscribe to chat-update for realtime sidebar
  useEffect(() => {
    connectSocket()

    if (!userId) return

    unsubscribeConnectRef.current = onSocketConnected((client) => {
      // Cleanup previous subscription
      chatUpdateSubRef.current?.unsubscribe()

      // Subscribe to personal chat-update topic for realtime sidebar updates
      chatUpdateSubRef.current = client.subscribe(
        `/topic/user/${userId}/chat-update`,
        (msg) => {
          const event = JSON.parse(msg.body)
          // Update the conversation's lastMessage in realtime
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
            // Move the updated conversation to the top
            const idx = updated.findIndex((c) => c.roomId === event.roomId)
            if (idx > 0) {
              const [item] = updated.splice(idx, 1)
              updated.unshift(item)
            }
            return updated
          })

          // Increment unread count if the message is from another room
          if (event.roomId !== selectedConversation) {
            setUnreadCount((prev) => prev + 1)
          }
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

  const handleChatCreated = async () => {
    await loadChats()
  }

  const currentConversation = selectedConversation
    ? conversations.find((c) => c.roomId === selectedConversation)
    : null

  // Load chat history when selecting a conversation
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

  // Auto-scroll to bottom
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

  const handleBack = () => {
    setSelectedConversation(null)
    setMessages([])
  }

  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery) return true
    return (c.name ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  })

  const formatTime = (time?: string | null) => {
    if (!time) return ""
    try {
      return formatDistanceToNow(new Date(time), { addSuffix: true, locale: vi })
    } catch {
      return ""
    }
  }

  const widgetWidth = isExpanded ? "w-[500px]" : "w-[380px]"
  const widgetHeight = isExpanded ? "h-[600px]" : "h-[500px]"

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${
          isOpen
            ? "bg-gray-700 hover:bg-gray-800 rotate-0"
            : "bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
        }`}
        id="floating-chat-button"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <>
            <MessageSquare className="h-6 w-6 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </>
        )}
      </button>

      {/* Chat Widget Panel */}
      {isOpen && (
        <div
          className={`fixed bottom-24 right-6 z-50 ${widgetWidth} ${widgetHeight} bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-4 fade-in`}
          id="floating-chat-panel"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex-shrink-0">
            {selectedConversation ? (
              <>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={handleBack}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <p className="font-semibold text-sm truncate max-w-[180px]">
                      {currentConversation?.name ?? "Tin nhắn trực tiếp"}
                    </p>
                    <p className="text-xs text-blue-100">
                      {currentConversation?.type === "DIRECT" ? "Trực tiếp" : "Nhóm"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                  {currentConversation?.type === "GROUP" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenRename(selectedConversation!)}>
                          Đổi tên nhóm
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </>
            ) : (
              <>
                <div>
                  <h3 className="font-bold text-base">Nhắn tin</h3>
                  <p className="text-xs text-blue-100">{conversations.length} cuộc trò chuyện</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={() => setCreateChatOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Content */}
          {selectedConversation ? (
            /* Chat Messages View */
            <div className="flex-1 flex flex-col overflow-hidden">
              <ScrollArea
                ref={scrollRef}
                className="flex-1 px-3 py-2"
                onScroll={(e) => {
                  const scrollTop = e.currentTarget.scrollTop
                  if (scrollTop === 0 && !loading && hasMore) {
                    handleLoadMore()
                  }
                }}
              >
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm py-12">
                    <div className="text-center">
                      <MessageSquare className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                      <p>Chưa có tin nhắn</p>
                      <p className="text-xs mt-1">Hãy bắt đầu cuộc trò chuyện!</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {loading && (
                      <div className="text-center text-xs text-gray-400 mb-3 py-2">
                        <span className="animate-pulse">Đang tải thêm...</span>
                      </div>
                    )}
                    {messages.map((m) => (
                      <ChatMessageBubble key={m.id} message={m} isOwn={m.senderId === userId} userId={userId} />
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </ScrollArea>

              {/* Message Input */}
              <div className="px-3 py-2 border-t bg-gray-50 flex-shrink-0">
                <div className="flex items-end gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                        <Smile className="h-4 w-4 text-gray-500" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-52" side="top">
                      <div className="grid grid-cols-5 gap-2">
                        {EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            className="text-lg hover:bg-gray-100 rounded p-1"
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
                    placeholder="Nhập tin nhắn..."
                    className="resize-none text-sm min-h-[36px] max-h-[80px] py-2"
                    rows={1}
                  />

                  <Button
                    size="icon"
                    className="h-8 w-8 flex-shrink-0 bg-blue-600 hover:bg-blue-700"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* Conversation List View */
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Search */}
              <div className="px-3 py-2 border-b flex-shrink-0">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <Input
                    className="pl-8 h-8 text-sm bg-gray-50"
                    placeholder="Tìm kiếm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Conversations */}
              <ScrollArea className="flex-1">
                <div className="p-1.5">
                  {filteredConversations.length === 0 ? (
                    <div className="py-8 text-center text-gray-400 text-sm">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p>Chưa có cuộc trò chuyện nào</p>
                    </div>
                  ) : (
                    filteredConversations.map((c) => (
                      <div
                        key={c.roomId}
                        className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-200 hover:bg-blue-50 group"
                        onClick={() => setSelectedConversation(c.roomId)}
                      >
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.name ?? "C")}`}
                            alt={c.name ?? "Chat"}
                          />
                          <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                            {c.name?.charAt(0) ?? "C"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-sm truncate text-gray-900">
                              {c.name ?? "Tin nhắn trực tiếp"}
                            </p>
                            {c.lastMessageTime && (
                              <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">
                                {formatTime(c.lastMessageTime)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            {c.lastMessageSenderName && (
                              <span className="text-xs text-gray-500 font-medium truncate">
                                {c.lastMessageSenderName}:
                              </span>
                            )}
                            <p className="text-xs text-gray-500 truncate">
                              {c.lastMessage ?? (c.type === "DIRECT" ? "Trực tiếp" : "Nhóm")}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 flex-shrink-0">
                          {c.type === "DIRECT" ? "DM" : "G"}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      )}

      {/* Dialogs */}
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
    </>
  )
}
