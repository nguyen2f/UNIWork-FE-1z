"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  ArrowLeft, Edit, Trash2, Users, MoreHorizontal, Plus, Minus, ChevronRight,
  Calendar, Target, TrendingUp, Timer, FolderKanban, Layers, Flag,
  CheckCircle2, Circle, Play, AlertCircle, Clock, Zap, ListTodo, Bug, User, Search,
  Table2, LayoutGrid
} from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { projectService } from "@/services/project.service"
import { stageService } from "@/services/stage.service"
import { adminService } from "@/services/admin.service"
import type { Department } from "@/types/user.types"
import type { Stage } from "@/types/stage.types"
import { CreateTaskDialog } from "@/components/task/create-task-dialog"
import { CreateStageDialog } from "@/components/stage/create-stage-dialog"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { taskService } from "@/services/task.service"
import { issueService } from "@/services/issue.service"
import { Modal } from "antd"
import { toast } from "sonner"
import { EditStageDialog } from "@/components/stage/edit-stage-dialog"
import { EditProjectDialog } from "@/components/project/edit-project-dialog"
import { ManageMembersDialog } from "@/components/project/manage-members-dialog"
import { EditTaskDialog } from "@/components/task/edit-task-dialog"
import { IssueDialog } from "@/components/issue/issue-dialog"
import { ProjectSpreadsheetView } from "@/components/project/project-spreadsheet-view"

const ProjectStatusCfg: Record<string, { label: string; bg: string; icon: any }> = {
  PLANNING: { label: "Planning", bg: "bg-amber-50 text-amber-700 border-amber-200", icon: Target },
  ACTIVE: { label: "Active", bg: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: Zap },
  IN_PROGRESS: { label: "In Progress", bg: "bg-blue-50 text-blue-700 border-blue-200", icon: Play },
  COMPLETED: { label: "Completed", bg: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: CheckCircle2 },
  "ON-HOLD": { label: "On Hold", bg: "bg-red-50 text-red-700 border-red-200", icon: AlertCircle },
  ON_HOLD: { label: "On Hold", bg: "bg-red-50 text-red-700 border-red-200", icon: AlertCircle },
}

const StageStatusDot: Record<string, string> = {
  PLANNED: "bg-slate-400",
  ACTIVE: "bg-emerald-500",
  COMPLETED: "bg-blue-500",
  CANCELLED: "bg-red-500",
}

const PriorityCfg: Record<string, { label: string; color: string }> = {
  LOW: { label: "Low", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  MEDIUM: { label: "Medium", color: "text-amber-600 bg-amber-50 border-amber-200" },
  HIGH: { label: "High", color: "text-orange-600 bg-orange-50 border-orange-200" },
  CRITICAL: { label: "Critical", color: "text-red-600 bg-red-50 border-red-200" },
}

export default function ProjectDetailPage(props: any) {
  const [project, setProject] = useState<any>()
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false)
  const [createStageDialogOpen, setCreateStageDialogOpen] = useState(false)
  const [departments, setDepartments] = useState<Department[]>([])
  const [stages, setStages] = useState<Stage[]>([])
  const [stageTasks, setStageTasks] = useState<Record<number, any[]>>({})
  const [expandedStages, setExpandedStages] = useState<number[]>([])
  const [expandedTasks, setExpandedTasks] = useState<number[]>([])
  const [taskIssues, setTaskIssues] = useState<Record<number, any[]>>({})
  const [editStageOpen, setEditStageOpen] = useState(false)
  const [editingStage, setEditingStage] = useState<any>(null)
  const [editProjectOpen, setEditProjectOpen] = useState(false)
  const [manageMembersOpen, setManageMembersOpen] = useState(false)
  const [editTaskOpen, setEditTaskOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<any>(null)
  const [editIssueOpen, setEditIssueOpen] = useState(false)
  const [editingIssue, setEditingIssue] = useState<any>(null)
  const [editingIssueTaskId, setEditingIssueTaskId] = useState<number>(0)
  const [activeListTab, setActiveListTab] = useState<"tasks" | "issues">("tasks")
  const [listSearchQuery, setListSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"cards" | "spreadsheet">("cards")

  const handleEditStage = (stage: any) => {
    setEditingStage(stage)
    setEditStageOpen(true)
  }

  const handleDeleteProject = () => {
    Modal.confirm({
      title: 'Are you sure you want to delete this project?',
      content: 'This action cannot be undone. All stages, tasks, and issues will be deleted.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await projectService.delete(projectId)
          toast.success("Project deleted successfully")
          router.push('/projects')
        } catch (error) {
          toast.error("Failed to delete project")
        }
      }
    })
  }

  const handleDeleteStage = (stageId: number) => {
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
          reloadData()
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
          reloadData()
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
          reloadData()
        } catch (error) {
          toast.error("Failed to delete issue")
        }
      }
    })
  }

  const toggleStage = (stageId: number) => {
    setExpandedStages(prev => prev.includes(stageId) ? prev.filter(id => id !== stageId) : [...prev, stageId])
  }

  const toggleTask = (taskId: number) => {
    setExpandedTasks(prev => prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId])
  }

  const projectId = Number(props.params.id)

  useEffect(() => {
    fetchProject(projectId)
    fetchDepartments()
    fetchStagesAndTasks()
  }, [])

  // Collect all issues from all tasks into a flat list
  const allIssues = useMemo(() => {
    const issues: any[] = []
    Object.entries(taskIssues).forEach(([taskId, taskIssueList]) => {
      taskIssueList.forEach((issue: any) => {
        const task = tasks.find(t => t.taskId === Number(taskId))
        issues.push({ ...issue, _taskTitle: task?.title || `Task #${taskId}`, _stageName: task?.stageName || "" })
      })
    })
    return issues
  }, [taskIssues, tasks])

  // Filtered tasks based on search query
  const filteredTasks = useMemo(() => {
    if (!listSearchQuery.trim()) return tasks
    const q = listSearchQuery.toLowerCase()
    return tasks.filter(t =>
      t.title?.toLowerCase().includes(q) ||
      t.assigneeName?.toLowerCase().includes(q) ||
      t.status?.toLowerCase().includes(q) ||
      t.stageName?.toLowerCase().includes(q)
    )
  }, [tasks, listSearchQuery])

  // Filtered issues based on search query
  const filteredIssues = useMemo(() => {
    if (!listSearchQuery.trim()) return allIssues
    const q = listSearchQuery.toLowerCase()
    return allIssues.filter((i: any) =>
      i.title?.toLowerCase().includes(q) ||
      i.reporterName?.toLowerCase().includes(q) ||
      i.assigneeName?.toLowerCase().includes(q) ||
      i.status?.toLowerCase().includes(q) ||
      i._taskTitle?.toLowerCase().includes(q)
    )
  }, [allIssues, listSearchQuery])

  const fetchStagesAndTasks = async () => {
    try {
      const res: any = await stageService.getByProject(projectId)
      let fetchedStages: Stage[] = []
      if (Array.isArray(res)) fetchedStages = res
      else if (res?.data && Array.isArray(res.data)) fetchedStages = res.data
      setStages(fetchedStages)

      let allTasks: any[] = []
      const tasksByStage: Record<number, any[]> = {}
      const issuesByTask: Record<number, any[]> = {}

      for (const stage of fetchedStages) {
        try {
          const taskRes: any = await taskService.getByStage(stage.stageId)
          let st: any[] = []
          if (Array.isArray(taskRes)) st = taskRes
          else if (taskRes?.data && Array.isArray(taskRes.data)) st = taskRes.data
          tasksByStage[stage.stageId] = st
          allTasks = [...allTasks, ...st]
        } catch (e) {
          console.error("Failed to fetch tasks for stage", stage.stageId, e)
        }
      }
      
      await Promise.all(allTasks.map(async (t) => {
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

      setStageTasks(tasksByStage)
      setTasks(allTasks)
      setTaskIssues(issuesByTask)
    } catch (error) {
      console.error("Failed to fetch stages and tasks:", error)
    }
  }

  const fetchDepartments = async () => {
    try {
      const res: any = await adminService.getDepartments()
      if (Array.isArray(res)) setDepartments(res)
      else if (res?.data && Array.isArray(res.data)) setDepartments(res.data)
    } catch (error) {
      console.error("Failed to fetch departments:", error)
    }
  }

  const fetchProject = async (pid: number) => {
    try {
      setLoading(true)
      const response = await projectService.getById(pid)
      const projectData = (response as any)?.project || (response as any)?.data?.project || response
      setProject(projectData)
    } catch (error) {
      console.error("Failed to fetch project details:", error)
    } finally {
      setLoading(false)
    }
  }

  const reloadData = () => { fetchStagesAndTasks() }

  const formatDate = (d: string) => {
    if (!d) return "N/A"
    return new Date(d).toLocaleDateString("vi-VN", { year: "numeric", month: "short", day: "numeric" })
  }

  const getMethodLabel = (m: string) => {
    switch (m) {
      case "AGILE": return "Agile"
      case "WATERFALL": return "Waterfall"
      default: return "Standard"
    }
  }

  const getStageLabel = () => {
    if (!project) return "Stages"
    if (project.method === "AGILE") return "Sprints"
    if (project.method === "WATERFALL") return "Phases"
    return "Stages"
  }

  const TaskStatusCfg: Record<string, { label: string; dot: string }> = {
    PENDING: { label: "Pending", dot: "bg-slate-400" },
    DOING: { label: "In Progress", dot: "bg-amber-500" },
    REVIEWING: { label: "Reviewing", dot: "bg-blue-500" },
    COMPLETED: { label: "Completed", dot: "bg-emerald-500" },
    CANCELLED: { label: "Cancelled", dot: "bg-red-500" },
  }

  const IssueStatusCfg: Record<string, { label: string; color: string }> = {
    OPEN: { label: "Open", color: "text-orange-600 bg-orange-50 border-orange-200" },
    IN_PROGRESS: { label: "In Progress", color: "text-blue-600 bg-blue-50 border-blue-200" },
    RESOLVED: { label: "Resolved", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    CLOSED: { label: "Closed", color: "text-slate-600 bg-slate-50 border-slate-200" },
    COMPLETED: { label: "Completed", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    DONE: { label: "Done", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-50 to-white">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-slate-500">Loading project...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-50 to-white">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 flex flex-col items-center justify-center">
            <FolderKanban className="h-12 w-12 text-slate-300 mb-4" />
            <h2 className="text-xl font-semibold text-slate-700">Project Not Found</h2>
            <p className="text-slate-500 mt-2 mb-6">The project does not exist or you don't have access.</p>
            <Link href="/projects"><Button variant="outline"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Projects</Button></Link>
          </main>
        </div>
      </div>
    )
  }

  const statusCfg = ProjectStatusCfg[project.status] || ProjectStatusCfg.PLANNING
  const StatusIcon = statusCfg.icon
  const priorityCfg = PriorityCfg[project.priority] || PriorityCfg.MEDIUM
  const completedTasks = tasks.filter(t => t.status === "COMPLETED").length
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0
  const deptName = departments.find(d => d.departmentId === project.departmentId)?.departmentName || "—"

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm mb-6">
              <Link href="/projects" className="text-slate-500 hover:text-blue-600 transition-colors font-medium">Projects</Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-slate-900 font-semibold truncate max-w-[300px]">{project.name}</span>
            </nav>

            {/* Hero Section */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-8 py-7">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-xs">
                        <StatusIcon className="h-3 w-3 mr-1" /> {statusCfg.label}
                      </Badge>
                      <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-xs">
                        <Flag className="h-3 w-3 mr-1" /> {priorityCfg.label}
                      </Badge>
                      <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-xs">
                        {getMethodLabel(project.method)}
                      </Badge>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">{project.name}</h1>
                    <p className="text-blue-100 text-sm max-w-xl line-clamp-2">{project.description}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button size="sm" onClick={() => setCreateTaskDialogOpen(true)} className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm gap-1.5">
                      <Plus className="h-3.5 w-3.5" /> New Task
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditProjectOpen(true)}><Edit className="h-4 w-4 mr-2" /> Edit Project</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setManageMembersOpen(true)}><Users className="h-4 w-4 mr-2" /> Manage Members</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={handleDeleteProject}><Trash2 className="h-4 w-4 mr-2" /> Delete Project</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-slate-100">
                <div className="px-5 py-4">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Progress</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-slate-900">{progressPercent}%</span>
                    <Progress value={progressPercent} className="flex-1 h-1.5" />
                  </div>
                </div>
                <div className="px-5 py-4">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1 flex items-center gap-1"><Layers className="h-3 w-3" /> {getStageLabel()}</p>
                  <span className="text-xl font-bold text-slate-900">{stages.length}</span>
                </div>
                <div className="px-5 py-4">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Tasks</p>
                  <span className="text-xl font-bold text-slate-900">{completedTasks}<span className="text-slate-400 text-base font-normal">/{tasks.length}</span></span>
                </div>
                <div className="px-5 py-4">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1 flex items-center gap-1"><Calendar className="h-3 w-3" /> Deadline</p>
                  <span className="text-sm font-semibold text-slate-900">{formatDate(project.endDate)}</span>
                </div>
                <div className="px-5 py-4">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1 flex items-center gap-1"><Users className="h-3 w-3" /> Dept.</p>
                  <span className="text-sm font-semibold text-slate-900 truncate block">{deptName}</span>
                </div>
              </div>
            </div>

            {/* View Toggle + Stages Section */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{getStageLabel()}</h2>
                <p className="text-sm text-slate-500">{stages.length} {getStageLabel().toLowerCase()} in this project</p>
              </div>
              <div className="flex items-center gap-2">
                {/* View Toggle */}
                <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode("cards")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      viewMode === "cards"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    Cards
                  </button>
                  <button
                    onClick={() => setViewMode("spreadsheet")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      viewMode === "spreadsheet"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <Table2 className="h-3.5 w-3.5" />
                    Spreadsheet
                  </button>
                </div>
                {viewMode === "cards" && (
                  <Button variant="outline" size="sm" onClick={() => setCreateStageDialogOpen(true)} className="gap-1.5">
                    <Plus className="h-3.5 w-3.5" /> New {project.method === "AGILE" ? "Sprint" : project.method === "WATERFALL" ? "Phase" : "Stage"}
                  </Button>
                )}
              </div>
            </div>

            {viewMode === "spreadsheet" ? (
              <ProjectSpreadsheetView
                projectId={projectId}
                method={project.method || "STANDARD"}
                stages={stages}
                stageTasks={stageTasks}
                taskIssues={taskIssues}
                onEditStage={handleEditStage}
                onDeleteStage={handleDeleteStage}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onEditIssue={handleEditIssue}
                onDeleteIssue={handleDeleteIssue}
                onCreateTask={() => setCreateTaskDialogOpen(true)}
                onCreateStage={() => setCreateStageDialogOpen(true)}
              />
            ) : (
            <>
            {stages.length === 0 ? (
              <Card className="border-dashed mb-8">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="rounded-full bg-slate-100 p-4 mb-4">
                    <Layers className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600 font-medium mb-1">No {getStageLabel().toLowerCase()} yet</p>
                  <p className="text-sm text-slate-400 mb-4">Create your first {getStageLabel().toLowerCase().slice(0, -1)} to organize work</p>
                  <Button variant="outline" size="sm" onClick={() => setCreateStageDialogOpen(true)} className="gap-1.5">
                    <Plus className="h-3.5 w-3.5" /> Create {project.method === "AGILE" ? "Sprint" : project.method === "WATERFALL" ? "Phase" : "Stage"}
                  </Button>
                </CardContent>
              </Card>
            ) : project.method === "AGILE" ? (
              /* ─── AGILE: Sprint Cards ─── */
              <div className="grid gap-4 md:grid-cols-2 mb-8">
                {stages.map((stage, idx) => {
                  const st = stageTasks[stage.stageId] || []
                  const done = st.filter(t => t.status === "COMPLETED").length
                  const pct = st.length > 0 ? Math.round((done / st.length) * 100) : 0
                  const isActive = stage.status === "ACTIVE"
                  const isCompleted = stage.status === "COMPLETED"
                  const borderColor = isActive ? "border-l-emerald-500" : isCompleted ? "border-l-blue-500" : "border-l-slate-300"

                  return (
                    <div
                      key={stage.stageId}
                      className={`bg-white rounded-xl border border-slate-200 border-l-4 ${borderColor} p-5 cursor-pointer hover:shadow-md transition-all group`}
                      onClick={() => router.push(`/projects/${projectId}/stages/${stage.stageId}`)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-slate-400">Sprint {idx + 1}</span>
                            {isActive && <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
                          </div>
                          <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{stage.name}</h3>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                              <MoreHorizontal className="h-4 w-4 text-slate-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditStage(stage) }}><Edit className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={(e) => { e.stopPropagation(); handleDeleteStage(stage.stageId) }}><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(stage.startDate)} — {formatDate(stage.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={pct} className="flex-1 h-2" />
                        <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">{done}/{st.length}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                        <Badge variant="outline" className={`text-[10px] ${isActive ? "border-emerald-300 text-emerald-700 bg-emerald-50" : isCompleted ? "border-blue-300 text-blue-700 bg-blue-50" : ""}`}>{stage.status}</Badge>
                        <span className="text-xs text-slate-400 group-hover:text-blue-500 transition-colors flex items-center gap-0.5">View details <ChevronRight className="h-3 w-3" /></span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : project.method === "WATERFALL" ? (
              /* ─── WATERFALL: Sequential Pipeline ─── */
              <div className="relative mb-8">
                {/* Connecting line */}
                <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-300 via-indigo-300 to-violet-300 hidden sm:block" />
                <div className="space-y-0">
                  {stages.map((stage, idx) => {
                    const st = stageTasks[stage.stageId] || []
                    const done = st.filter(t => t.status === "COMPLETED").length
                    const pct = st.length > 0 ? Math.round((done / st.length) * 100) : 0
                    const isActive = stage.status === "ACTIVE"
                    const isCompleted = stage.status === "COMPLETED"
                    const dotColor = isCompleted ? "bg-blue-500 ring-blue-100" : isActive ? "bg-emerald-500 ring-emerald-100" : "bg-slate-300 ring-slate-100"

                    return (
                      <div
                        key={stage.stageId}
                        className="relative flex items-start gap-5 pl-0 sm:pl-14 py-3 group cursor-pointer"
                        onClick={() => router.push(`/projects/${projectId}/stages/${stage.stageId}`)}
                      >
                        {/* Timeline dot */}
                        <div className={`absolute left-4 top-6 w-4 h-4 rounded-full ${dotColor} ring-4 z-10 hidden sm:block`} />
                        
                        <div className="flex-1 bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-blue-200 transition-all">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phase {idx + 1}</span>
                              <Badge variant="outline" className={`text-[10px] ${isActive ? "border-emerald-300 text-emerald-700 bg-emerald-50" : isCompleted ? "border-blue-300 text-blue-700 bg-blue-50" : ""}`}>{stage.status}</Badge>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                  <MoreHorizontal className="h-4 w-4 text-slate-400" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditStage(stage) }}><Edit className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600" onClick={(e) => { e.stopPropagation(); handleDeleteStage(stage.stageId) }}><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">{stage.name}</h3>
                          <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(stage.startDate)} — {formatDate(stage.endDate)}</span>
                            <span>{done}/{st.length} tasks</span>
                          </div>
                          <Progress value={pct} className="h-1.5" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              /* ─── DEFAULT: Clean Compact List ─── */
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-8 divide-y divide-slate-100">
                {stages.map((stage, idx) => {
                  const st = stageTasks[stage.stageId] || []
                  const done = st.filter(t => t.status === "COMPLETED").length
                  const pct = st.length > 0 ? Math.round((done / st.length) * 100) : 0
                  const dot = StageStatusDot[stage.status] || "bg-slate-400"

                  return (
                    <div
                      key={stage.stageId}
                      className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors group"
                      onClick={() => router.push(`/projects/${projectId}/stages/${stage.stageId}`)}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dot}`} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-slate-900 group-hover:text-blue-600 transition-colors">{stage.name}</h3>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                          <span>{formatDate(stage.startDate)} — {formatDate(stage.endDate)}</span>
                          <span>{done}/{st.length} tasks</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="w-20 hidden sm:block">
                          <Progress value={pct} className="h-1.5" />
                        </div>
                        <span className="text-xs font-semibold text-slate-500 w-8 text-right">{pct}%</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                              <MoreHorizontal className="h-4 w-4 text-slate-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditStage(stage) }}><Edit className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={(e) => { e.stopPropagation(); handleDeleteStage(stage.stageId) }}><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-400 transition-colors" />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

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
                          {listSearchQuery ? "No tasks match your search" : "No tasks in this project"}
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
                          const sCfg = TaskStatusCfg[task.status] || TaskStatusCfg.PENDING
                          const pCfg = PriorityCfg[task.priority] || PriorityCfg.MEDIUM
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
                                <div className="flex items-center gap-2 ml-4 text-xs text-slate-400">
                                  {task.stageName && <span className="truncate max-w-[140px]">{task.stageName}</span>}
                                  {openIssues > 0 && (
                                    <span className="flex items-center gap-0.5 text-orange-500">
                                      <Bug className="h-3 w-3" />{openIssues} open
                                    </span>
                                  )}
                                </div>
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
                          {listSearchQuery ? "No issues match your search" : "No issues in this project"}
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
                          const pCfg = PriorityCfg[issue.priority] || PriorityCfg.MEDIUM
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
            </>
            )}
          </div>
        </main>
      </div>

      <CreateTaskDialog
        open={createTaskDialogOpen}
        onOpenChange={setCreateTaskDialogOpen}
        projectId={projectId}
        onTaskCreated={reloadData}
      />
      {project && (
        <CreateStageDialog
          open={createStageDialogOpen}
          onOpenChange={setCreateStageDialogOpen}
          projectId={projectId}
          method={project.method || "STANDARD"}
          onSuccess={reloadData}
        />
      )}
      <EditStageDialog
        open={editStageOpen}
        onOpenChange={setEditStageOpen}
        projectId={projectId}
        stageId={editingStage?.stageId}
        initialData={editingStage}
        onSuccess={reloadData}
      />
      {project && (
        <EditProjectDialog
          open={editProjectOpen}
          onOpenChange={setEditProjectOpen}
          project={project}
          onSuccess={() => fetchProject(projectId)}
        />
      )}
      <ManageMembersDialog
        open={manageMembersOpen}
        onOpenChange={setManageMembersOpen}
        projectId={projectId}
      />
      <EditTaskDialog
        open={editTaskOpen}
        onOpenChange={setEditTaskOpen}
        task={editingTask}
        onSuccess={reloadData}
      />
      <IssueDialog
        open={editIssueOpen}
        onOpenChange={setEditIssueOpen}
        taskId={editingIssueTaskId}
        projectId={projectId}
        issue={editingIssue}
        onSuccess={reloadData}
      />
    </div>
  )
}
