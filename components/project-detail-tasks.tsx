"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MoreHorizontal, Send } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import type { Task } from "@/types"

interface ProjectDetailTasksProps {
  projectId: string
  tasks: Task[]
}

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

export function ProjectDetailTasks({ projectId, tasks }: ProjectDetailTasksProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [allComments, setAllComments] = useState<TaskComment[]>({} as any)
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({})

  const handleAddComment = (taskId: string) => {
    const commentText = newComments[taskId]?.trim()
    if (commentText) {
      const comment: TaskComment = {
        id: Date.now().toString(),
        taskId,
        authorId: "current-user",
        author: { name: "You", avatar: "Y" },
        content: commentText,
        createdAt: new Date().toISOString(),
      }
      setAllComments((prev) => ({
        ...prev,
        [taskId]: [...(prev[taskId] || []), comment],
      }))
      setNewComments((prev) => ({ ...prev, [taskId]: "" }))
      toast.success("Comment added")
    }
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      todo: "bg-gray-100 text-gray-800",
      "in-progress": "bg-blue-100 text-blue-800",
      review: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800",
    }
    return colors[priority] || "bg-gray-100 text-gray-800"
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-base mb-2">{task.title}</CardTitle>
                <div className="flex gap-2 flex-wrap">
                  <Badge className={getStatusColor(task.status)}>{task.status.toUpperCase()}</Badge>
                  <Badge className={getPriorityColor(task.priority)}>{task.priority.toUpperCase()}</Badge>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Edit Task</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Delete Task</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{task.description}</p>

            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} />
                <AvatarFallback>{task.assignee.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">Assigned to {task.assignee.name}</span>
            </div>

            {/* Comments Section */}
            <div className="space-y-3 pt-3 border-t">
              <button
                onClick={() => setSelectedTaskId(selectedTaskId === task.id ? null : task.id)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                {selectedTaskId === task.id ? "Hide" : "Show"} Comments ({(allComments[task.id] || []).length})
              </button>

              {selectedTaskId === task.id && (
                <div className="space-y-3">
                  {/* Comments List */}
                  <ScrollArea className="max-h-48">
                    <div className="space-y-3 pr-4">
                      {(allComments[task.id] || []).map((comment) => (
                        <div key={comment.id} className="flex gap-2 p-2 rounded bg-gray-50">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                              {comment.author.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs font-medium">{comment.author.name}</p>
                              <p className="text-xs text-gray-500">{formatTime(comment.createdAt)}</p>
                            </div>
                            <p className="text-xs text-gray-700 break-words">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                      {(allComments[task.id] || []).length === 0 && (
                        <p className="text-xs text-gray-500 text-center py-4">No comments yet</p>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Comment Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a comment..."
                      value={newComments[task.id] || ""}
                      onChange={(e) => setNewComments((prev) => ({ ...prev, [task.id]: e.target.value }))}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleAddComment(task.id)
                        }
                      }}
                      className="text-sm"
                    />
                    <Button
                      onClick={() => handleAddComment(task.id)}
                      disabled={!(newComments[task.id] || "").trim()}
                      size="sm"
                    >
                      <Send className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
