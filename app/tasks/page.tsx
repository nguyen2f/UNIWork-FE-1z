"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { EditTaskDialog } from "@/components/edit-task-dialog"
import { TaskDetailDialog } from "@/components/task-detail-dialog"
import { ViewLayoutToggle } from "@/components/view-layout-toggle"
import { Calendar, MoreVertical, Plus, Search, ListTodo, Edit, Trash2, Clock, Eye, Kanban } from "lucide-react"
import { toast } from "sonner"
import { getTask } from "@/app/services/taskService"

export default function TasksPage() {
    const [view, setView] = useState<"grid" | "list" | "kanban">("grid")
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [detailDialogOpen, setDetailDialogOpen] = useState(false)
    const [selectedTask, setSelectedTask] = useState<any>(null)
    const [tasks, setTasks] = useState<any[]>([])

    useEffect(() => {
        fetchTasks()
    }, [])

    const fetchTasks = async () => {
        try {
            const res = await getTask()
            if (res) {
                setTasks(res.data || [])
            }
        } catch (error) {
            console.error(error)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return "bg-green-500 text-white";
            case "REVIEWING":
                return "bg-blue-500 text-white";
            case "DOING":
                return "bg-yellow-500 text-white";
            case "PENDING":
                return "bg-gray-500 text-white";
            case "CANCELLED":
                return "bg-red-500 text-white";
            default:
                return "bg-gray-400 text-white";
        }
    };

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

    const handleViewDetail = (task: any) => {
        setSelectedTask(task)
        setDetailDialogOpen(true)
    }

    const handleDelete = (taskId: string) => {
        toast.success("Task deleted", {
            description: "The task has been deleted successfully.",
        })
    }

    // Kanban columns configuration
    const kanbanColumns = [
        { id: "PENDING", title: "Pending", color: "bg-gray-100" },
        { id: "DOING", title: "In Progress", color: "bg-yellow-50" },
        { id: "REVIEWING", title: "Review", color: "bg-blue-50" },
        { id: "COMPLETED", title: "Completed", color: "bg-green-50" },
        { id: "CANCELLED", title: "Cancelled", color: "bg-red-50" },
    ]

    const getTasksByStatus = (status: string) => {
        return tasks.filter(task => task.status === status)
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
                        <div className="flex gap-2">
                            <Button
                                variant={view === "grid" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setView("grid")}
                            >
                                Grid
                            </Button>
                            <Button
                                variant={view === "list" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setView("list")}
                            >
                                List
                            </Button>
                            <Button
                                variant={view === "kanban" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setView("kanban")}
                                className="gap-2"
                            >
                                <Kanban className="h-4 w-4" />
                                Kanban
                            </Button>
                        </div>
                    </div>

                    {/* Grid View */}
                    {view === "grid" && (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {tasks?.map((task) => (
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
                                                    <DropdownMenuItem onClick={() => handleViewDetail(task)}>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View Details
                                                    </DropdownMenuItem>
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
                                            <Badge className={getStatusColor(task.status)}>
                                                {task.status}
                                            </Badge>

                                            <Badge variant={getPriorityColor(task.priority)}>
                                                {task.priority}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center justify-between">
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
                            {tasks?.map((task) => (
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
                                                        <Badge className={getStatusColor(task.status)}>
                                                            {task.status}
                                                        </Badge>
                                                        <Badge variant={getPriorityColor(task.priority)}>
                                                            {task.priority}
                                                        </Badge>
                                                    </div>

                                                    <div className="text-sm text-muted-foreground">{task.projectName}</div>

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
                                                            <DropdownMenuItem onClick={() => handleViewDetail(task)}>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                View Details
                                                            </DropdownMenuItem>
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

                    {/* Kanban View */}
                    {view === "kanban" && (
                        <div className="flex gap-6 overflow-x-auto pb-6">
                            {kanbanColumns.map((column) => {
                                const columnTasks = getTasksByStatus(column.id)
                                return (
                                    <div key={column.id} className="flex-shrink-0 w-80">
                                        <div className={`rounded-lg ${column.color} p-4`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-semibold text-sm uppercase tracking-wide">
                                                    {column.title}
                                                </h3>
                                                <Badge variant="secondary" className="rounded-full">
                                                    {columnTasks.length}
                                                </Badge>
                                            </div>

                                            <div className="space-y-3 min-h-[200px]">
                                                {columnTasks.map((task) => (
                                                    <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer">
                                                        <CardHeader className="p-4">
                                                            <div className="flex items-start justify-between">
                                                                <CardTitle className="text-sm font-medium line-clamp-2">
                                                                    {task.title}
                                                                </CardTitle>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1">
                                                                            <MoreVertical className="h-3 w-3" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem onClick={() => handleViewDetail(task)}>
                                                                            <Eye className="h-4 w-4 mr-2" />
                                                                            View Details
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={() => handleEdit(task)}>
                                                                            <Edit className="h-4 w-4 mr-2" />
                                                                            Edit
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            onClick={() => handleDelete(task.id)}
                                                                            className="text-destructive"
                                                                        >
                                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                                            Delete
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                        </CardHeader>
                                                        <CardContent className="p-4 pt-0 space-y-3">
                                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                                {task.description}
                                                            </p>

                                                            <div className="flex flex-wrap gap-1">
                                                                <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                                                                    {task.priority}
                                                                </Badge>
                                                            </div>

                                                            <div className="flex items-center justify-between text-xs">
                                                                <span className="text-muted-foreground">{task.projectName}</span>
                                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                                    <Calendar className="h-3 w-3" />
                                                                    <span>{task.dueDate}</span>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </main>
            </div>

            <CreateTaskDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
            <EditTaskDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} task={selectedTask} />
            <TaskDetailDialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen} task={selectedTask} />
        </div>
    )
}