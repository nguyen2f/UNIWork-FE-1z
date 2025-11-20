"use client"

import {useEffect, useState} from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { EditTaskDialog } from "@/components/edit-task-dialog"
import { ViewLayoutToggle } from "@/components/view-layout-toggle"
import { Calendar, MoreVertical, Plus, Search, ListTodo, Edit, Trash2, Clock } from "lucide-react"
import { toast } from "sonner"
import {getTask} from "@/app/services/taskService";
import { Task } from "@/types"


export default function TasksPage() {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)

  useEffect(() => {
    fetchTasks()
  }, [])


  const fetchTasks = async () => {
    try {
      const res = await getTask()
      if (res) {
        setSelectedTask(res.data || [])
      }
    } catch (error) {
      console.error(error)
    }

  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "secondary"
      case "DOING":
        return "default"
      case "REVIEWING":
        return "outline"
      case "COMPLETED":
        return "default"
      case "CANCELLED":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "destructive"
      case "HIGH":
        return "destructive"
      case "MEDIUM":
        return "default"
      case "LOW":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const handleEdit = (task: any) => {
    setSelectedTask(task)
    setEditDialogOpen(true)
  }

  const handleDelete = (taskId: string) => {
    toast.success("Task deleted", {
      description: "The task has been deleted successfully.",
    })
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Tasks</h1>
              <p className="text-muted-foreground">Manage and track all your tasks</p>
            </div>
            <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </div>

          {/* Filters and View Toggle */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search tasks..." className="pl-9" />
            </div>
            <ViewLayoutToggle view={view} onViewChange={setView} />
          </div>

          {/* Grid View */}
          {view === "grid" && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {selectedTask?.map((task) => (
                <Card key={task.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Checkbox className="mt-1" />
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg line-clamp-2">{task.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{task.projectName}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(task)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(task.id)} className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>

                    <div className="flex gap-2">
                      <Badge variant={getStatusColor(task.status)}>{getStatusColor(task.status)}</Badge>
                      <Badge variant={getPriorityColor(task.priority)}>{task.priority}</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      {/*<div className="flex items-center gap-2">*/}
                      {/*  <Avatar className="h-6 w-6">*/}
                      {/*    <AvatarImage src={task.assignedAvatar || "/placeholder.svg"} />*/}
                      {/*    <AvatarFallback>{task.assignedName[0]}</AvatarFallback>*/}
                      {/*  </Avatar>*/}
                      {/*  <span className="text-sm text-muted-foreground">{task.assignedName}</span>*/}
                      {/*</div>*/}

                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{task.dueDate}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* List View */}
          {view === "list" && (
            <div className="space-y-3">
              {selectedTask?.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <Checkbox />

                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <ListTodo className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{task.title}</h3>
                            <p className="text-sm text-muted-foreground">{task.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex gap-2">
                            <Badge variant={getStatusColor(task.status)}>{getStatusColor(task.status)}</Badge>
                            <Badge variant={getPriorityColor(task.priority)}>{task.priority}</Badge>
                          </div>

                          <div className="text-sm text-muted-foreground">{task.projectName}</div>

                          {/*<div className="flex items-center gap-2">*/}
                          {/*  <Avatar className="h-6 w-6">*/}
                          {/*    <AvatarImage src={task.assignedAvatar || "/placeholder.svg"} />*/}
                          {/*    <AvatarFallback>{task.assignedName[0]}</AvatarFallback>*/}
                          {/*  </Avatar>*/}
                          {/*  <span className="text-sm text-muted-foreground">{task.assignedName}</span>*/}
                          {/*</div>*/}

                          <div className="flex items-center gap-1 text-sm text-muted-foreground ml-auto">
                            <Clock className="h-4 w-4" />
                            <span>{task.dueDate}</span>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(task)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(task.id)} className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      <CreateTaskDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      <EditTaskDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} task={selectedTask} />
    </div>
  )
}
