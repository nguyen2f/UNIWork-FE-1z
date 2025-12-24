"use client"

import {useEffect, useState, Suspense, useRef} from "react"
import { Plus, Send, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sidebar } from "../../components/sidebar"
import { Header } from "../../components/header"
import { getUserChats, sendMessage } from "@/app/services/chatService"
import { toast } from "sonner"
import type { ChatMessageDTO } from "@/types/chatType"
import { CreateChatDialog } from "@/components/create-chat-dialog"
import {connectSocket, disconnectSocket, getStompClient} from "@/app/services/socket";

interface Conversation {
    roomId: number
    name: string | null
    type: "DIRECT" | "GROUP"
    createdAt: string
}

interface Message {
    id: number
    roomId: number
    senderId: string
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
                setConversations(res.data) // 🔥 QUAN TRỌNG
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

    const currentConversation = selectedConversation
        ? conversations.find((c) => c.roomId === selectedConversation)
        : null

    const conversationMessages = messages.filter(
        (m) => m.roomId === selectedConversation
    )

    const handleSendMessage = () => {
        console.log("CLICK SEND")

        if (!newMessage.trim() || !selectedConversation) {
            console.log("BLOCKED:", { newMessage, selectedConversation })
            return
        }

        const payload: ChatMessageDTO = {
            roomId: selectedConversation,
            senderId: Number(localStorage.getItem("userId")),
            content: newMessage,
        }

        console.log("PAYLOAD:", payload)

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
            // clear subscription cũ
            subscriptionRef.current?.unsubscribe()

            console.log("SUBSCRIBE ROOM:", selectedConversation)

            subscriptionRef.current = client.subscribe(
                `/topic/chat/${selectedConversation}`,
                (msg) => {
                    console.log("🔥 RECEIVED MESSAGE:", msg.body)

                    const data = JSON.parse(msg.body)

                    setMessages((prev) => [
                        ...prev,
                        {
                            id: data.id ?? Date.now(),
                            roomId: data.roomId,
                            senderId: data.senderId,
                            content: data.content,
                            createdAt: data.createdAt ?? new Date().toISOString(),
                        },
                    ])
                }
            )
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
                                                selectedConversation === c.roomId
                                                    ? "bg-blue-50 border border-blue-200"
                                                    : "hover:bg-gray-50"
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Avatar>
                                                    <AvatarFallback>
                                                        {c.name?.charAt(0) ?? "C"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        {c.name ?? "Direct Chat"}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {c.type === "DIRECT" ? "Direct chat" : "Group chat"}
                                                    </p>
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
                                        <h3 className="font-semibold">
                                            {currentConversation.name ?? "Direct Chat"}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {currentConversation.type}
                                        </p>
                                    </div>

                                    <ScrollArea className="flex-1 p-4">
                                        {conversationMessages.map((m) => (
                                            <div key={m.id} className="mb-3">
                                                <p className="text-sm font-medium">{m.senderId}</p>
                                                <p className="text-sm">{m.content}</p>
                                            </div>
                                        ))}
                                    </ScrollArea>

                                    <div className="p-4 border-t flex gap-2">
                                        <Textarea
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type a message..."
                                        />
                                        <Button onClick={handleSendMessage}>
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

                <CreateChatDialog
                    open={createChatOpen}
                    onOpenChange={setCreateChatOpen}
                    onChatCreated={handleChatCreated}
                />
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
