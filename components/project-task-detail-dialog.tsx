"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, AlertCircle, User, Trash2, Send, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { Task } from "@/types"
import { getTaskDetail } from "@/app/services/taskService"

interface ProjectTaskDetailDialogProps {
  task: Task | null
  projectId: number
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

const StatusMap = {
  PENDING: { code: 0, label: "Pending", color: "bg-gray-500 text-white" },
  DOING: { code: 1, label: "In Progress", color: "bg-blue-500 text-white" },
  REVIEWING: { code: 2, label: "Reviewing", color: "bg-yellow-500 text-white" },
  COMPLETED: { code: 3, label: "Completed", color: "bg-green-500 text-white" },
  CANCELLED: { code: 4, label: "Cancelled", color: "bg-red-500 text-white" },
}

const PriorityMap = {
  LOW: { code: 0, label: "Low", color: "bg-green-500 text-white" },
  MEDIUM: { code: 1, label: "Medium", color: "bg-yellow-500 text-white" },
  HIGH: { code: 2, label: "High", color: "bg-red-500 text-white" },
}

// Helper functions to get status/priority info by code
const getStatusByCode = (code: number) => {
  return Object.values(StatusMap).find((s) => s.code === code) || StatusMap.PENDING
}

const getPriorityByCode = (code: number) => {
  return Object.values(PriorityMap).find((p) => p.code === code) || PriorityMap.LOW
}

export function ProjectTaskDetailDialog({ task, projectId, open, onOpenChange }: ProjectTaskDetailDialogProps) {
  const [taskDetail, setTaskDetail] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")

  useEffect(() => {
    if (open && task) {
      fetchTaskDetail()
    }
  }, [open, task])

  const fetchTaskDetail = async () => {
    if (!task) return
    try {
      setLoading(true)
      const response = await getTaskDetail(projectId, task.taskId)
      setTaskDetail(response.data)
      // Set comments from API response if available
      if (response.data?.comments) {
        setComments(response.data.comments)
      }
    } catch (error) {
      console.error("Failed to fetch task detail:", error)
      toast.error("Failed to load task details")
    } finally {
      setLoading(false)
    }
  }

  if (!task) return null

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
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

  // Use taskDetail if available, otherwise fallback to task prop
  const displayTask = taskDetail || task
  const currentStatus =
    typeof displayTask.status === "number" ? getStatusByCode(displayTask.status) : getStatusByCode(0)
  const currentPriority =
    typeof displayTask.priority === "number" ? getPriorityByCode(displayTask.priority) : getPriorityByCode(0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">{displayTask.title || displayTask.name}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <ScrollArea className="flex-1 overflow-hidden">
            <div className="space-y-6 pr-4">
              {/* Task Info */}
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{displayTask.description}</p>

                <div className="flex gap-2 flex-wrap">
                  <Badge className={currentStatus.color}>{currentStatus.label}</Badge>
                  <Badge className={currentPriority.color}>{currentPriority.label}</Badge>
                </div>

                {/* Task Details Grid */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">DUE DATE</p>
                      <p className="text-sm font-medium">{formatDate(displayTask.dueDate || displayTask.endDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">PRIORITY</p>
                      <Badge className={`mt-1 ${currentPriority.color}`}>{currentPriority.label}</Badge>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">CREATED</p>
                      <p className="text-sm font-medium">{formatDate(displayTask.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">ASSIGNED TO</p>
                      <p className="text-sm font-medium">{displayTask.assigneeName || "Team Member"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments Section - Only for project task detail */}
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
        )}
      </DialogContent>
    </Dialog>
  )
}
