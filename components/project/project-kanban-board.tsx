"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Circle, Play, Eye, CheckCircle2, XCircle,
  Flag, User, Bug, Calendar, MoreHorizontal, Edit, Trash2
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

const KANBAN_COLUMNS = [
  { key: "PENDING", label: "To Do", icon: Circle, color: "bg-slate-400", headerBg: "bg-slate-50 border-slate-200", accent: "border-t-slate-400" },
  { key: "DOING", label: "In Progress", icon: Play, color: "bg-amber-500", headerBg: "bg-amber-50 border-amber-200", accent: "border-t-amber-500" },
  { key: "REVIEWING", label: "Reviewing", icon: Eye, color: "bg-blue-500", headerBg: "bg-blue-50 border-blue-200", accent: "border-t-blue-500" },
  { key: "COMPLETED", label: "Done", icon: CheckCircle2, color: "bg-emerald-500", headerBg: "bg-emerald-50 border-emerald-200", accent: "border-t-emerald-500" },
]

const PriorityCfg: Record<string, { label: string; color: string; dot: string }> = {
  LOW: { label: "Low", color: "text-emerald-600", dot: "bg-emerald-500" },
  MEDIUM: { label: "Medium", color: "text-amber-600", dot: "bg-amber-500" },
  HIGH: { label: "High", color: "text-orange-600", dot: "bg-orange-500" },
  CRITICAL: { label: "Critical", color: "text-red-600", dot: "bg-red-500" },
}

interface ProjectKanbanBoardProps {
  projectId: number
  tasks: any[]
  taskIssues: Record<number, any[]>
  stages: any[]
  onEditTask: (task: any) => void
  onDeleteTask: (taskId: number) => void
}

export function ProjectKanbanBoard({
  projectId,
  tasks,
  taskIssues,
  stages,
  onEditTask,
  onDeleteTask,
}: ProjectKanbanBoardProps) {
  const router = useRouter()
  const columnData = useMemo(() => {
    const result: Record<string, any[]> = {}
    KANBAN_COLUMNS.forEach(col => { result[col.key] = [] })

    // Group non-cancelled tasks by status
    tasks
      .filter(t => t.status !== "CANCELLED")
      .forEach(t => {
        const status = t.status || "PENDING"
        if (result[status]) {
          result[status].push(t)
        } else {
          result["PENDING"].push(t) // fallback
        }
      })

    return result
  }, [tasks])

  const getStageNameForTask = (task: any) => {
    if (task.stageName) return task.stageName
    const stage = stages.find((s: any) => s.stageId === task.stageId)
    return stage?.name || ""
  }

  const getIssueCount = (taskId: number) => {
    return (taskIssues[taskId] || []).length
  }

  const formatDate = (d: string) => {
    if (!d) return ""
    return new Date(d).toLocaleDateString("vi-VN", { month: "short", day: "numeric" })
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 mb-8">
      {KANBAN_COLUMNS.map(col => {
        const Icon = col.icon
        const items = columnData[col.key] || []

        return (
          <div
            key={col.key}
            className={`flex-1 min-w-[280px] max-w-[340px] bg-slate-50/80 rounded-xl border border-slate-200/80 border-t-[3px] ${col.accent} flex flex-col`}
          >
            {/* Column Header */}
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${col.color.replace("bg-", "text-")}`} />
                <span className="text-sm font-semibold text-slate-700">{col.label}</span>
                <span className="text-xs font-medium text-slate-400 bg-white rounded-full px-2 py-0.5 border border-slate-200">
                  {items.length}
                </span>
              </div>
            </div>

            {/* Column Content */}
            <div className="flex-1 px-3 pb-3 space-y-2.5 overflow-y-auto max-h-[calc(100vh-340px)]">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                  <Circle className="h-8 w-8 mb-2 opacity-30" />
                  <span className="text-xs">No tasks</span>
                </div>
              ) : (
                items.map(task => {
                  const priority = PriorityCfg[task.priority] || PriorityCfg.MEDIUM
                  const issueCount = getIssueCount(task.taskId)
                  const stageName = getStageNameForTask(task)

                  return (
                    <Card
                      key={task.taskId}
                      className="p-3.5 bg-white border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                      onClick={() => router.push(`/tasks/${task.taskId}`)}
                    >
                      {/* Stage tag */}
                      {stageName && (
                        <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-sm mb-2 inline-block">
                          {stageName}
                        </span>
                      )}

                      {/* Title + Actions */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-sm font-medium text-slate-800 line-clamp-2 leading-snug flex-1">
                          {task.title}
                        </h4>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-3.5 w-3.5 text-slate-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEditTask(task) }}>
                              <Edit className="h-3.5 w-3.5 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={(e) => { e.stopPropagation(); onDeleteTask(task.taskId) }}>
                              <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Meta row */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Priority */}
                        <span className={`flex items-center gap-1 text-[10px] font-medium ${priority.color}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />
                          {priority.label}
                        </span>

                        {/* Due date */}
                        {task.endDate && (
                          <span className="flex items-center gap-0.5 text-[10px] text-slate-400">
                            <Calendar className="h-2.5 w-2.5" />
                            {formatDate(task.endDate)}
                          </span>
                        )}

                        {/* Issue count */}
                        {issueCount > 0 && (
                          <span className="flex items-center gap-0.5 text-[10px] text-orange-500 font-medium">
                            <Bug className="h-2.5 w-2.5" />
                            {issueCount}
                          </span>
                        )}
                      </div>

                      {/* Assignee */}
                      {task.assigneeName && (
                        <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-slate-100">
                          <div className="h-5 w-5 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-[9px] font-bold text-white">
                              {task.assigneeName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 truncate">{task.assigneeName}</span>
                        </div>
                      )}
                    </Card>
                  )
                })
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
