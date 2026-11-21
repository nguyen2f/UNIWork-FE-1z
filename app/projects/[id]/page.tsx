"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Modal } from "antd"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  FolderKanban,
  LayoutGrid,
  Table2,
  Plus,
} from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

import { projectService } from "@/services/project.service"
import { stageService } from "@/services/stage.service"
import { taskService } from "@/services/task.service"
import { issueService } from "@/services/issue.service"
import { adminService } from "@/services/admin.service"

import type { ProjectDTO } from "@/types/project.types"
import type { Department } from "@/types/user.types"
import type { Stage } from "@/types/stage.types"
import type { TaskDTO } from "@/types/task.types"

import { CreateTaskDialog } from "@/components/task/create-task-dialog"
import { CreateStageDialog } from "@/components/stage/create-stage-dialog"
import { EditStageDialog } from "@/components/stage/edit-stage-dialog"
import { EditProjectDialog } from "@/components/project/edit-project-dialog"
import { ManageMembersDialog } from "@/components/project/manage-members-dialog"
import { EditTaskDialog } from "@/components/task/edit-task-dialog"
import { IssueDialog } from "@/components/issue/issue-dialog"
import { ProjectKanbanBoard } from "@/components/project/project-kanban-board"
import { ProjectSpreadsheetView } from "@/components/project/project-spreadsheet-view"

import { ProjectDetailHero } from "@/components/project/project-detail-hero"
import { ProjectStageViews } from "@/components/project/project-stage-views"
import { ProjectTaskIssueTable } from "@/components/project/project-task-issue-table"

export default function ProjectDetailPage(props: any) {
  const router = useRouter()
  const projectId = Number(props.params.id)

  const [project, setProject] = useState<ProjectDTO | null>(null)
  const [stages, setStages] = useState<Stage[]>([])
  const [tasks, setTasks] = useState<TaskDTO[]>([])
  const [stageTasks, setStageTasks] = useState<Record<number, TaskDTO[]>>({})
  const [taskIssues, setTaskIssues] = useState<Record<number, any[]>>({})
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)

  // Dialog states
  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false)
  const [createStageDialogOpen, setCreateStageDialogOpen] = useState(false)
  const [editStageOpen, setEditStageOpen] = useState(false)
  const [editingStage, setEditingStage] = useState<any>(null)
  const [editProjectOpen, setEditProjectOpen] = useState(false)
  const [manageMembersOpen, setManageMembersOpen] = useState(false)
  const [editTaskOpen, setEditTaskOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<any>(null)
  const [editIssueOpen, setEditIssueOpen] = useState(false)
  const [editingIssue, setEditingIssue] = useState<any>(null)
  const [editingIssueTaskId, setEditingIssueTaskId] = useState<number>(0)

  // View mode
  const [viewMode, setViewMode] = useState<"cards" | "spreadsheet" | "kanban">("cards")

  useEffect(() => {
    fetchProject(projectId)
    fetchDepartments()
    fetchStagesAndTasks()
  }, [projectId])

  const fetchProject = async (pid: number) => {
    try {
      setLoading(true)
      const response = await projectService.getById(pid)
      const projectData =
        (response as any)?.project || (response as any)?.data?.project || response
      setProject(projectData)
    } catch (error) {
      console.error("Failed to fetch project details:", error)
    } finally {
      setLoading(false)
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

  // Optimized parallel data fetcher: eliminates N+1 network waterfall
  const fetchStagesAndTasks = async () => {
    try {
      const [stagesRes, tasksRes, issuesRes] = await Promise.allSettled([
        stageService.getByProject(projectId),
        taskService.getByProject(projectId),
        issueService.getByProject(projectId, 0, 500),
      ])

      let fetchedStages: Stage[] = []
      if (stagesRes.status === "fulfilled") {
        const res: any = stagesRes.value
        if (Array.isArray(res)) fetchedStages = res
        else if (res?.data && Array.isArray(res.data)) fetchedStages = res.data
      }
      setStages(fetchedStages)

      let allTasks: TaskDTO[] = []
      if (tasksRes.status === "fulfilled") {
        const res: any = tasksRes.value
        if (Array.isArray(res)) allTasks = res
        else if (res?.data && Array.isArray(res.data)) allTasks = res.data
      }

      // Fallback: If project task query is empty but stages exist, query stages in parallel
      if (allTasks.length === 0 && fetchedStages.length > 0) {
        const stageTasksResults = await Promise.allSettled(
          fetchedStages.map((s) => taskService.getByStage(s.stageId))
        )
        stageTasksResults.forEach((r) => {
          if (r.status === "fulfilled") {
            const data: any = r.value
            const st: TaskDTO[] = Array.isArray(data) ? data : data?.data || []
            allTasks = [...allTasks, ...st]
          }
        })
      }

      // Group tasks by stage
      const tasksByStage: Record<number, TaskDTO[]> = {}
      allTasks.forEach((task) => {
        if (task.stageId) {
          if (!tasksByStage[task.stageId]) tasksByStage[task.stageId] = []
          tasksByStage[task.stageId].push(task)
        }
      })

      // Group issues by task
      const issuesByTask: Record<number, any[]> = {}
      if (issuesRes.status === "fulfilled") {
        const res: any = issuesRes.value
        let projectIssues: any[] = []
        if (Array.isArray(res)) projectIssues = res
        else if (res?.data && Array.isArray(res.data)) projectIssues = res.data
        else if (res?.content && Array.isArray(res.content)) projectIssues = res.content

        projectIssues.forEach((issue) => {
          const tId = issue.taskId || issue.task?.taskId
          if (tId) {
            if (!issuesByTask[tId]) issuesByTask[tId] = []
            issuesByTask[tId].push(issue)
          }
        })
      }

      setStageTasks(tasksByStage)
      setTasks(allTasks)
      setTaskIssues(issuesByTask)
    } catch (error) {
      console.error("Failed to fetch stages, tasks and issues:", error)
    }
  }

  const reloadData = () => {
    fetchStagesAndTasks()
  }

  const handleEditStage = (stage: any) => {
    setEditingStage(stage)
    setEditStageOpen(true)
  }

  const handleDeleteStage = (stageId: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this stage?",
      content: "This action cannot be undone. All tasks within this stage will also be deleted.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await stageService.delete(projectId, stageId)
          toast.success("Stage deleted successfully")
          reloadData()
        } catch {
          toast.error("Failed to delete stage")
        }
      },
    })
  }

  const handleDeleteProject = () => {
    Modal.confirm({
      title: "Are you sure you want to delete this project?",
      content: "This action cannot be undone. All stages, tasks, and issues will be deleted.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await projectService.delete(projectId)
          toast.success("Project deleted successfully")
          router.push("/projects")
        } catch {
          toast.error("Failed to delete project")
        }
      },
    })
  }

  const handleEditTask = (task: any) => {
    setEditingTask(task)
    setEditTaskOpen(true)
  }

  const handleDeleteTask = (taskId: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this task?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await taskService.delete(taskId)
          toast.success("Task deleted successfully")
          reloadData()
        } catch {
          toast.error("Failed to delete task")
        }
      },
    })
  }

  const handleEditIssue = (issue: any, taskId: number) => {
    setEditingIssue(issue)
    setEditingIssueTaskId(taskId)
    setEditIssueOpen(true)
  }

  const handleDeleteIssue = (issueId: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this issue?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await issueService.delete(issueId)
          toast.success("Issue deleted successfully")
          reloadData()
        } catch {
          toast.error("Failed to delete issue")
        }
      },
    })
  }

  const handleExportCSV = async () => {
    try {
      toast.loading("Exporting tasks...", { id: "export-csv" })
      const blob = await taskService.exportTasksToCsv(projectId)
      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `tasks_project_${projectId}.csv`)
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
      toast.success("Export successful", { id: "export-csv" })
    } catch (error) {
      console.error(error)
      toast.error("Failed to export tasks", { id: "export-csv" })
    }
  }

  const getStageLabel = () => {
    if (!project) return "Stages"
    if (project.method === "AGILE") return "Sprints"
    if (project.method === "WATERFALL") return "Phases"
    return "Stages"
  }

  const getSingleStageLabel = () => {
    if (!project) return "Stage"
    if (project.method === "AGILE") return "Sprint"
    if (project.method === "WATERFALL") return "Phase"
    return "Stage"
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-50 to-white">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="h-5 w-48 bg-slate-200 rounded animate-pulse mb-6"></div>
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="h-40 bg-slate-200 animate-pulse"></div>
                <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-slate-100">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="px-5 py-4 space-y-3">
                      <div className="h-3 w-16 bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-6 w-12 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
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
            <p className="text-slate-500 mt-2 mb-6">The project does not exist or you don&apos;t have access.</p>
            <Link href="/projects">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Projects
              </Button>
            </Link>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-6">
            {/* Modular Hero Section */}
            <ProjectDetailHero
              project={project}
              departments={departments}
              stagesCount={stages.length}
              tasks={tasks}
              onCreateTask={() => setCreateTaskDialogOpen(true)}
              onEditProject={() => setEditProjectOpen(true)}
              onManageMembers={() => setManageMembersOpen(true)}
              onDeleteProject={handleDeleteProject}
            />

            {/* View Toggle Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{getStageLabel()}</h2>
                <p className="text-sm text-slate-500">
                  {stages.length} {getStageLabel().toLowerCase()} in this project
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
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
                  {project.method === "AGILE" && (
                    <button
                      onClick={() => setViewMode("kanban")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        viewMode === "kanban"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <FolderKanban className="h-3.5 w-3.5" />
                      Kanban
                    </button>
                  )}
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCreateStageDialogOpen(true)}
                    className="gap-1.5"
                  >
                    <Plus className="h-3.5 w-3.5" /> New {getSingleStageLabel()}
                  </Button>
                )}
              </div>
            </div>

            {/* View Contents */}
            {viewMode === "kanban" ? (
              <ProjectKanbanBoard
                projectId={projectId}
                tasks={tasks}
                taskIssues={taskIssues}
                stages={stages}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            ) : viewMode === "spreadsheet" ? (
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
                <ProjectStageViews
                  projectId={projectId}
                  method={project.method || "STANDARD"}
                  stages={stages}
                  stageTasks={stageTasks}
                  onEditStage={handleEditStage}
                  onDeleteStage={handleDeleteStage}
                  onCreateStage={() => setCreateStageDialogOpen(true)}
                />

                <ProjectTaskIssueTable
                  tasks={tasks}
                  taskIssues={taskIssues}
                  onExportCSV={handleExportCSV}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onEditIssue={handleEditIssue}
                  onDeleteIssue={handleDeleteIssue}
                />
              </>
            )}
          </div>
        </main>
      </div>

      {/* Modals & Dialogs */}
      <CreateTaskDialog
        open={createTaskDialogOpen}
        onOpenChange={setCreateTaskDialogOpen}
        projectId={projectId}
        onTaskCreated={reloadData}
      />
      <CreateStageDialog
        open={createStageDialogOpen}
        onOpenChange={setCreateStageDialogOpen}
        projectId={projectId}
        method={project.method || "STANDARD"}
        onSuccess={reloadData}
      />
      <EditStageDialog
        open={editStageOpen}
        onOpenChange={setEditStageOpen}
        projectId={projectId}
        stageId={editingStage?.stageId}
        initialData={editingStage}
        onSuccess={reloadData}
      />
      <EditProjectDialog
        open={editProjectOpen}
        onOpenChange={setEditProjectOpen}
        project={project}
        onSuccess={() => fetchProject(projectId)}
      />
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
