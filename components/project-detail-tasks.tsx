"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { getAllTasksByProjectId } from "@/app/services/taskService"
import type { Task } from "@/types"
import { ProjectTaskDetailDialog } from "./project-task-detail-dialog"

interface ProjectDetailTasksProps {
  projectId: string
  tasks: Task[]
}
export function ProjectDetailTasks({ projectId, tasks: initialTasks }: ProjectDetailTasksProps) {
  const [loading, setLoading] = useState(false)
  const [projectTasks, setProjectTasks] = useState<Task[]>()
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const numericProjectId = Number(projectId)

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await getAllTasksByProjectId(numericProjectId)
      setProjectTasks(response.data)
    } catch (error) {
      toast.error("Failed to fetch tasks.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [numericProjectId])

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
      {projectTasks?.map((task) => (
        <Card key={task.taskId} className="overflow-hidden">
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
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedTask(task)
                      setDetailDialogOpen(true)
                    }}
                  >
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>Edit Task</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Delete Task</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{task.description}</p>

            {/*<div className="flex items-center gap-2">*/}
            {/*  <Avatar className="h-6 w-6">*/}
            {/*    <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} />*/}
            {/*    <AvatarFallback>{task.assignee.name[0]}</AvatarFallback>*/}
            {/*  </Avatar>*/}
            {/*  <span className="text-sm text-gray-600">Assigned to {task.assignee.name}</span>*/}
            {/*</div>*/}

            {/* Comments Section */}
            {/*<div className="space-y-3 pt-3 border-t">*/}
            {/*  <button*/}
            {/*    onClick={() => setSelectedTaskId(selectedTaskId === task.taskId ? null : task.taskId)}*/}
            {/*    className="text-sm font-medium text-blue-600 hover:text-blue-700"*/}
            {/*  >*/}
            {/*    {selectedTaskId === task.taskId ? "Hide" : "Show"} Comments ({(allComments[task.taskId] || []).length})*/}
            {/*  </button>*/}

            {/*  {selectedTaskId === task.taskId && (*/}
            {/*    <div className="space-y-3">*/}
            {/*      /!* Comments List *!/*/}
            {/*      <ScrollArea className="max-h-48">*/}
            {/*        <div className="space-y-3 pr-4">*/}
            {/*          {(allComments[task.taskId] || []).map((comment) => (*/}
            {/*            <div key={comment.id} className="flex gap-2 p-2 rounded bg-gray-50">*/}
            {/*              <Avatar className="h-6 w-6">*/}
            {/*                <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">*/}
            {/*                  {comment.author.avatar}*/}
            {/*                </AvatarFallback>*/}
            {/*              </Avatar>*/}
            {/*              <div className="flex-1 min-w-0">*/}
            {/*                <div className="flex items-center justify-between mb-1">*/}
            {/*                  <p className="text-xs font-medium">{comment.author.name}</p>*/}
            {/*                  <p className="text-xs text-gray-500">{formatTime(comment.createdAt)}</p>*/}
            {/*                </div>*/}
            {/*                <p className="text-xs text-gray-700 break-words">{comment.content}</p>*/}
            {/*              </div>*/}
            {/*            </div>*/}
            {/*          ))}*/}
            {/*          {(allComments[task.taskId] || []).length === 0 && (*/}
            {/*            <p className="text-xs text-gray-500 text-center py-4">No comments yet</p>*/}
            {/*          )}*/}
            {/*        </div>*/}
            {/*      </ScrollArea>*/}

            {/*      /!* Comment Input *!/*/}
            {/*      <div className="flex gap-2">*/}
            {/*        <Input*/}
            {/*          placeholder="Add a comment..."*/}
            {/*          value={newComments[task.taskId] || ""}*/}
            {/*          onChange={(e) => setNewComments((prev) => ({ ...prev, [task.taskId]: e.target.value }))}*/}
            {/*          onKeyPress={(e) => {*/}
            {/*            if (e.key === "Enter" && !e.shiftKey) {*/}
            {/*              e.preventDefault()*/}
            {/*              handleAddComment(task.taskId)*/}
            {/*            }*/}
            {/*          }}*/}
            {/*          className="text-sm"*/}
            {/*        />*/}
            {/*        <Button*/}
            {/*          onClick={() => handleAddComment(task.taskId)}*/}
            {/*          disabled={!(newComments[task.taskId] || "").trim()}*/}
            {/*          size="sm"*/}
            {/*        >*/}
            {/*          <Send className="h-3 w-3" />*/}
            {/*        </Button>*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  )}*/}
            {/*</div>*/}
          </CardContent>
        </Card>
      ))}

      <ProjectTaskDetailDialog task={selectedTask} open={detailDialogOpen} onOpenChange={setDetailDialogOpen} />
    </div>
  )
}
