"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { renameGroupChat } from "@/app/services/chatService"
import { toast } from "sonner"

interface RenameChatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roomId: number
  currentName: string
  onRenamed: (newName: string) => void
}

export function RenameChatDialog({ open, onOpenChange, roomId, currentName, onRenamed }: RenameChatDialogProps) {
  const [newName, setNewName] = useState(currentName)
  const [loading, setLoading] = useState(false)

  const handleRename = async () => {
    if (!newName.trim()) {
      toast.error("Please enter a name")
      return
    }

    try {
      setLoading(true)
      await renameGroupChat(roomId, newName)
      toast.success("Group renamed successfully")
      onRenamed(newName)
      onOpenChange(false)
    } catch (err) {
      toast.error("Failed to rename group")
      console.error("Rename error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Group</DialogTitle>
          <DialogDescription>Enter a new name for this group chat</DialogDescription>
        </DialogHeader>
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Group name"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleRename()
            }
          }}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleRename} disabled={loading}>
            {loading ? "Renaming..." : "Rename"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
