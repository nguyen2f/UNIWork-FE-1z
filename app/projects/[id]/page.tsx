"use client"
import { TaskDetailDialog } from "@/components/task-detail-dialog"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowLeft, Edit, Trash2, Users, MoreHorizontal, BarChart3, Plus } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { getDetailProject } from "@/app/services/projectService"
import { getAllTasksByProjectId } from "@/app/services/taskService"
import Link from "next/link"

// Gantt Chart Component
function GanttChart({ tasks, onTaskClick }: { tasks: any[]; onTaskClick?: (task: any) => void }) {
    const [hoveredTask, setHoveredTask] = useState<number | null>(null)

    // Lọc chỉ lấy các task có taskParentId = null
    const parentTasks = tasks.filter(task => task.taskParentId === null)

    // Map status to progress percentage
    const mapStatusToProgress = (status: string) => {
        switch (status) {
            case "PENDING":
                return 0
            case "DOING":
                return 50
            case "REVIEWING":
                return 80
            case "COMPLETED":
                return 100
            case "CANCELLED":
                return 0
            default:
                return 0
        }
    }

    // Map status to color
    const getStatusColor = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return "#22c55e"
            case "REVIEWING":
                return "#3b82f6"
            case "DOING":
                return "#eab308"
            case "PENDING":
                return "#94a3b8"
            case "CANCELLED":
                return "#ef4444"
            default:
                return "#94a3b8"
        }
    }

    // Process tasks data for Gantt - chỉ xử lý parent tasks
    const ganttData = parentTasks.map((task) => {
        const startDate = new Date(task.createdDate)
        const endDate = new Date(task.dueDate)
        const progress = mapStatusToProgress(task.status)

        return {
            id: task.taskId,
            title: task.title,
            startDate,
            endDate,
            progress,
            status: task.status,
            priority: task.priority,
            assignedTo: task.assignedTo,
            duration: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
            originalTask: task,
        }
    })

    console.log('Parent tasks only:', ganttData)

    // Calculate timeline bounds
    if (ganttData.length === 0) {
        return (
            <div className="bg-white rounded-lg border p-8 text-center text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Không có task nào để hiển thị trong Gantt Chart</p>
            </div>
        )
    }

    const allDates = ganttData.flatMap((t) => [t.startDate, t.endDate])
    const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())))
    const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())))

    // Add padding to timeline
    minDate.setDate(minDate.getDate() - 7)
    maxDate.setDate(maxDate.getDate() + 7)

    // Generate month markers
    const generateMonthMarkers = () => {
        const markers = []
        const current = new Date(minDate)

        while (current <= maxDate) {
            markers.push({
                date: new Date(current),
                label: current.toLocaleDateString("vi-VN", { month: "short", year: "numeric" }),
            })
            current.setMonth(current.getMonth() + 1)
        }

        return markers
    }

    const monthMarkers = generateMonthMarkers()

    // Calculate position percentage
    const getPosition = (date: Date) => {
        return ((date.getTime() - minDate.getTime()) / (maxDate.getTime() - minDate.getTime())) * 100
    }

    const getWidth = (start: Date, end: Date) => {
        return getPosition(end) - getPosition(start)
    }

    // Format date for display
    const formatDate = (date: Date) => {
        return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="text-sm text-gray-600">Total Tasks</div>
                        <div className="text-2xl font-bold mt-1">{tasks.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-sm text-gray-600">Completed</div>
                        <div className="text-2xl font-bold mt-1 text-green-600">
                            {tasks.filter((t) => t.status === "COMPLETED").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-sm text-gray-600">In Progress</div>
                        <div className="text-2xl font-bold mt-1 text-yellow-600">
                            {tasks.filter((t) => t.status === "DOING").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-sm text-gray-600">Pending</div>
                        <div className="text-2xl font-bold mt-1 text-gray-600">
                            {tasks.filter((t) => t.status === "PENDING").length}
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* Timeline Header */}
            <div className="bg-white rounded-lg border p-4">
                <div className="flex items-center gap-4 mb-4">
                    <BarChart3 className="h-5 w-5 text-gray-600" />
                    <h3 className="font-semibold text-lg">Gantt Chart (Parent Tasks Only)</h3>
                    <div className="ml-auto flex gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-green-500"></div>
                            <span>Completed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-blue-500"></div>
                            <span>Reviewing</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-yellow-500"></div>
                            <span>Doing</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-gray-400"></div>
                            <span>Pending</span>
                        </div>
                    </div>
                </div>

                {/* Gantt Chart Container */}
                <div className="overflow-x-auto">
                    <div className="min-w-[1200px]">
                        {/* Timeline Header with Months */}
                        <div className="flex border-b bg-gray-50 sticky top-0 z-10">
                            <div className="w-64 flex-shrink-0 p-3 font-semibold border-r">Task Name</div>
                            <div className="w-32 flex-shrink-0 p-3 font-semibold border-r text-center">Duration</div>
                            <div className="flex-1 relative h-12">
                                {monthMarkers.map((marker, idx) => (
                                    <div
                                        key={idx}
                                        className="absolute top-0 bottom-0 border-l border-gray-300"
                                        style={{ left: `${getPosition(marker.date)}%` }}
                                    >
                                        <span className="absolute top-2 left-2 text-xs font-medium text-gray-600">{marker.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Task Rows */}
                        <div className="divide-y relative">
                            {ganttData.map((task) => (
                                <div
                                    key={task.id}
                                    className="flex hover:bg-gray-50 transition-colors"
                                    onMouseEnter={() => setHoveredTask(task.id)}
                                    onMouseLeave={() => setHoveredTask(null)}
                                >
                                    {/* Task Name */}
                                    <div className="w-64 flex-shrink-0 p-3 border-r">
                                        <div
                                            className="font-medium text-sm truncate cursor-pointer hover:text-blue-600"
                                            onClick={() => onTaskClick?.(task.originalTask)}
                                        >
                                            {task.title}
                                        </div>
                                        <div className="flex gap-1 mt-1">
                                            <Badge variant="outline" className="text-xs">
                                                {task.priority}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Duration */}
                                    <div className="w-32 flex-shrink-0 p-3 border-r text-center text-sm text-gray-600">
                                        {task.duration} days
                                    </div>

                                    {/* Timeline Bar */}
                                    <div className="flex-1 relative p-2">
                                        {/* Grid lines */}
                                        {monthMarkers.map((marker, idx) => (
                                            <div
                                                key={idx}
                                                className="absolute top-0 bottom-0 border-l border-gray-200"
                                                style={{ left: `${getPosition(marker.date)}%` }}
                                            />
                                        ))}

                                        {/* Task Bar */}
                                        <div
                                            className="absolute top-2 h-8 rounded-md shadow-sm cursor-pointer transition-all hover:shadow-md hover:scale-105"
                                            style={{
                                                left: `${getPosition(task.startDate)}%`,
                                                width: `${getWidth(task.startDate, task.endDate)}%`,
                                                backgroundColor: getStatusColor(task.status),
                                                opacity: hoveredTask === task.id ? 1 : 0.9,
                                            }}
                                            onClick={() => onTaskClick?.(task.originalTask)}
                                        >
                                            {/* Progress Bar */}
                                            <div
                                                className="h-full rounded-md bg-black bg-opacity-10"
                                                style={{ width: `${task.progress}%` }}
                                            />

                                            {/* Tooltip on hover */}
                                            {hoveredTask === task.id && (
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-20">
                                                    <div className="font-semibold mb-2">{task.title}</div>
                                                    <div className="space-y-1 text-gray-300">
                                                        <div>Start: {formatDate(task.startDate)}</div>
                                                        <div>End: {formatDate(task.endDate)}</div>
                                                        <div>Status: {task.status}</div>
                                                        <div>Progress: {task.progress}%</div>
                                                    </div>
                                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                                        <div className="border-4 border-transparent border-t-gray-900" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Today Marker */}
                            <div
                                className="absolute top-0 bottom-0 border-l-2 border-red-500 z-5 pointer-events-none"
                                style={{ left: `calc(${64 + 32}px + ${getPosition(new Date())}%)` }}
                            >
                                <div className="absolute -top-6 left-0 transform -translate-x-1/2">
                                    <div className="bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">Today</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
        </div>
    )
}

export default function ProjectDetailPage(props) {
    const [project, setProject] = useState<any>()
    const [tasks, setTasks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [detailDialogOpen, setDetailDialogOpen] = useState(false)
    const [selectedTask, setSelectedTask] = useState<any>(null)
    const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false)

    useEffect(() => {
        fetchProject(Number(props.params.id))
        fetchTasks()
    }, [])

    const fetchProject = async (projectId: number) => {
        try {
            setLoading(true)
            const response = await getDetailProject(projectId)
            setProject(response.data)
        } catch (error) {
            console.error("Failed to fetch project details:", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchTasks = async () => {
        try {
            const res = await getAllTasksByProjectId(props.params.id)
            console.log(res)
            if (res) {
                setTasks(res.data || [])
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleTaskClick = (task: any) => {
        setSelectedTask(task)
        setDetailDialogOpen(true)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PLANNING":
                return "bg-yellow-100 text-yellow-800"
            case "ACTIVE":
                return "bg-green-100 text-green-800"
            case "COMPLETED":
                return "bg-blue-100 text-blue-800"
            case "ON-HOLD":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "LOW":
                return "bg-green-100 text-green-800"
            case "MEDIUM":
                return "bg-yellow-100 text-yellow-800"
            case "HIGH":
                return "bg-orange-100 text-orange-800"
            case "CRITICAL":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case "PLANNING":
                return "Lên kế hoạch"
            case "ACTIVE":
                return "Đang thực hiện"
            case "COMPLETED":
                return "Hoàn thành"
            case "ON-HOLD":
                return "Tạm dừng"
            default:
                return status
        }
    }

    const getPriorityText = (priority: string) => {
        const labels: Record<string, string> = {
            LOW: "LOW",
            MEDIUM: "MEDIUM",
            HIGH: "HIGH",
            CRITICAL: "CRITICAL",
        }
        return labels[priority] || priority
    }

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 flex items-center justify-center">
                        <div>Đang tải...</div>
                    </main>
                </div>
            </div>
        )
    }

    if (!project) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 flex items-center justify-center">
                        <div>Không tìm thấy dự án</div>
                    </main>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-4">
                                <Link href="/projects">
                                    <Button variant="outline" size="icon">
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                                    <p className="text-gray-600 mt-2">{project.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button onClick={() => setCreateTaskDialogOpen(true)} className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Create Task
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">
                                            <MoreHorizontal className="h-4 w-4 mr-2" />
                                            Hành động
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Chỉnh sửa dự án
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Users className="h-4 w-4 mr-2" />
                                            Quản lý thành viên
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600">
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Xóa dự án
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Project Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Status</p>
                                            <Badge className={`mt-2 ${getStatusColor(project.status)}`}>{project.status}</Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Priority</p>
                                            <Badge className={`mt-2 ${getPriorityColor(project.priority)}`}>
                                                {getPriorityText(project.priority)}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Risk Level</p>
                                            <p className="text-2xl font-bold text-gray-900 mt-2">{getPriorityText(project.riskLevel)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Deadline</p>
                                            <p className="text-2xl font-bold text-gray-900 mt-2">
                                                {new Date(project.endDate).toLocaleDateString("vi-VN", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Gantt Chart */}
                        <GanttChart tasks={tasks} onTaskClick={handleTaskClick} />
                    </div>
                </main>
            </div>
            <TaskDetailDialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen} task={selectedTask} />
            <CreateTaskDialog
                open={createTaskDialogOpen}
                onOpenChange={setCreateTaskDialogOpen}
                projectId={Number(props.params.id)}
            />
        </div>
    )
}