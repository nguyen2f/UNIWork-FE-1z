import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Layers,
  Plus,
  Calendar,
  ChevronRight,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react"
import type { Stage } from "@/types/stage.types"
import type { TaskDTO } from "@/types/task.types"

const StageStatusDot: Record<string, string> = {
  PLANNED: "bg-slate-400",
  ACTIVE: "bg-emerald-500",
  COMPLETED: "bg-blue-500",
  CANCELLED: "bg-red-500",
}

interface ProjectStageViewsProps {
  projectId: number
  method: string
  stages: Stage[]
  stageTasks: Record<number, TaskDTO[]>
  onEditStage: (stage: Stage) => void
  onDeleteStage: (stageId: number) => void
  onCreateStage: () => void
}

export function ProjectStageViews({
  projectId,
  method,
  stages,
  stageTasks,
  onEditStage,
  onDeleteStage,
  onCreateStage,
}: ProjectStageViewsProps) {
  const router = useRouter()

  const formatDate = (d: string) => {
    if (!d) return ""
    return new Date(d).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStageLabel = () => {
    if (method === "AGILE") return "Sprints"
    if (method === "WATERFALL") return "Phases"
    return "Stages"
  }

  const getSingleStageLabel = () => {
    if (method === "AGILE") return "Sprint"
    if (method === "WATERFALL") return "Phase"
    return "Stage"
  }

  if (stages.length === 0) {
    return (
      <Card className="border-dashed mb-8">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-slate-100 p-4 mb-4">
            <Layers className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-slate-600 font-medium mb-1">
            No {getStageLabel().toLowerCase()} yet
          </p>
          <p className="text-sm text-slate-400 mb-4">
            Create your first {getSingleStageLabel().toLowerCase()} to organize work
          </p>
          <Button variant="outline" size="sm" onClick={onCreateStage} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Create {getSingleStageLabel()}
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (method === "AGILE") {
    /* ─── AGILE: Sprint Cards ─── */
    return (
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        {stages.map((stage, idx) => {
          const st = stageTasks[stage.stageId] || []
          const done = st.filter((t) => t.status === "COMPLETED").length
          const pct = st.length > 0 ? Math.round((done / st.length) * 100) : 0
          const isActive = stage.status === "ACTIVE"
          const isCompleted = stage.status === "COMPLETED"
          const borderColor = isActive
            ? "border-l-emerald-500"
            : isCompleted
            ? "border-l-blue-500"
            : "border-l-slate-300"

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
                    {isActive && (
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {stage.name}
                  </h3>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4 text-slate-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        onEditStage(stage)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteStage(stage.stageId)
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(stage.startDate)} — {formatDate(stage.endDate)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={pct} className="flex-1 h-2" />
                <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                  {done}/{st.length}
                </span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <Badge
                  variant="outline"
                  className={`text-[10px] ${
                    isActive
                      ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                      : isCompleted
                      ? "border-blue-300 text-blue-700 bg-blue-50"
                      : ""
                  }`}
                >
                  {stage.status}
                </Badge>
                <span className="text-xs text-slate-400 group-hover:text-blue-500 transition-colors flex items-center gap-0.5">
                  View details <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  if (method === "WATERFALL") {
    /* ─── WATERFALL: Sequential Pipeline ─── */
    return (
      <div className="relative mb-8">
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-300 via-indigo-300 to-violet-300 hidden sm:block" />
        <div className="space-y-0">
          {stages.map((stage, idx) => {
            const st = stageTasks[stage.stageId] || []
            const done = st.filter((t) => t.status === "COMPLETED").length
            const pct = st.length > 0 ? Math.round((done / st.length) * 100) : 0
            const isActive = stage.status === "ACTIVE"
            const isCompleted = stage.status === "COMPLETED"
            const dotColor = isCompleted
              ? "bg-blue-500 ring-blue-100"
              : isActive
              ? "bg-emerald-500 ring-emerald-100"
              : "bg-slate-300 ring-slate-100"

            return (
              <div
                key={stage.stageId}
                className="relative flex items-start gap-5 pl-0 sm:pl-14 py-3 group cursor-pointer"
                onClick={() => router.push(`/projects/${projectId}/stages/${stage.stageId}`)}
              >
                <div
                  className={`absolute left-4 top-6 w-4 h-4 rounded-full ${dotColor} ring-4 z-10 hidden sm:block`}
                />
                <div className="flex-1 bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-blue-200 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Phase {idx + 1}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          isActive
                            ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                            : isCompleted
                            ? "border-blue-300 text-blue-700 bg-blue-50"
                            : ""
                        }`}
                      >
                        {stage.status}
                      </Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            onEditStage(stage)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteStage(stage.stageId)
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                    {stage.name}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(stage.startDate)} — {formatDate(stage.endDate)}
                    </span>
                    <span>
                      {done}/{st.length} tasks
                    </span>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  /* ─── DEFAULT: Clean Compact List ─── */
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-8 divide-y divide-slate-100">
      {stages.map((stage) => {
        const st = stageTasks[stage.stageId] || []
        const done = st.filter((t) => t.status === "COMPLETED").length
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
              <h3 className="font-medium text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                {stage.name}
              </h3>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                <span>
                  {formatDate(stage.startDate)} — {formatDate(stage.endDate)}
                </span>
                <span>
                  {done}/{st.length} tasks
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-20 hidden sm:block">
                <Progress value={pct} className="h-1.5" />
              </div>
              <span className="text-xs font-semibold text-slate-500 w-8 text-right">{pct}%</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditStage(stage)
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteStage(stage.stageId)
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-400 transition-colors" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
