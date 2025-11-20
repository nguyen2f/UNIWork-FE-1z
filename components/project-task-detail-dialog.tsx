"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, AlertCircle, User, Trash2, Send } from "lucide-react"
import { toast } from "sonner"
import type { Task } from "@/types"

interface ProjectTaskDetailDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Comment {
  id: string
  author: {
    name: string
    avatar: string
  }
  content: string
  createdAt: string
}

export function ProjectTaskDetailDialog({ task, open, onOpenChange }: ProjectTaskDetailDialogProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: { name: "Nguyễn Văn A", avatar: "NA" },
      content: "Đã hoàn thành phần giao diện",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "2",
      author: { name: "Trần Thị B", avatar: "TB" },
      content: "Cần sửa lại padding cho responsive",
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
  ])
  const [newComment, setNewComment] = useState("")

  if (!task) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-gray-100 text-gray-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "review":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      author: { name: "Current User", avatar: "CU" },
      content: newComment,
      createdAt: new Date().toISOString(),
    }

    setComments([...comments, comment])
    setNewComment("")
    toast.success("Comment added")
  }

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter((c) => c.id !== commentId))
    toast.success("Comment deleted")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">{task.title}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-hidden">
          <div className="space-y-6 pr-4">
            {/* Task Info */}
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{task.description}</p>

              {/* Status and Priority */}
              <div className="flex gap-2 flex-wrap">
                <Badge className={getStatusColor(task.status)}>{task.status.toUpperCase()}</Badge>
                <Badge className={getPriorityColor(task.priority)}>{task.priority.toUpperCase()}</Badge>
              </div>

              {/* Task Details Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">DUE DATE</p>
                    <p className="text-sm font-medium">{formatDate(task.dueDate)}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">PRIORITY</p>
                    <p className="text-sm font-medium capitalize">{task.priority}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">CREATED</p>
                    <p className="text-sm font-medium">{formatDate(task.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">ASSIGNED TO</p>
                    <p className="text-sm font-medium">Team Member</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section - CHANGE: Only show comments here, no status update */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>

              {/* Comments List */}
              <ScrollArea className="max-h-64">
                <div className="space-y-3 pr-4">
                  {comments.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No comments yet</p>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-gray-50">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                            {comment.author.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="text-sm font-medium">{comment.author.name}</p>
                            <p className="text-xs text-gray-500">{formatTime(comment.createdAt)}</p>
                          </div>
                          <p className="text-sm text-gray-700 break-words">{comment.content}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>

              {/* Comment Input */}
              <div className="flex gap-2 pt-2">
                <Input
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleAddComment()
                    }
                  }}
                  className="text-sm"
                />
                <Button onClick={handleAddComment} disabled={!newComment.trim()} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
