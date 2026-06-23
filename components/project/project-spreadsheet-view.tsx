"use client"

import React, { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  ChevronRight, ChevronDown, Edit, Trash2, MoreHorizontal, Plus,
  Calendar, Flag, CheckCircle2, Bug, AlertCircle, ListTodo,
  Layers, Search, ChevronsUpDown, User, Clock
} from "lucide-react"
import { useRouter } from "next/navigation"
import type { Stage } from "@/types/stage.types"

/* ─── Config Maps ─── */
const StageStatusCfg: Record<string, { label: string; bg: string; dot: string }> = {
  PLANNED: { label: "Planned", bg: "bg-slate-50 text-slate-700", dot: "bg-slate-400" },
  ACTIVE: { label: "Active", bg: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  COMPLETED: { label: "Completed", bg: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
  CANCELLED: { label: "Cancelled", bg: "bg-red-50 text-red-700", dot: "bg-red-500" },
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

const PriorityCfg: Record<string, { label: string; color: string }> = {
  LOW: { label: "Low", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  MEDIUM: { label: "Medium", color: "text-amber-600 bg-amber-50 border-amber-200" },
  HIGH: { label: "High", color: "text-orange-600 bg-orange-50 border-orange-200" },
  CRITICAL: { label: "Critical", color: "text-red-600 bg-red-50 border-red-200" },
}

/* ─── Types ─── */
interface SpreadsheetViewProps {
  projectId: number
  method: string
  stages: Stage[]
  stageTasks: Record<number, any[]>
  taskIssues: Record<number, any[]>
  onEditStage: (stage: any) => void
  onDeleteStage: (stageId: number) => void
  onEditTask: (task: any) => void
  onDeleteTask: (taskId: number) => void
  onEditIssue: (issue: any, taskId: number) => void
  onDeleteIssue: (issueId: number) => void
  onCreateTask: () => void
  onCreateStage: () => void
}

const formatDate = (d: string) => {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("vi-VN", { year: "numeric", month: "short", day: "numeric" })
}

export function ProjectSpreadsheetView({
  projectId, method, stages, stageTasks, taskIssues,
  onEditStage, onDeleteStage, onEditTask, onDeleteTask,
  onEditIssue, onDeleteIssue, onCreateTask, onCreateStage,
}: SpreadsheetViewProps) {
  const router = useRouter()
  const [expandedStages, setExpandedStages] = useState<number[]>(stages.map(s => s.stageId))
  const [expandedTasks, setExpandedTasks] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const stageLabel = method === "AGILE" ? "Sprint" : method === "WATERFALL" ? "Phase" : "Stage"

  const toggleStage = (id: number) => {
    setExpandedStages(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }
  const toggleTask = (id: number) => {
    setExpandedTasks(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }
  const expandAll = () => {
    setExpandedStages(stages.map(s => s.stageId))
    const allTaskIds: number[] = []
    Object.values(stageTasks).forEach(tasks => tasks.forEach(t => allTaskIds.push(t.taskId)))
    setExpandedTasks(allTaskIds)
  }
  const collapseAll = () => { setExpandedStages([]); setExpandedTasks([]) }

  // Count totals
  const totalTasks = useMemo(() => Object.values(stageTasks).reduce((s, t) => s + t.length, 0), [stageTasks])
  const totalIssues = useMemo(() => Object.values(taskIssues).reduce((s, i) => s + i.length, 0), [taskIssues])

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* ─── Toolbar ─── */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            <Layers className="h-4 w-4 text-indigo-500" />
            Spreadsheet View
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>{stages.length} {stageLabel}s</span>
            <span>·</span>
            <span>{totalTasks} Tasks</span>
            <span>·</span>
            <span>{totalIssues} Issues</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all w-40"
            />
          </div>
          <Button variant="ghost" size="sm" onClick={expandAll} className="text-xs h-7 px-2 text-slate-500">
            <ChevronsUpDown className="h-3 w-3 mr-1" /> Expand
          </Button>
          <Button variant="ghost" size="sm" onClick={collapseAll} className="text-xs h-7 px-2 text-slate-500">
            Collapse
          </Button>
          <Button variant="outline" size="sm" onClick={onCreateStage} className="text-xs h-7 gap-1">
            <Plus className="h-3 w-3" /> {stageLabel}
          </Button>
          <Button size="sm" onClick={onCreateTask} className="text-xs h-7 gap-1 bg-indigo-600 hover:bg-indigo-700 text-white">
            <Plus className="h-3 w-3" /> Task
          </Button>
        </div>
      </div>

      {/* ─── Table Header ─── */}
      <div className="grid grid-cols-[40px_1fr_110px_90px_130px_120px_60px] gap-0 px-0 bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider select-none">
        <div className="px-2 py-2.5 border-r border-slate-100 text-center">#</div>
        <div className="px-3 py-2.5 border-r border-slate-100">Name</div>
        <div className="px-3 py-2.5 border-r border-slate-100">Status</div>
        <div className="px-3 py-2.5 border-r border-slate-100">Priority</div>
        <div className="px-3 py-2.5 border-r border-slate-100">Assignee</div>
        <div className="px-3 py-2.5 border-r border-slate-100">Due Date</div>
        <div className="px-2 py-2.5 text-center">⋯</div>
      </div>

      {/* ─── Body ─── */}
      <div className="divide-y divide-slate-100">
        {stages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Layers className="h-10 w-10 text-slate-300 mb-3" />
            <p className="text-sm text-slate-500 font-medium">No {stageLabel.toLowerCase()}s yet</p>
            <p className="text-xs text-slate-400 mt-1 mb-3">Create your first {stageLabel.toLowerCase()} to start organizing</p>
            <Button variant="outline" size="sm" onClick={onCreateStage} className="gap-1.5 text-xs">
              <Plus className="h-3 w-3" /> Create {stageLabel}
            </Button>
          </div>
        ) : (
          stages.map((stage, stageIdx) => {
            const tasks = stageTasks[stage.stageId] || []
            const done = tasks.filter((t: any) => t.status === "COMPLETED").length
            const pct = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0
            const isExpanded = expandedStages.includes(stage.stageId)
            const sCfg = StageStatusCfg[stage.status] || StageStatusCfg.PLANNED

            // Filter by search
            const q = searchQuery.toLowerCase()
            const matchedTasks = q
              ? tasks.filter((t: any) =>
                  t.title?.toLowerCase().includes(q) ||
                  t.assigneeName?.toLowerCase().includes(q) ||
                  (taskIssues[t.taskId] || []).some((i: any) => i.title?.toLowerCase().includes(q))
                )
              : tasks
            const stageMatch = !q || stage.name?.toLowerCase().includes(q) || matchedTasks.length > 0
            if (!stageMatch) return null

            return (
              <React.Fragment key={stage.stageId}>
                {/* ═══ STAGE ROW ═══ */}
                <div
                  className="grid grid-cols-[40px_1fr_110px_90px_130px_120px_60px] gap-0 items-center bg-gradient-to-r from-indigo-50/60 via-slate-50/40 to-white hover:from-indigo-50 hover:via-slate-50/60 transition-colors cursor-pointer group border-l-[3px] border-l-indigo-400"
                  onClick={() => toggleStage(stage.stageId)}
                >
                  {/* Expand */}
                  <div className="px-2 py-2.5 flex items-center justify-center border-r border-slate-100">
                    <button className="p-0.5 rounded hover:bg-indigo-100 transition-colors">
                      {isExpanded
                        ? <ChevronDown className="h-3.5 w-3.5 text-indigo-500" />
                        : <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                      }
                    </button>
                  </div>

                  {/* Name */}
                  <div className="px-3 py-2.5 border-r border-slate-100 flex items-center gap-2 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${sCfg.dot}`} />
                    <span className="text-[10px] font-mono text-indigo-400 flex-shrink-0">{stageLabel.toUpperCase()} {stageIdx + 1}</span>
                    <span className="font-semibold text-sm text-slate-900 truncate">{stage.name}</span>
                    <span className="text-[10px] text-slate-400 flex-shrink-0 ml-auto">{done}/{tasks.length} tasks</span>
                  </div>

                  {/* Status */}
                  <div className="px-3 py-2.5 border-r border-slate-100">
                    <Badge variant="outline" className={`text-[10px] py-0 ${sCfg.bg}`}>{sCfg.label}</Badge>
                  </div>

                  {/* Priority → Progress for stage */}
                  <div className="px-3 py-2.5 border-r border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Progress value={pct} className="h-1.5 flex-1" />
                      <span className="text-[10px] font-semibold text-slate-500">{pct}%</span>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="px-3 py-2.5 border-r border-slate-100 col-span-1">
                    <span className="text-[10px] text-slate-500">{formatDate(stage.startDate)} — {formatDate(stage.endDate)}</span>
                  </div>

                  {/* Due Date - empty for stage */}
                  <div className="px-3 py-2.5 border-r border-slate-100" />

                  {/* Actions */}
                  <div className="px-2 py-2.5 flex items-center justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                          <MoreHorizontal className="h-3.5 w-3.5 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={e => { e.stopPropagation(); router.push(`/projects/${projectId}/stages/${stage.stageId}`) }}>
                          <Layers className="h-4 w-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={e => { e.stopPropagation(); onEditStage(stage) }}>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={e => { e.stopPropagation(); onDeleteStage(stage.stageId) }}>
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* ═══ TASK ROWS ═══ */}
                {isExpanded && (q ? matchedTasks : tasks).map((task: any, taskIdx: number) => {
                  const tCfg = TaskStatusCfg[task.status] || TaskStatusCfg.PENDING
                  const pCfg = PriorityCfg[task.priority] || PriorityCfg.MEDIUM
                  const issues = taskIssues[task.taskId] || []
                  const hasIssues = issues.length > 0
                  const isTaskExpanded = expandedTasks.includes(task.taskId)
                  const filteredIssues = q ? issues.filter((i: any) => i.title?.toLowerCase().includes(q)) : issues

                  return (
                    <React.Fragment key={task.taskId}>
                      <div
                        className="grid grid-cols-[40px_1fr_110px_90px_130px_120px_60px] gap-0 items-center hover:bg-blue-50/30 transition-colors cursor-pointer group border-l-[3px] border-l-transparent"
                        onClick={() => router.push(`/tasks/${task.taskId}`)}
                      >
                        {/* Expand / Row # */}
                        <div className="px-2 py-2 flex items-center justify-center border-r border-slate-100">
                          {hasIssues ? (
                            <button
                              className="p-0.5 rounded hover:bg-blue-100 transition-colors"
                              onClick={e => { e.stopPropagation(); toggleTask(task.taskId) }}
                            >
                              {isTaskExpanded
                                ? <ChevronDown className="h-3 w-3 text-blue-500" />
                                : <ChevronRight className="h-3 w-3 text-slate-400" />
                              }
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-300">{taskIdx + 1}</span>
                          )}
                        </div>

                        {/* Name */}
                        <div className="px-3 py-2 border-r border-slate-100 flex items-center gap-2 min-w-0 pl-8">
                          <ListTodo className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
                          <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">T-{task.taskId}</span>
                          <span className="text-sm text-slate-800 truncate group-hover:text-blue-600 transition-colors">{task.title}</span>
                          {issues.length > 0 && (
                            <span className="text-[10px] text-orange-500 flex items-center gap-0.5 flex-shrink-0 ml-auto">
                              <Bug className="h-3 w-3" />{issues.length}
                            </span>
                          )}
                        </div>

                        {/* Status */}
                        <div className="px-3 py-2 border-r border-slate-100">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${tCfg.dot}`} />
                            <span className="text-[11px] text-slate-600">{tCfg.label}</span>
                          </div>
                        </div>

                        {/* Priority */}
                        <div className="px-3 py-2 border-r border-slate-100">
                          <Badge variant="outline" className={`text-[9px] py-0 h-5 border ${pCfg.color}`}>
                            <Flag className="h-2.5 w-2.5 mr-0.5" />{pCfg.label}
                          </Badge>
                        </div>

                        {/* Assignee */}
                        <div className="px-3 py-2 border-r border-slate-100 flex items-center gap-1.5 min-w-0">
                          {task.assigneeName ? (
                            <>
                              <div className="h-5 w-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[9px] font-semibold flex-shrink-0">
                                {task.assigneeName[0]?.toUpperCase()}
                              </div>
                              <span className="text-[11px] text-slate-600 truncate">{task.assigneeName}</span>
                            </>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Unassigned</span>
                          )}
                        </div>

                        {/* Due Date */}
                        <div className="px-3 py-2 border-r border-slate-100">
                          <span className="text-[11px] text-slate-500">{formatDate(task.dueDate)}</span>
                        </div>

                        {/* Actions */}
                        <div className="px-2 py-2 flex items-center justify-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                                <MoreHorizontal className="h-3.5 w-3.5 text-slate-400" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={e => { e.stopPropagation(); onEditTask(task) }}>
                                <Edit className="h-4 w-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={e => { e.stopPropagation(); onDeleteTask(task.taskId) }}>
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* ═══ ISSUE ROWS ═══ */}
                      {isTaskExpanded && filteredIssues.map((issue: any, issueIdx: number) => {
                        const iCfg = IssueStatusCfg[issue.status] || { label: issue.status, color: "text-slate-600 bg-slate-50 border-slate-200" }
                        const iPCfg = PriorityCfg[issue.priority] || PriorityCfg.MEDIUM
                        return (
                          <div
                            key={issue.issueId}
                            className="grid grid-cols-[40px_1fr_110px_90px_130px_120px_60px] gap-0 items-center hover:bg-orange-50/30 transition-colors cursor-pointer group bg-slate-50/30 border-l-[3px] border-l-orange-300/50"
                            onClick={() => router.push(`/issues/${issue.issueId}`)}
                          >
                            <div className="px-2 py-1.5 flex items-center justify-center border-r border-slate-100">
                              <span className="text-[9px] text-slate-300">{issueIdx + 1}</span>
                            </div>

                            <div className="px-3 py-1.5 border-r border-slate-100 flex items-center gap-2 min-w-0 pl-14">
                              <Bug className="h-3 w-3 text-orange-400 flex-shrink-0" />
                              <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">I-{issue.issueId}</span>
                              <span className="text-[12px] text-slate-700 truncate group-hover:text-orange-600 transition-colors">{issue.title}</span>
                              {issue.type && (
                                <Badge variant="outline" className="text-[8px] py-0 h-4 border-slate-200 flex-shrink-0 ml-auto">{issue.type}</Badge>
                              )}
                            </div>

                            <div className="px-3 py-1.5 border-r border-slate-100">
                              <Badge variant="outline" className={`text-[9px] py-0 h-4 border ${iCfg.color}`}>{iCfg.label}</Badge>
                            </div>

                            <div className="px-3 py-1.5 border-r border-slate-100">
                              <Badge variant="outline" className={`text-[9px] py-0 h-4 border ${iPCfg.color}`}>
                                <Flag className="h-2 w-2 mr-0.5" />{iPCfg.label}
                              </Badge>
                            </div>

                            <div className="px-3 py-1.5 border-r border-slate-100 flex items-center gap-1.5 min-w-0">
                              {issue.assigneeName ? (
                                <>
                                  <div className="h-4 w-4 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-[8px] font-semibold flex-shrink-0">
                                    {issue.assigneeName[0]?.toUpperCase()}
                                  </div>
                                  <span className="text-[10px] text-slate-600 truncate">{issue.assigneeName}</span>
                                </>
                              ) : (
                                <span className="text-[10px] text-slate-400 italic">—</span>
                              )}
                            </div>

                            <div className="px-3 py-1.5 border-r border-slate-100">
                              <span className="text-[10px] text-slate-500">{issue.dueDate ? formatDate(issue.dueDate) : "—"}</span>
                            </div>

                            <div className="px-2 py-1.5 flex items-center justify-center">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                                    <MoreHorizontal className="h-3 w-3 text-slate-400" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={e => { e.stopPropagation(); onEditIssue(issue, task.taskId) }}>
                                    <Edit className="h-4 w-4 mr-2" /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600" onClick={e => { e.stopPropagation(); onDeleteIssue(issue.issueId) }}>
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        )
                      })}
                    </React.Fragment>
                  )
                })}
              </React.Fragment>
            )
          })
        )}
      </div>
    </div>
  )
}
