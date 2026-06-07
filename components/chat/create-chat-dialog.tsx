"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { createDirectChat, createGroupChat } from "@/services/chat.service"
import { getAllMember } from "@/services/user.service"
import { toast } from "sonner"
import type { CreateGroupDTO } from "@/types/chat.types"
import {message} from "antd";

interface User {
  userId: number
  name: string
  avatar?: string
}

interface CreateChatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onChatCreated: () => void
}

export function CreateChatDialog({ open, onOpenChange, onChatCreated }: CreateChatDialogProps) {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      loadUsers()
    }
  }, [open])

  const loadUsers = async () => {
      try {
          const response = await getAllMember();
          setUsers(response.data);
      } catch (error) {
          message.error("Failed to fetch team members");
      }
  }

  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()))

    const handleSelectUser = (userId: number, checked: boolean) => {
        setSelectedUsers((prev) =>
            checked
                ? [...prev, userId]
                : prev.filter((id) => id !== userId)
        )
    }


    const handleCreateChat = async () => {
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one user")
      return
    }

    try {
      setLoading(true)

      if (selectedUsers.length === 1) {
          const userId = Number(window.localStorage.getItem("userId"));
          const roomId = await createDirectChat(userId, selectedUsers[0]);
          toast.success("Direct chat created")
      } else {
        const groupData: CreateGroupDTO = {
          name: selectedUsers.length > 1 ? "New Group Chat" : "",
          members: selectedUsers,
        }
        const roomId = await createGroupChat(groupData)
        toast.success("Group chat created")
      }

      setSelectedUsers([])
      setSearchQuery("")
      onOpenChange(false)
      onChatCreated()
    } catch (error) {
      toast.error("Failed to create chat")
      console.log("[v0] Error creating chat:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New Chat</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

          <ScrollArea className="h-64 border rounded-lg">
            <div className="p-4 space-y-2">
              {loading ? (
                <div className="text-center text-gray-500">Loading users...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center text-gray-500">No users found</div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.userId}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                      <Checkbox
                          checked={selectedUsers.includes(user.userId)}
                          onCheckedChange={(checked) =>
                              handleSelectUser(user.userId, checked as boolean)
                          }
                      />

                      <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleCreateChat} disabled={selectedUsers.length === 0 || loading} className="flex-1">
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
