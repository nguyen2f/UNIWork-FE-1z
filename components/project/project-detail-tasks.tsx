"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { taskService } from "@/services/task.service"
import type { Task } from "@/types"
import { useRouter } from "next/navigation"

interface ProjectDetailTasksProps {
  projectId: number
  tasks: Task[]
}

const StatusMap: { [key: number]: { label: string; color: string } } = {
  0: { label: "Pending", color: "bg-gray-500 text-white" },
  1: { label: "In Progress", color: "bg-blue-500 text-white" },
  2: { label: "Reviewing", color: "bg-yellow-500 text-white" },
  3: { label: "Completed", color: "bg-green-500 text-white" },
  4: { label: "Cancelled", color: "bg-red-500 text-white" },
}

const PriorityMap: { [key: number]: { label: string; color: string } } = {
  0: { label: "Low", color: "bg-green-500 text-white" },
  1: { label: "Medium", color: "bg-yellow-500 text-white" },
  2: { label: "High", color: "bg-red-500 text-white" },
}

export function ProjectDetailTasks({ projectId, tasks: initialTasks }: ProjectDetailTasksProps) {
  const [loading, setLoading] = useState(false)
  const [projectTasks, setProjectTasks] = useState<Task[]>()
  const router = useRouter()

  const numericProjectId = Number(projectId)

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await taskService.getByProject(numericProjectId)
      setProjectTasks((response as any).data || response || [])
    } catch (error) {
      toast.error("Failed to fetch tasks.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [numericProjectId])

  const getStatusInfo = (status: number | string) => {
    const code = typeof status === "number" ? status : 0
    return StatusMap[code] || StatusMap[0]
  }

  const getPriorityInfo = (priority: number | string) => {
    const code = typeof priority === "number" ? priority : 0
    return PriorityMap[code] || PriorityMap[0]
  }

  return (
    <div className="space-y-4">
      {projectTasks?.map((task) => {
        const statusInfo = getStatusInfo(task.status)
        const priorityInfo = getPriorityInfo(task.priority)

        return (
          <Card key={task.taskId} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base mb-2">{task.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                    <Badge className={priorityInfo.color}>{priorityInfo.label}</Badge>
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
                        router.push(`/tasks/${task.taskId}`)
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
            </CardContent>
          </Card>
        )
      })}


    </div>
  )
}
