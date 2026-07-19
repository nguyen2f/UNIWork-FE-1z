"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { CreateTaskDialog } from "@/components/task/create-task-dialog"
import { EditTaskDialog } from "@/components/task/edit-task-dialog"
import {
  Calendar, MoreVertical, Plus, Search, ListTodo, Edit, Trash2, Clock,
  Eye, Kanban, ChevronRight, Flag, LayoutGrid, List, User
} from "lucide-react"
import { toast } from "sonner"
import { taskService } from "@/services/task.service"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

const StatusCfg: Record<string, { label: string; dot: string; bg: string }> = {
  PENDING: { label: "Pending", dot: "bg-slate-400", bg: "bg-slate-100 text-slate-700 border-slate-200" },
  DOING: { label: "In Progress", dot: "bg-amber-500", bg: "bg-amber-50 text-amber-700 border-amber-200" },
  REVIEWING: { label: "Reviewing", dot: "bg-blue-500", bg: "bg-blue-50 text-blue-700 border-blue-200" },
  COMPLETED: { label: "Completed", dot: "bg-emerald-500", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  CANCELLED: { label: "Cancelled", dot: "bg-red-500", bg: "bg-red-50 text-red-700 border-red-200" },
}

const PriorityCfg: Record<string, { label: string; color: string }> = {
  LOW: { label: "Low", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  MEDIUM: { label: "Medium", color: "text-amber-600 bg-amber-50 border-amber-200" },
  HIGH: { label: "High", color: "text-orange-600 bg-orange-50 border-orange-200" },
  CRITICAL: { label: "Critical", color: "text-red-600 bg-red-50 border-red-200" },
}

export default function TasksPage() {
  const router = useRouter()
  const [view, setView] = useState<"grid" | "list" | "kanban">("grid")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null)
  const [projectFilter, setProjectFilter] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => { fetchTasks() }, [])

  const fetchTasks = async () => {
    try {
      const res = await taskService.getMyTasks()
      if (res) setTasks((res as any).data || res || [])
    } catch (error) { console.error(error) }
  }

  const handleEdit = (task: any) => { setSelectedTask(task); setEditDialogOpen(true) }
  const handleViewDetail = (task: any) => { router.push(`/tasks/${task.id || task.taskId}`) }
  const handleDelete = (taskId: string) => { toast.success("Task deleted") }

  const kanbanColumns = [
    { id: "PENDING", title: "Pending" },
    { id: "DOING", title: "In Progress" },
    { id: "REVIEWING", title: "Review" },
    { id: "COMPLETED", title: "Completed" },
    { id: "CANCELLED", title: "Cancelled" },
  ]

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter && t.status !== statusFilter) return false
    if (priorityFilter && t.priority !== priorityFilter) return false
    if (projectFilter && String(t.projectId) !== projectFilter) return false
    if (searchQuery) {
      const titleMatch = t.title?.toLowerCase().includes(searchQuery.toLowerCase())
      const descMatch = t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const projectMatch = t.projectName?.toLowerCase().includes(searchQuery.toLowerCase())
      if (!titleMatch && !descMatch && !projectMatch) return false
    }
    return true
  })

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">My Tasks</h1>
                <p className="text-sm text-slate-500 mt-1">Manage and track your assigned tasks</p>
              </div>
              <Button onClick={() => setCreateDialogOpen(true)} className="gap-1.5 shadow-sm">
                <Plus className="h-4 w-4" /> New Task
              </Button>
            </div>

            {/* Filters */}
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex gap-3 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search tasks..."
                    className="pl-9 bg-white border-slate-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select onValueChange={(v) => setStatusFilter(v === "CLEAR" ? null : v)}>
                  <SelectTrigger className="w-[150px] bg-white"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLEAR">All Status</SelectItem>
                    {Object.entries(StatusCfg).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select onValueChange={(v) => setPriorityFilter(v === "CLEAR" ? null : v)}>
                  <SelectTrigger className="w-[150px] bg-white"><SelectValue placeholder="Priority" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLEAR">All Priority</SelectItem>
                    {Object.entries(PriorityCfg).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select onValueChange={(v) => setProjectFilter(v === "CLEAR" ? null : v)}>
                  <SelectTrigger className="w-[150px] bg-white"><SelectValue placeholder="Project" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLEAR">All Projects</SelectItem>
                    {Array.from(new Set(tasks.map(t => t.projectId))).filter(Boolean).map(id => {
                      const task = tasks.find(t => t.projectId === id)
                      return <SelectItem key={id} value={String(id)}>{task?.projectName || `Project #${id}`}</SelectItem>
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
                <Button variant={view === "grid" ? "default" : "ghost"} size="sm" onClick={() => setView("grid")} className="h-7 w-7 p-0"><LayoutGrid className="h-3.5 w-3.5" /></Button>
                <Button variant={view === "list" ? "default" : "ghost"} size="sm" onClick={() => setView("list")} className="h-7 w-7 p-0"><List className="h-3.5 w-3.5" /></Button>
                <Button variant={view === "kanban" ? "default" : "ghost"} size="sm" onClick={() => setView("kanban")} className="h-7 w-7 p-0"><Kanban className="h-3.5 w-3.5" /></Button>
              </div>
            </div>

            {/* Grid View */}
            {view === "grid" && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTasks.map((task) => {
                  const status = StatusCfg[task.status] || StatusCfg.PENDING
                  const priority = PriorityCfg[task.priority] || PriorityCfg.MEDIUM
                  return (
                    <Card key={task.id || task.taskId} className="group hover:shadow-lg hover:border-blue-200/80 transition-all duration-300 cursor-pointer"
                      onClick={() => handleViewDetail(task)}>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-2.5 flex-1 min-w-0">
                            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-2 flex-shrink-0 mt-0.5">
                              <ListTodo className="h-3.5 w-3.5 text-white" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">{task.title}</h3>
                              {task.projectName && <p className="text-xs text-slate-400 mt-0.5">{task.projectName}</p>}
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                <MoreVertical className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewDetail(task) }}><Eye className="h-4 w-4 mr-2" /> View</DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(task) }}><Edit className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDelete(task.id) }} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        {task.description && <p className="text-xs text-slate-500 line-clamp-2 mb-3">{task.description}</p>}
                        <div className="flex gap-1.5 mb-3">
                          <Badge variant="outline" className={`text-xs border ${status.bg}`}>
                            <div className={`w-1.5 h-1.5 rounded-full mr-1 ${status.dot}`} />{status.label}
                          </Badge>
                          <Badge variant="outline" className={`text-xs border ${priority.color}`}>
                            <Flag className="h-2.5 w-2.5 mr-1" />{priority.label}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                          {task.assigneeName && <span className="flex items-center gap-1"><User className="h-3 w-3" />{task.assigneeName}</span>}
                          <span className="flex items-center gap-1 ml-auto"><Calendar className="h-3 w-3" />{task.dueDate || "No deadline"}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            {/* List View */}
            {view === "list" && (
              <div className="space-y-2">
                {filteredTasks.map((task) => {
                  const status = StatusCfg[task.status] || StatusCfg.PENDING
                  const priority = PriorityCfg[task.priority] || PriorityCfg.MEDIUM
                  return (
                    <Card key={task.id || task.taskId} className="group hover:shadow-md hover:border-blue-200/80 transition-all duration-200 cursor-pointer"
                      onClick={() => handleViewDetail(task)}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${status.dot}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs text-slate-400 font-mono">TASK-{task.taskId || task.id}</span>
                              <h3 className="font-medium text-slate-900 truncate group-hover:text-blue-600 transition-colors">{task.title}</h3>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className={`text-xs border ${priority.color}`}><Flag className="h-2.5 w-2.5 mr-1" />{priority.label}</Badge>
                              <Badge variant="outline" className="text-xs">{status.label}</Badge>
                              {task.projectName && <span className="text-xs text-slate-400">{task.projectName}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0 text-xs text-slate-400">
                            {task.assigneeName && (
                              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
                                {task.assigneeName[0]?.toUpperCase() || "?"}
                              </div>
                            )}
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{task.dueDate || "—"}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-400 transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            {/* Kanban View */}
            {view === "kanban" && (
              <div className="flex gap-4 overflow-x-auto pb-6">
                {kanbanColumns.map((column) => {
                  const colTasks = filteredTasks.filter((t) => t.status === column.id)
                  const colCfg = StatusCfg[column.id] || StatusCfg.PENDING
                  return (
                    <div key={column.id} className="flex-shrink-0 w-72">
                      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${colCfg.dot}`} />
                            <h3 className="font-semibold text-sm text-slate-700">{column.title}</h3>
                          </div>
                          <Badge variant="secondary" className="rounded-full text-xs">{colTasks.length}</Badge>
                        </div>
                        <div className="p-3 space-y-2 min-h-[200px] bg-slate-50/50">
                          {colTasks.map((task) => {
                            const priority = PriorityCfg[task.priority] || PriorityCfg.MEDIUM
                            return (
                              <Card key={task.id || task.taskId} className="group hover:shadow-md transition-shadow cursor-pointer border-slate-200"
                                onClick={() => handleViewDetail(task)}>
                                <CardContent className="p-3">
                                  <h4 className="text-sm font-medium text-slate-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">{task.title}</h4>
                                  <div className="flex gap-1.5">
                                    <Badge variant="outline" className={`text-xs border ${priority.color}`}>
                                      <Flag className="h-2.5 w-2.5 mr-1" />{priority.label}
                                    </Badge>
                                  </div>
                                  {task.assigneeName && (
                                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
                                      <div className="h-5 w-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-semibold">
                                        {task.assigneeName[0]?.toUpperCase()}
                                      </div>
                                      <span className="text-xs text-slate-500">{task.assigneeName}</span>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      <CreateTaskDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onTaskCreated={fetchTasks} />
      <EditTaskDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} task={selectedTask} />
    </div>
  )
}
