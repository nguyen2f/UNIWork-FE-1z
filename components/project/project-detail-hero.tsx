import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ChevronRight,
  TrendingUp,
  Layers,
  CheckCircle2,
  Calendar,
  Users,
  Flag,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Target,
  Zap,
  Play,
  AlertCircle,
} from "lucide-react"
import type { ProjectDTO } from "@/types/project.types"
import type { Department } from "@/types/user.types"
import type { TaskDTO } from "@/types/task.types"

const ProjectStatusCfg: Record<string, { label: string; bg: string; icon: any }> = {
  PLANNING: { label: "Planning", bg: "bg-amber-50 text-amber-700 border-amber-200", icon: Target },
  ACTIVE: { label: "Active", bg: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: Zap },
  IN_PROGRESS: { label: "In Progress", bg: "bg-blue-50 text-blue-700 border-blue-200", icon: Play },
  COMPLETED: { label: "Completed", bg: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: CheckCircle2 },
  "ON-HOLD": { label: "On Hold", bg: "bg-red-50 text-red-700 border-red-200", icon: AlertCircle },
  ON_HOLD: { label: "On Hold", bg: "bg-red-50 text-red-700 border-red-200", icon: AlertCircle },
}

const PriorityCfg: Record<string, { label: string; color: string }> = {
  LOW: { label: "Low", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  MEDIUM: { label: "Medium", color: "text-amber-600 bg-amber-50 border-amber-200" },
  HIGH: { label: "High", color: "text-orange-600 bg-orange-50 border-orange-200" },
  CRITICAL: { label: "Critical", color: "text-red-600 bg-red-50 border-red-200" },
}

interface ProjectDetailHeroProps {
  project: ProjectDTO
  departments: Department[]
  stagesCount: number
  tasks: TaskDTO[]
  onCreateTask: () => void
  onEditProject: () => void
  onManageMembers: () => void
  onDeleteProject: () => void
}

export function ProjectDetailHero({
  project,
  departments,
  stagesCount,
  tasks,
  onCreateTask,
  onEditProject,
  onManageMembers,
  onDeleteProject,
}: ProjectDetailHeroProps) {
  const statusCfg = ProjectStatusCfg[project.status] || ProjectStatusCfg.PLANNING
  const StatusIcon = statusCfg.icon
  const priorityCfg = PriorityCfg[project.priority] || PriorityCfg.MEDIUM

  const validTasks = tasks.filter((t) => t.status !== "CANCELLED")
  const totalTasks = validTasks.length
  const completedTasks = validTasks.filter((t) => t.status === "COMPLETED").length
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const deptName =
    departments.find((d) => d.departmentId === project.departmentId)?.departmentName || "—"

  const formatDate = (d: string) => {
    if (!d) return ""
    return new Date(d).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getMethodLabel = (m: string) => {
    switch (m) {
      case "AGILE":
        return "Agile"
      case "WATERFALL":
        return "Waterfall"
      default:
        return "Standard"
    }
  }

  const getStageLabel = () => {
    if (project.method === "AGILE") return "Sprints"
    if (project.method === "WATERFALL") return "Phases"
    return "Stages"
  }

  return (
    <>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm mb-6">
        <Link
          href="/projects"
          className="text-slate-500 hover:text-blue-600 transition-colors font-medium"
        >
          Projects
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <span className="text-slate-900 font-semibold truncate max-w-[300px]">
          {project.name}
        </span>
      </nav>

      {/* Hero Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-6 sm:px-8 py-7">
          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            <div className="w-full">
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
            <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0 flex-shrink-0">
              <Button
                size="sm"
                onClick={onCreateTask}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" /> New Task
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:bg-white/20 h-8 w-8"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onEditProject}>
                    <Edit className="h-4 w-4 mr-2" /> Edit Project
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onManageMembers}>
                    <Users className="h-4 w-4 mr-2" /> Manage Members
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600" onClick={onDeleteProject}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-slate-100">
          <div className="px-5 py-4">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Progress
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-slate-900">{progressPercent}%</span>
              <Progress value={progressPercent} className="flex-1 h-1.5" />
            </div>
          </div>
          <div className="px-5 py-4">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1 flex items-center gap-1">
              <Layers className="h-3 w-3" /> {getStageLabel()}
            </p>
            <span className="text-xl font-bold text-slate-900">{stagesCount}</span>
          </div>
          <div className="px-5 py-4">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Tasks
            </p>
            <span className="text-xl font-bold text-slate-900">
              {completedTasks}
              <span className="text-slate-400 text-base font-normal">/{totalTasks}</span>
            </span>
          </div>
          <div className="px-5 py-4">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1 flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Deadline
            </p>
            <span className="text-sm font-semibold text-slate-900">
              {formatDate(project.endDate)}
            </span>
          </div>
          <div className="px-5 py-4">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1 flex items-center gap-1">
              <Users className="h-3 w-3" /> Dept.
            </p>
            <span className="text-sm font-semibold text-slate-900 truncate block">{deptName}</span>
          </div>
        </div>
      </div>
    </>
  )
}
