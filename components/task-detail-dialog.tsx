"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Clock, AlertCircle, User, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { Task } from "@/types"

interface TaskDetailDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskDetailDialog({ task, open, onOpenChange }: TaskDetailDialogProps) {
  const [newStatus, setNewStatus] = useState(task?.status || "todo")

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

  const handleStatusChange = (newStatus: string) => {
    setNewStatus(newStatus)
    toast.success("Task status updated")
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

            {/* Update Status Section */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold">Update Status</h3>
              <div className="flex flex-wrap gap-2">
                {["todo", "in-progress", "review", "completed"].map((status) => (
                  <Button
                    key={status}
                    variant={newStatus === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(status)}
                    className={newStatus === status ? "bg-blue-600 text-white" : ""}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                  </Button>
                ))}
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
      </DialogContent>
    </Dialog>
  )
}
