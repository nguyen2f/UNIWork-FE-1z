"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { CreateTaskDialog } from "@/components/task/create-task-dialog"
import {
  ChevronRight,
  Calendar,
  Clock,
  Target,
  CheckCircle2,
  Circle,
  Loader2,
  AlertCircle,
  Plus,
  Minus,
  MoreHorizontal,
  Play,
  Flag,
  Timer,
  TrendingUp,
  ListTodo,
  Zap,
  Edit,
  Trash2,
  Bug,
  User,
  Search,
  ArrowLeft,
} from "lucide-react"
import { toast } from "sonner"
import { stageService } from "@/services/stage.service"
import { projectService } from "@/services/project.service"
import { taskService } from "@/services/task.service"
import { issueService } from "@/services/issue.service"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditStageDialog } from "@/components/stage/edit-stage-dialog"
import { EditTaskDialog } from "@/components/task/edit-task-dialog"
import { IssueDialog } from "@/components/issue/issue-dialog"
import { Modal } from "antd"

const StageStatusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  PLANNED: { label: "Planned", color: "text-slate-600", bg: "bg-slate-100 text-slate-700 border-slate-200", icon: Circle },
  ACTIVE: { label: "Active", color: "text-emerald-600", bg: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: Play },
  COMPLETED: { label: "Completed", color: "text-blue-600", bg: "bg-blue-50 text-blue-700 border-blue-200", icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", color: "text-red-600", bg: "bg-red-50 text-red-700 border-red-200", icon: AlertCircle },
}

const TaskStatusConfig: Record<string, { label: string; dot: string }> = {
  PENDING: { label: "Pending", dot: "bg-slate-400" },
  DOING: { label: "In Progress", dot: "bg-amber-500" },
  REVIEWING: { label: "Reviewing", dot: "bg-blue-500" },
  COMPLETED: { label: "Completed", dot: "bg-emerald-500" },
  CANCELLED: { label: "Cancelled", dot: "bg-red-500" },
}

const PriorityConfig: Record<string, { label: string; color: string }> = {
  LOW: { label: "Low", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  MEDIUM: { label: "Medium", color: "text-amber-600 bg-amber-50 border-amber-200" },
  HIGH: { label: "High", color: "text-orange-600 bg-orange-50 border-orange-200" },
  CRITICAL: { label: "Critical", color: "text-red-600 bg-red-50 border-red-200" },
}

const IssueStatusCfg: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Open", color: "text-orange-600 bg-orange-50 border-orange-200" },
  IN_PROGRESS: { label: "In Progress", color: "text-blue-600 bg-blue-50 border-blue-200" },
  RESOLVED: { label: "Resolved", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  CLOSED: { label: "Closed", color: "text-slate-600 bg-slate-50 border-slate-200" },
  COMPLETED: { label: "Completed", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  DONE: { label: "Done", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
}

export default function StageDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = Number(params.id)
  const stageId = Number(params.stageId)

  const [stage, setStage] = useState<any>(null)
  const [project, setProject] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [createTaskOpen, setCreateTaskOpen] = useState(false)
  const [editStageOpen, setEditStageOpen] = useState(false)
  const [expandedTasks, setExpandedTasks] = useState<number[]>([])
  const [taskIssues, setTaskIssues] = useState<Record<number, any[]>>({})
  const [editTaskOpen, setEditTaskOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<any>(null)
  const [editIssueOpen, setEditIssueOpen] = useState(false)
  const [editingIssue, setEditingIssue] = useState<any>(null)
  const [editingIssueTaskId, setEditingIssueTaskId] = useState<number>(0)
  const [activeListTab, setActiveListTab] = useState<"tasks" | "issues">("tasks")
  const [listSearchQuery, setListSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null)
  const [userFilter, setUserFilter] = useState<string | null>(null)

  const toggleTask = (taskId: number) => {
    setExpandedTasks(prev => prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId])
  }

  useEffect(() => {
    if (projectId && stageId) {
      fetchData()
    }
  }, [projectId, stageId])

  // Collect all issues from all tasks into a flat list
  const allIssues = useMemo(() => {
    const issues: any[] = []
    Object.entries(taskIssues).forEach(([taskId, taskIssueList]) => {
      taskIssueList.forEach((issue: any) => {
        const task = tasks.find(t => t.taskId === Number(taskId))
        issues.push({ ...issue, _taskTitle: task?.title || `Task #${taskId}` })
      })
    })
    return issues
  }, [taskIssues, tasks])

  // Filtered tasks based on search query and filters
  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (statusFilter) result = result.filter(t => t.status === statusFilter)
    if (priorityFilter) result = result.filter(t => t.priority === priorityFilter)
    if (userFilter) result = result.filter(t => t.assigneeName === userFilter)

    if (!listSearchQuery.trim()) return result
    const q = listSearchQuery.toLowerCase()
    return result.filter(t =>
      t.title?.toLowerCase().includes(q) ||
      t.assigneeName?.toLowerCase().includes(q) ||
      t.status?.toLowerCase().includes(q)
    )
  }, [tasks, listSearchQuery, statusFilter, priorityFilter, userFilter])

  // Filtered issues based on search query and filters
  const filteredIssues = useMemo(() => {
    let result = allIssues;
    if (statusFilter) result = result.filter(i => i.status === statusFilter)
    if (priorityFilter) result = result.filter(i => i.priority === priorityFilter)
    if (userFilter) result = result.filter(i => (i.assigneeName || i.assignedToName) === userFilter)

    if (!listSearchQuery.trim()) return result
    const q = listSearchQuery.toLowerCase()
    return result.filter((i: any) =>
      i.title?.toLowerCase().includes(q) ||
      i.reporterName?.toLowerCase().includes(q) ||
      i.assigneeName?.toLowerCase().includes(q) ||
      i.status?.toLowerCase().includes(q) ||
      i._taskTitle?.toLowerCase().includes(q)
    )
  }, [allIssues, listSearchQuery, statusFilter, priorityFilter, userFilter])

  const allUsers = useMemo(() => Array.from(new Set([
    ...tasks.map(t => t.assigneeName).filter(Boolean),
    ...allIssues.map((i: any) => i.assigneeName || i.assignedToName).filter(Boolean)
  ])).sort() as string[], [tasks, allIssues])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [stageRes, projectRes, taskRes] = await Promise.all([
        stageService.getById(projectId, stageId),
        projectService.getById(projectId),
        taskService.getByStage(stageId),
      ])

      const stageData = (stageRes as any)?.data || stageRes
      setStage(stageData)

      const projectData = (projectRes as any)?.project || (projectRes as any)?.data?.project || projectRes
      setProject(projectData)

      let taskData = (taskRes as any)?.data || taskRes
      let taskList = Array.isArray(taskData) ? taskData : []
      setTasks(taskList)

      const issuesByTask: Record<number, any[]> = {}
      await Promise.all(taskList.map(async (t) => {
        try {
          const res: any = await issueService.getByTask(t.taskId)
          let issues = []
          if (Array.isArray(res)) issues = res
          else if (res?.data && Array.isArray(res.data)) issues = res.data
          issuesByTask[t.taskId] = issues
        } catch (e) {
          console.error("Failed to fetch issues for task", t.taskId, e)
          issuesByTask[t.taskId] = []
        }
      }))
      setTaskIssues(issuesByTask)
    } catch (error) {
      console.error("Failed to fetch stage data:", error)
      toast.error("Failed to load stage details")
    } finally {
      setLoading(false)
    }
  }

  const handleActivate = async () => {
    try {
      await stageService.activate(projectId, stageId)
      toast.success("Stage activated")
      fetchData()
    } catch (error) {
      toast.error("Failed to activate stage")
    }
  }

  const handleComplete = async () => {
    try {
      await stageService.complete(projectId, stageId)
      toast.success("Stage completed")
      fetchData()
    } catch (error) {
      toast.error("Failed to complete stage")
    }
  }

  const handleDeleteStage = () => {
    Modal.confirm({
      title: 'Are you sure you want to delete this stage?',
      content: 'This action cannot be undone. All tasks within this stage will also be deleted.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await stageService.delete(projectId, stageId)
          toast.success("Stage deleted successfully")
          router.push(`/projects/${projectId}`)
        } catch (error) {
          toast.error("Failed to delete stage")
        }
      }
    })
  }

  const handleEditTask = (task: any) => {
    setEditingTask(task)
    setEditTaskOpen(true)
  }

  const handleDeleteTask = (taskId: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this task?',
      content: 'This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await taskService.delete(taskId)
          toast.success("Task deleted successfully")
          fetchData()
        } catch (error) {
          toast.error("Failed to delete task")
        }
      }
    })
  }

  const handleEditIssue = (issue: any, taskId: number) => {
    setEditingIssue(issue)
    setEditingIssueTaskId(taskId)
    setEditIssueOpen(true)
  }

  const handleDeleteIssue = (issueId: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this issue?',
      content: 'This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await issueService.delete(issueId)
          toast.success("Issue deleted successfully")
          fetchData()
        } catch (error) {
          toast.error("Failed to delete issue")
        }
      }
    })
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric", month: "short", day: "numeric",
    })
  }

  const getDaysRemaining = () => {
    if (!stage?.endDate) return null
    const end = new Date(stage.endDate)
    const now = new Date()
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-sm text-slate-500">Loading stage details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!stage) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            <AlertCircle className="h-12 w-12 text-slate-300 mb-4" />
            <h2 className="text-xl font-semibold text-slate-700">Stage Not Found</h2>
            <p className="text-slate-500 mt-2 mb-6">The stage you are looking for does not exist.</p>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const statusConfig = StageStatusConfig[stage.status] || StageStatusConfig.PLANNED
  const StatusIcon = statusConfig.icon
  const daysRemaining = getDaysRemaining()
  const validTasks = tasks.filter(t => t.status !== "CANCELLED")
  const completedTasks = validTasks.filter(t => t.status === "COMPLETED").length
  const totalTasks = validTasks.length
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-slate-50">
          <div className="max-w-6xl mx-auto px-6 py-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm mb-6">
              <Link href="/projects" className="text-slate-500 hover:text-blue-600 transition-colors font-medium">
                Projects
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <Link href={`/projects/${projectId}`} className="text-slate-500 hover:text-blue-600 transition-colors font-medium max-w-[200px] truncate">
                {project?.name || `Project #${projectId}`}
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-slate-900 font-semibold">{stage.name}</span>
            </nav>

            {/* Stage Hero */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-8 py-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-xs">
                        {stage.type || "STAGE"}
                      </Badge>
                      <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-xs">
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">{stage.name}</h1>
                    {stage.description && (
                      <p className="text-blue-100 text-sm mb-1">{stage.description}</p>
                    )}
                    {stage.goal && (
                      <p className="text-blue-50/80 text-xs flex items-center gap-1">
                        <Target className="h-3 w-3" /> Goal: {stage.goal}
                      </p>
                    )}
                    <p className="text-blue-100 text-sm mt-1">
                      {formatDate(stage.startDate)} — {formatDate(stage.endDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {stage.status === "PLANNED" && (
                      <Button size="sm" onClick={handleActivate} className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
                        <Play className="h-3.5 w-3.5 mr-1.5" /> Activate
                      </Button>
                    )}
                    {stage.status === "ACTIVE" && (
                      <Button size="sm" onClick={handleComplete} className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Complete
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditStageOpen(true)}>Edit Stage</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={handleDeleteStage}>Delete Stage</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-slate-100">
                <div className="px-6 py-5">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium uppercase tracking-wider mb-1.5">
                    <TrendingUp className="h-3.5 w-3.5" /> Progress
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-slate-900">{progressPercent}%</span>
                    <Progress value={progressPercent} className="flex-1 h-2" />
                  </div>
                </div>
                <div className="px-6 py-5">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium uppercase tracking-wider mb-1.5">
                    <ListTodo className="h-3.5 w-3.5" /> Tasks
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{completedTasks}<span className="text-slate-400 text-lg font-normal">/{totalTasks}</span></p>
                </div>
                <div className="px-6 py-5">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium uppercase tracking-wider mb-1.5">
                    <Zap className="h-3.5 w-3.5" /> Issues
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    {stage.resolvedIssues ?? 0}<span className="text-slate-400 text-lg font-normal">/{stage.totalIssues ?? 0}</span>
                  </p>
                </div>
                <div className="px-6 py-5">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium uppercase tracking-wider mb-1.5">
                    <Timer className="h-3.5 w-3.5" /> Remaining
                  </div>
                  <p className={`text-2xl font-bold ${daysRemaining !== null && daysRemaining < 0 ? 'text-red-600' : daysRemaining !== null && daysRemaining <= 3 ? 'text-amber-600' : 'text-slate-900'}`}>
                    {daysRemaining !== null ? (daysRemaining < 0 ? `${Math.abs(daysRemaining)}d overdue` : `${daysRemaining}d`) : ""}
                  </p>
                </div>
                <div className="px-6 py-5">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium uppercase tracking-wider mb-1.5">
                    <Calendar className="h-3.5 w-3.5" /> Duration
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    {stage.startDate && stage.endDate
                      ? `${Math.ceil((new Date(stage.endDate).getTime() - new Date(stage.startDate).getTime()) / (1000 * 60 * 60 * 24))}d`
                      : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Tasks Section */}
            {/* <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Tasks</h2>
                <p className="text-sm text-slate-500">{totalTasks} task{totalTasks !== 1 ? 's' : ''} in this stage</p>
              </div>
              <Button onClick={() => setCreateTaskOpen(true)} size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Add Task
              </Button>
            </div> */}

            {/* {totalTasks === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="rounded-full bg-slate-100 p-4 mb-4">
                    <ListTodo className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600 font-medium mb-1">No tasks yet</p>
                  <p className="text-sm text-slate-400 mb-4">Create your first task to get started</p>
                  <Button onClick={() => setCreateTaskOpen(true)} variant="outline" size="sm" className="gap-1.5">
                    <Plus className="h-3.5 w-3.5" /> Create Task
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {tasks.map(task => {
                  const statusCfg = TaskStatusConfig[task.status] || TaskStatusConfig.PENDING
                  const priorityCfg = PriorityConfig[task.priority] || PriorityConfig.LOW
                  return (
                    <Card
                      key={task.taskId}
                      className="group transition-all duration-200 mb-3"
                    >
                      <CardContent className="p-0">
                        <div 
                          className="flex items-center gap-4 p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                          onClick={() => router.push(`/tasks/${task.taskId}`)}
                        >
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusCfg.dot}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-xs text-slate-400 font-mono">TASK-{task.taskId}</span>
                              <h3 className="font-medium text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                                {task.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className={`text-xs border ${priorityCfg.color}`}>
                                <Flag className="h-2.5 w-2.5 mr-1" />
                                {priorityCfg.label}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {statusCfg.label}
                              </Badge>
                              {task.createdDate && task.dueDate && (
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(task.createdDate)} — {formatDate(task.dueDate)}
                                </span>
                              )}
                              <span className="text-xs text-slate-500 ml-2">
                                {(taskIssues[task.taskId] || []).filter((i:any) => i.status === 'COMPLETED' || i.status === 'DONE').length}/{(taskIssues[task.taskId] || []).length} issues completed
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 flex-shrink-0">
                            <div className="w-24 hidden sm:block">
                              {(() => {
                                const issues = taskIssues[task.taskId] || []
                                const done = issues.filter((i:any) => i.status === 'COMPLETED' || i.status === 'DONE').length
                                const pct = issues.length > 0 ? Math.round((done / issues.length) * 100) : 0
                                return (
                                  <>
                                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                                      <span>{pct}%</span>
                                    </div>
                                    <Progress value={pct} className="h-1.5" />
                                  </>
                                )
                              })()}
                            </div>
                            {task.assigneeName && (
                              <div className="flex items-center gap-2 hidden md:flex">
                                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
                                  {task.assigneeName?.[0]?.toUpperCase() || "?"}
                                </div>
                              </div>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 z-10 relative hover:bg-slate-100 ml-2"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditTask(task) }}>
                                  <Edit className="h-4 w-4 mr-2" /> Edit Task
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600" onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.taskId) }}>
                                  <Trash2 className="h-4 w-4 mr-2" /> Delete Task
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="ml-2 z-10 relative bg-white h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTask(task.taskId);
                              }}
                            >
                              {expandedTasks.includes(task.taskId) ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        {expandedTasks.includes(task.taskId) && (
                          <div className="border-t border-slate-100 bg-slate-50/80 p-3 pl-8 space-y-2">
                            {(!taskIssues[task.taskId] && <p className="text-xs text-slate-500 py-1">Loading issues...</p>)}
                            {taskIssues[task.taskId] && taskIssues[task.taskId].length === 0 && (
                              <p className="text-xs text-slate-500 py-1">No issues for this task.</p>
                            )}
                            {taskIssues[task.taskId]?.map((issue: any) => (
                              <div 
                                key={issue.issueId} 
                                className="flex items-center justify-between bg-white border border-slate-200 rounded p-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
                                onClick={() => router.push(`/issues/${issue.issueId}`)}
                              >
                                <div className="flex items-center gap-3">
                                  <AlertCircle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                                  <span className="text-sm font-medium text-slate-700 line-clamp-1 group-hover:text-blue-600 transition-colors">{issue.title}</span>
                                  <Badge variant="outline" className="text-[10px] py-0 h-4.5 flex-shrink-0 bg-slate-50">{issue.status}</Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-6 w-6 z-10 relative hover:bg-slate-100"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <MoreHorizontal className="h-3 w-3 text-slate-400" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditIssue(issue, task.taskId) }}>
                                        <Edit className="h-4 w-4 mr-2" /> Edit Issue
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="text-red-600" onClick={(e) => { e.stopPropagation(); handleDeleteIssue(issue.issueId) }}>
                                        <Trash2 className="h-4 w-4 mr-2" /> Delete Issue
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                  <ChevronRight className="h-4 w-4 text-slate-300" />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )} */}

            {/* ─── All Tasks & Issues List View ─── */}
            <div className="mt-10">
              {/* Section Header with Tabs */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">All Tasks & Issues</h2>
                  <p className="text-sm text-slate-500">
                    {tasks.length} task{tasks.length !== 1 ? "s" : ""} · {allIssues.length} issue{allIssues.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Select onValueChange={(v) => setStatusFilter(v === "CLEAR" ? null : v)}>
                    <SelectTrigger className="w-[120px] h-8 bg-white text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLEAR">All Status</SelectItem>
                      {Object.entries(activeListTab === "tasks" ? TaskStatusConfig : IssueStatusCfg).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select onValueChange={(v) => setPriorityFilter(v === "CLEAR" ? null : v)}>
                    <SelectTrigger className="w-[120px] h-8 bg-white text-xs"><SelectValue placeholder="Priority" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLEAR">All Priority</SelectItem>
                      {Object.entries(PriorityConfig).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select onValueChange={(v) => setUserFilter(v === "CLEAR" ? null : v)}>
                    <SelectTrigger className="w-[120px] h-8 bg-white text-xs"><SelectValue placeholder="User" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLEAR">All Users</SelectItem>
                      {allUsers.map((user) => (
                        <SelectItem key={user} value={user}>{user}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder={`Search ${activeListTab}...`}
                      value={listSearchQuery}
                      onChange={(e) => setListSearchQuery(e.target.value)}
                      className="pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all w-48"
                    />
                  </div>
                  {/* Tab Switcher */}
                  <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                    <button
                      onClick={() => { setActiveListTab("tasks"); setListSearchQuery("") }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        activeListTab === "tasks"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <ListTodo className="h-3.5 w-3.5" />
                      Tasks
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeListTab === "tasks" ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-500"}`}>
                        {tasks.length}
                      </span>
                    </button>
                    <button
                      onClick={() => { setActiveListTab("issues"); setListSearchQuery("") }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        activeListTab === "issues"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <Bug className="h-3.5 w-3.5" />
                      Issues
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeListTab === "issues" ? "bg-orange-100 text-orange-700" : "bg-slate-200 text-slate-500"}`}>
                        {allIssues.length}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* ─── Tasks List ─── */}
              {activeListTab === "tasks" && (
                <Card className="overflow-hidden border-slate-200/80">
                  <CardContent className="p-0">
                    {/* Table Header */}
                    <div className="grid grid-cols-[1fr_100px_100px_120px_140px_80px] gap-3 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <span>Task</span>
                      <span>Status</span>
                      <span>Priority</span>
                      <span>Assignee</span>
                      <span>Due Date</span>
                      <span className="text-right">Actions</span>
                    </div>

                    {filteredTasks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <ListTodo className="h-10 w-10 text-slate-300 mb-3" />
                        <p className="text-sm text-slate-500 font-medium">
                          {listSearchQuery ? "No tasks match your search" : "No tasks in this stage"}
                        </p>
                        {listSearchQuery && (
                          <button onClick={() => setListSearchQuery("")} className="text-xs text-blue-500 hover:text-blue-700 mt-1">
                            Clear search
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {filteredTasks.map((task) => {
                          const sCfg = TaskStatusConfig[task.status] || TaskStatusConfig.PENDING
                          const pCfg = PriorityConfig[task.priority] || PriorityConfig.MEDIUM
                          const issues = taskIssues[task.taskId] || []
                          const openIssues = issues.filter((i: any) => i.status !== "COMPLETED" && i.status !== "DONE" && i.status !== "RESOLVED" && i.status !== "CLOSED").length
                          return (
                            <div
                              key={task.taskId}
                              className="grid grid-cols-[1fr_100px_100px_120px_140px_80px] gap-3 items-center px-5 py-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer group"
                              onClick={() => router.push(`/tasks/${task.taskId}`)}
                            >
                              {/* Task Info */}
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${sCfg.dot}`} />
                                  <span className="text-xs text-slate-400 font-mono flex-shrink-0">TASK-{task.taskId}</span>
                                  <span className="font-medium text-sm text-slate-900 truncate group-hover:text-blue-600 transition-colors">{task.title}</span>
                                </div>
                                {openIssues > 0 && (
                                  <div className="flex items-center gap-2 ml-4 text-xs text-slate-400">
                                    <span className="flex items-center gap-0.5 text-orange-500">
                                      <Bug className="h-3 w-3" />{openIssues} open issue{openIssues !== 1 ? "s" : ""}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Status */}
                              <div>
                                <Badge variant="outline" className="text-[10px] py-0.5 whitespace-nowrap">{sCfg.label}</Badge>
                              </div>

                              {/* Priority */}
                              <div>
                                <Badge variant="outline" className={`text-[10px] py-0.5 border whitespace-nowrap ${pCfg.color}`}>
                                  <Flag className="h-2.5 w-2.5 mr-0.5" />{pCfg.label}
                                </Badge>
                              </div>

                              {/* Assignee */}
                              <div className="flex items-center gap-1.5 min-w-0">
                                {task.assigneeName ? (
                                  <>
                                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                                      {task.assigneeName[0]?.toUpperCase()}
                                    </div>
                                    <span className="text-xs text-slate-600 truncate">{task.assigneeName}</span>
                                  </>
                                ) : (
                                  <span className="text-xs text-slate-400 italic">Unassigned</span>
                                )}
                              </div>

                              {/* Due Date */}
                              <div className="flex items-center gap-1 text-xs text-slate-500">
                                <Calendar className="h-3 w-3 flex-shrink-0" />
                                <span className="whitespace-nowrap">{formatDate(task.dueDate)}</span>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center justify-end gap-1">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditTask(task) }}>
                                      <Edit className="h-4 w-4 mr-2" /> Edit Task
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600" onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.taskId) }}>
                                      <Trash2 className="h-4 w-4 mr-2" /> Delete Task
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <ChevronRight className="h-4 w-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* ─── Issues List ─── */}
              {activeListTab === "issues" && (
                <Card className="overflow-hidden border-slate-200/80">
                  <CardContent className="p-0">
                    {/* Table Header */}
                    <div className="grid grid-cols-[1fr_100px_100px_120px_140px_80px] gap-3 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <span>Issue</span>
                      <span>Status</span>
                      <span>Priority</span>
                      <span>Reporter</span>
                      <span>Due Date</span>
                      <span className="text-right">Actions</span>
                    </div>

                    {filteredIssues.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Bug className="h-10 w-10 text-slate-300 mb-3" />
                        <p className="text-sm text-slate-500 font-medium">
                          {listSearchQuery ? "No issues match your search" : "No issues in this stage"}
                        </p>
                        {listSearchQuery && (
                          <button onClick={() => setListSearchQuery("")} className="text-xs text-blue-500 hover:text-blue-700 mt-1">
                            Clear search
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {filteredIssues.map((issue: any) => {
                          const isCfg = IssueStatusCfg[issue.status] || { label: issue.status, color: "text-slate-600 bg-slate-50 border-slate-200" }
                          const pCfg = PriorityConfig[issue.priority] || PriorityConfig.MEDIUM
                          return (
                            <div
                              key={issue.issueId}
                              className="grid grid-cols-[1fr_100px_100px_120px_140px_80px] gap-3 items-center px-5 py-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer group"
                              onClick={() => router.push(`/issues/${issue.issueId}`)}
                            >
                              {/* Issue Info */}
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <AlertCircle className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
                                  <span className="text-xs text-slate-400 font-mono flex-shrink-0">ISSUE-{issue.issueId}</span>
                                  <span className="font-medium text-sm text-slate-900 truncate group-hover:text-blue-600 transition-colors">{issue.title}</span>
                                </div>
                                <div className="flex items-center gap-2 ml-5 text-xs text-slate-400">
                                  {issue._taskTitle && (
                                    <span className="flex items-center gap-0.5 truncate max-w-[200px]">
                                      <ListTodo className="h-3 w-3" />{issue._taskTitle}
                                    </span>
                                  )}
                                  {issue.type && (
                                    <Badge variant="outline" className="text-[9px] py-0 h-4 border-slate-200">{issue.type}</Badge>
                                  )}
                                </div>
                              </div>

                              {/* Status */}
                              <div>
                                <Badge variant="outline" className={`text-[10px] py-0.5 border whitespace-nowrap ${isCfg.color}`}>{isCfg.label}</Badge>
                              </div>

                              {/* Priority */}
                              <div>
                                <Badge variant="outline" className={`text-[10px] py-0.5 border whitespace-nowrap ${pCfg.color}`}>
                                  <Flag className="h-2.5 w-2.5 mr-0.5" />{pCfg.label}
                                </Badge>
                              </div>

                              {/* Reporter */}
                              <div className="flex items-center gap-1.5 min-w-0">
                                {issue.reporterName ? (
                                  <>
                                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                                      {issue.reporterName[0]?.toUpperCase()}
                                    </div>
                                    <span className="text-xs text-slate-600 truncate">{issue.reporterName}</span>
                                  </>
                                ) : (
                                  <span className="text-xs text-slate-400 italic">Unknown</span>
                                )}
                              </div>

                              {/* Due Date */}
                              <div className="flex items-center gap-1 text-xs text-slate-500">
                                <Calendar className="h-3 w-3 flex-shrink-0" />
                                <span className="whitespace-nowrap">{issue.dueDate ? formatDate(issue.dueDate) : "No due date"}</span>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center justify-end gap-1">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditIssue(issue, issue.taskId) }}>
                                      <Edit className="h-4 w-4 mr-2" /> Edit Issue
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600" onClick={(e) => { e.stopPropagation(); handleDeleteIssue(issue.issueId) }}>
                                      <Trash2 className="h-4 w-4 mr-2" /> Delete Issue
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <ChevronRight className="h-4 w-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>

      <CreateTaskDialog
        open={createTaskOpen}
        onOpenChange={setCreateTaskOpen}
        projectId={projectId}
        stageId={stageId}
        onTaskCreated={fetchData}
      />
      
      {stage && (
        <EditStageDialog
          open={editStageOpen}
          onOpenChange={setEditStageOpen}
          projectId={projectId}
          stageId={stageId}
          initialData={stage}
          onSuccess={fetchData}
        />
      )}
      <EditTaskDialog
        open={editTaskOpen}
        onOpenChange={setEditTaskOpen}
        task={editingTask}
        onSuccess={fetchData}
      />
      <IssueDialog
        open={editIssueOpen}
        onOpenChange={setEditIssueOpen}
        taskId={editingIssueTaskId}
        issue={editingIssue}
        onSuccess={fetchData}
      />
    </div>
  )
}
