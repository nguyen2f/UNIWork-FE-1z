"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  ArrowLeft, Edit, Trash2, Users, MoreHorizontal, Plus, Minus, ChevronRight,
  Calendar, Target, TrendingUp, Timer, FolderKanban, Layers, Flag,
  CheckCircle2, Circle, Play, AlertCircle, Clock, Zap
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
      setProject((response as any).project || response)
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

            {/* Stages Section */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{getStageLabel()}</h2>
                <p className="text-sm text-slate-500">{stages.length} {getStageLabel().toLowerCase()} in this project</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setCreateStageDialogOpen(true)} className="gap-1.5">
                <Plus className="h-3.5 w-3.5" /> New {project.method === "AGILE" ? "Sprint" : project.method === "WATERFALL" ? "Phase" : "Stage"}
              </Button>
            </div>

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
            ) : (
              <div className="space-y-3 mb-8">
                {stages.map(stage => {
                  const st = stageTasks[stage.stageId] || []
                  const done = st.filter(t => t.status === "COMPLETED").length
                  const pct = st.length > 0 ? Math.round((done / st.length) * 100) : 0
                  const dot = StageStatusDot[stage.status] || "bg-slate-400"

                  return (
                    <Card
                      key={stage.stageId}
                      className="group transition-all duration-200 mb-3"
                    >
                      <CardContent className="p-0">
                        <div 
                          className="flex items-center gap-4 p-5 cursor-pointer hover:bg-slate-50"
                          onClick={() => router.push(`/projects/${projectId}/stages/${stage.stageId}`)}
                        >
                          <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dot}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{stage.name}</h3>
                              <Badge variant="outline" className="text-xs">{stage.status}</Badge>
                              <Badge variant="outline" className="text-xs">{stage.type}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(stage.startDate)} — {formatDate(stage.endDate)}</span>
                              <span>{done}/{st.length} tasks completed</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 flex-shrink-0">
                            <div className="w-24 hidden sm:block">
                              <div className="flex justify-between text-xs text-slate-500 mb-1">
                                <span>{pct}%</span>
                              </div>
                              <Progress value={pct} className="h-1.5" />
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 z-10 relative hover:bg-slate-100"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditStage(stage) }}>
                                  <Edit className="h-4 w-4 mr-2" /> Edit Stage
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600" onClick={(e) => { e.stopPropagation(); handleDeleteStage(stage.stageId) }}>
                                  <Trash2 className="h-4 w-4 mr-2" /> Delete Stage
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="ml-2 z-10 relative bg-white h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleStage(stage.stageId);
                              }}
                            >
                              {expandedStages.includes(stage.stageId) ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        {expandedStages.includes(stage.stageId) && (
                          <div className="border-t border-slate-100 bg-slate-50/50 p-4 space-y-2">
                            {st.length === 0 ? (
                              <p className="text-sm text-slate-500 text-center py-2">No tasks in this stage.</p>
                            ) : (
                              st.map(task => (
                                <div key={task.taskId} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                                  <div 
                                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                                    onClick={() => router.push(`/tasks/${task.taskId}`)}
                                  >
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1.5">
                                        <span className="font-medium text-sm text-slate-900 group-hover:text-blue-600 transition-colors">{task.title}</span>
                                        <Badge variant="secondary" className="text-[10px] py-0">{task.status}</Badge>
                                      </div>
                                      <div className="flex items-center gap-4 text-xs text-slate-500">
                                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(task.createdDate)} — {formatDate(task.dueDate)}</span>
                                        <span>{(taskIssues[task.taskId] || []).filter((i:any) => i.status === 'COMPLETED' || i.status === 'DONE').length}/{(taskIssues[task.taskId] || []).length} issues completed</span>
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
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 z-10 relative hover:bg-slate-100"
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
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
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
