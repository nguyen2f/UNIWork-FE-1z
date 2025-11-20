"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Clock, AlertCircle, User, Edit, Trash2, Send } from "lucide-react"
import { toast } from "sonner"
import type { Task } from "@/types"

interface TaskComment {
  id: string
  taskId: string
  authorId: string
  author: {
    name: string
    avatar: string
  }
  content: string
  createdAt: string
}

interface TaskDetailDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskDetailDialog({ task, open, onOpenChange }: TaskDetailDialogProps) {
  const [comments, setComments] = useState<TaskComment[]>([
    {
      id: "1",
      taskId: task?.id || "",
      authorId: "1",
      author: { name: "Sarah Johnson", avatar: "SJ" },
      content: "Started working on this task. Will update progress tomorrow.",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "2",
      taskId: task?.id || "",
      authorId: "2",
      author: { name: "Michael Chen", avatar: "MC" },
      content: "Looks good! Let me review the implementation.",
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
  ])
  const [newComment, setNewComment] = useState("")

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: TaskComment = {
        id: Date.now().toString(),
        taskId: task?.id || "",
        authorId: "current-user",
        author: { name: "You", avatar: "Y" },
        content: newComment,
        createdAt: new Date().toISOString(),
      }
      setComments([...comments, comment])
      setNewComment("")
      toast.success("Comment added successfully")
    }
  }

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter((c) => c.id !== commentId))
    toast.success("Comment deleted")
  }

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
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">ASSIGNED TO</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{task.assignee.name[0]}</AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-medium">{task.assignee.name}</p>
                    </div>
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
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>

              {/* Comments List */}
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-gray-50">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                          {comment.author.avatar}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium">{comment.author.name}</p>
                          <p className="text-xs text-gray-500">{formatTime(comment.createdAt)}</p>
                        </div>
                        <p className="text-sm text-gray-700 break-words">{comment.content}</p>

                        {/* Delete button - show for current user's comments */}
                        {comment.authorId === "current-user" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-6">No comments yet</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                Edit Task
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                <Trash2 className="h-4 w-4 mr-1" />
                Delete Task
              </Button>
            </div>
          </div>
        </ScrollArea>

        {/* Comment Input */}
        <div className="border-t pt-4 mt-4">
          <div className="flex gap-2">
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
            />
            <Button onClick={handleAddComment} disabled={!newComment.trim()} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
