"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Clock, AlertCircle, User, Edit, Trash2, Upload } from "lucide-react"
import { toast } from "sonner"
import type { Task } from "@/types"
import {updateTask} from "@/app/services/taskService";
import {TaskRequest} from "@/types/taskType";

interface TaskDetailDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
}


export function TaskDetailDialog({ task, open, onOpenChange }: TaskDetailDialogProps) {

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
        case "cancelled":
            return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const TaskStatusCodeMap = {
    "PENDING": 0,        // PENDING
    "DOING": 1, // DOING
    "REVIEWING": 2,      // REVIEWING
    "COMPLETED": 3,   // COMPLETED
    "CANCELLED": 4    // CANCELLED (nếu có dùng)
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

  console.log(task)

  // const numericProjectId = number(task.projectId)


  const handleStatusChange = async (body: TaskRequest) => {
    try {
      await updateTask(
          task.projectId,  // projectId
          task.taskId,     // taskId
          body
      );

      toast.success("Task status updated successfully.");
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    }
  };

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

            {/* Update Status Section */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold">Update Status</h3>

              <div className="flex flex-wrap gap-2">

                {[  
                  { ui: "todo", be: "PENDING", label: "To do", color: "bg-gray-500" },
                  { ui: "in-progress", be: "DOING", label: "In Progress", color: "bg-blue-500" },
                  { ui: "review", be: "REVIEWING", label: "Reviewing", color: "bg-yellow-500" },
                  { ui: "completed", be: "COMPLETED", label: "Completed", color: "bg-green-600" },
                    {ui: "cancelled", be: "CANCELLED", label: "Cancelled", color: "bg-red-600" },
                ].map((item) => {
                  const isActive = task.status === TaskStatusCodeMap[item.be];

                  return (
                      <Button
                          key={item.ui}
                          variant={isActive ? "default" : "outline"}
                          size="sm"
                          onClick={() =>
                              handleStatusChange({ status: TaskStatusCodeMap[item.be] })
                          }
                          className={isActive ? `${item.color} text-white` : ""}
                      >
                        {item.label}
                      </Button>
                  );
                })}

              </div>
            </div>


            {/* File Upload Section */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold">Attachments</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-700">Drag and drop files or click to upload</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF, DOC up to 10MB</p>
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
