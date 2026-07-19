"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Calendar, User } from "lucide-react"
import type { Task } from "@/types"

interface TaskListProps {
  projectId: string
  tasks: Task[]
}

export function TaskList({ projectId, tasks }: TaskListProps) {
  const [taskList, setTaskList] = useState(tasks)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-gray-100 text-gray-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "review":
        return "bg-yellow-100 text-yellow-800"
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

  const getStatusText = (status: string) => {
    switch (status) {
      case "todo":
        return "To Do"
      case "in-progress":
        return "In Progress"
      case "review":
        return "Review"
      case "completed":
        return "Completed"
      default:
        return status
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "low":
        return "Low"
      case "medium":
        return "Medium"
      case "high":
        return "High"
      case "critical":
        return "Critical"
      default:
        return priority
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "EPIC": return "bg-purple-100 text-purple-800"
      case "STORY": return "bg-blue-100 text-blue-800"
      case "TASK": return "bg-indigo-100 text-indigo-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case "EPIC": return "Epic"
      case "STORY": return "Story"
      case "TASK": return "Task"
      default: return type
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tasks List</CardTitle>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {taskList.map((task) => (
            <div key={task.taskId} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Assignee</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Badge className={getStatusColor(task.status)}>{getStatusText(task.status)}</Badge>
                <Badge className={getPriorityColor(task.priority)}>{getPriorityText(task.priority)}</Badge>
                {task.type && (
                  <Badge className={getTypeColor(task.type)}>{getTypeText(task.type)}</Badge>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">{task.assigneeName?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <span className="ml-2">{task.assigneeName || "Unassigned"}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(task.dueDate).toLocaleDateString("en-US")}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {taskList.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No tasks yet</p>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create your first task
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
