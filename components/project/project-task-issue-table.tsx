import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Download,
  Search,
  ListTodo,
  Bug,
  Calendar,
  Flag,
  MoreHorizontal,
  Edit,
  Trash2,
  ChevronRight,
  AlertCircle,
} from "lucide-react"
import type { TaskDTO } from "@/types/task.types"

const PriorityCfg: Record<string, { label: string; color: string }> = {
  LOW: { label: "Low", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  MEDIUM: { label: "Medium", color: "text-amber-600 bg-amber-50 border-amber-200" },
  HIGH: { label: "High", color: "text-orange-600 bg-orange-50 border-orange-200" },
  CRITICAL: { label: "Critical", color: "text-red-600 bg-red-50 border-red-200" },
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

interface ProjectTaskIssueTableProps {
  tasks: TaskDTO[]
  taskIssues: Record<number, any[]>
  onExportCSV: () => void
  onEditTask: (task: TaskDTO) => void
  onDeleteTask: (taskId: number) => void
  onEditIssue: (issue: any, taskId: number) => void
  onDeleteIssue: (issueId: number) => void
}

export function ProjectTaskIssueTable({
  tasks,
  taskIssues,
  onExportCSV,
  onEditTask,
  onDeleteTask,
  onEditIssue,
  onDeleteIssue,
}: ProjectTaskIssueTableProps) {
  const router = useRouter()
  const [activeListTab, setActiveListTab] = useState<"tasks" | "issues">("tasks")
  const [listSearchQuery, setListSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null)
  const [userFilter, setUserFilter] = useState<string | null>(null)

  const formatDate = (d: string) => {
    if (!d) return ""
    return new Date(d).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Flatten all issues from taskIssues
  const allIssues = useMemo(() => {
    const issues: any[] = []
    Object.entries(taskIssues).forEach(([taskId, taskIssueList]) => {
      taskIssueList.forEach((issue: any) => {
        const task = tasks.find((t) => t.taskId === Number(taskId))
        issues.push({
          ...issue,
          _taskTitle: task?.title || `Task #${taskId}`,
          _stageName: task?.stageName || "",
        })
      })
    })
    return issues
  }, [taskIssues, tasks])

  // All distinct users for filter
  const allUsers = useMemo(() => {
    return Array.from(
      new Set([
        ...tasks.map((t) => t.assigneeName).filter(Boolean),
        ...allIssues.map((i) => i.assigneeName || i.assignedToName).filter(Boolean),
      ])
    ).sort() as string[]
  }, [tasks, allIssues])

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    let result = tasks
    if (statusFilter) result = result.filter((t) => t.status === statusFilter)
    if (priorityFilter) result = result.filter((t) => t.priority === priorityFilter)
    if (userFilter) result = result.filter((t) => t.assigneeName === userFilter)

    if (!listSearchQuery.trim()) return result
    const q = listSearchQuery.toLowerCase()
    return result.filter(
      (t) =>
        t.title?.toLowerCase().includes(q) ||
        t.assigneeName?.toLowerCase().includes(q) ||
        t.status?.toLowerCase().includes(q) ||
        t.stageName?.toLowerCase().includes(q)
    )
  }, [tasks, listSearchQuery, statusFilter, priorityFilter, userFilter])

  // Filtered issues
  const filteredIssues = useMemo(() => {
    let result = allIssues
    if (statusFilter) result = result.filter((i) => i.status === statusFilter)
    if (priorityFilter) result = result.filter((i) => i.priority === priorityFilter)
    if (userFilter) result = result.filter((i) => (i.assigneeName || i.assignedToName) === userFilter)

    if (!listSearchQuery.trim()) return result
    const q = listSearchQuery.toLowerCase()
    return result.filter(
      (i: any) =>
        i.title?.toLowerCase().includes(q) ||
        i.reporterName?.toLowerCase().includes(q) ||
        i.assigneeName?.toLowerCase().includes(q) ||
        i.status?.toLowerCase().includes(q) ||
        i._taskTitle?.toLowerCase().includes(q)
    )
  }, [allIssues, listSearchQuery, statusFilter, priorityFilter, userFilter])

  return (
    <div className="mt-10">
      {/* Section Header with Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">All Tasks & Issues</h2>
          <p className="text-sm text-slate-500">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""} · {allIssues.length} issue
            {allIssues.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={onExportCSV}
            className="gap-1.5 text-slate-600 bg-white border-slate-200 shadow-sm hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>

          <Select onValueChange={(v) => setStatusFilter(v === "CLEAR" ? null : v)}>
            <SelectTrigger className="w-[120px] h-8 bg-white text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CLEAR">All Status</SelectItem>
              {Object.entries(activeListTab === "tasks" ? TaskStatusCfg : IssueStatusCfg).map(
                ([k, v]) => (
                  <SelectItem key={k} value={k}>
                    {v.label}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>

          <Select onValueChange={(v) => setPriorityFilter(v === "CLEAR" ? null : v)}>
            <SelectTrigger className="w-[120px] h-8 bg-white text-xs">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CLEAR">All Priority</SelectItem>
              {Object.entries(PriorityCfg).map(([k, v]) => (
                <SelectItem key={k} value={k}>
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(v) => setUserFilter(v === "CLEAR" ? null : v)}>
            <SelectTrigger className="w-[120px] h-8 bg-white text-xs">
              <SelectValue placeholder="User" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CLEAR">All Users</SelectItem>
              {allUsers.map((user) => (
                <SelectItem key={user} value={user}>
                  {user}
                </SelectItem>
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
              onClick={() => {
                setActiveListTab("tasks")
                setListSearchQuery("")
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeListTab === "tasks"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <ListTodo className="h-3.5 w-3.5" />
              Tasks
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeListTab === "tasks"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {tasks.length}
              </span>
            </button>
            <button
              onClick={() => {
                setActiveListTab("issues")
                setListSearchQuery("")
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeListTab === "issues"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Bug className="h-3.5 w-3.5" />
              Issues
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeListTab === "issues"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {allIssues.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Tasks List ─── */}
      {activeListTab === "tasks" && (
        <Card className="overflow-hidden border-slate-200/80">
          <CardContent className="p-0 overflow-x-auto">
            <div className="min-w-[850px]">
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
                    <button
                      onClick={() => setListSearchQuery("")}
                      className="text-xs text-blue-500 hover:text-blue-700 mt-1"
                    >
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
                    const openIssues = issues.filter(
                      (i: any) =>
                        i.status !== "COMPLETED" &&
                        i.status !== "DONE" &&
                        i.status !== "RESOLVED" &&
                        i.status !== "CLOSED"
                    ).length

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
                            <span className="text-xs text-slate-400 font-mono flex-shrink-0">
                              TASK-{task.taskId}
                            </span>
                            <span className="font-medium text-sm text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                              {task.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 ml-4 text-xs text-slate-400">
                            {task.stageName && (
                              <span className="truncate max-w-[140px]">{task.stageName}</span>
                            )}
                            {openIssues > 0 && (
                              <span className="flex items-center gap-0.5 text-orange-500">
                                <Bug className="h-3 w-3" />
                                {openIssues} open
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Status */}
                        <div>
                          <Badge variant="outline" className="text-[10px] py-0.5 whitespace-nowrap">
                            {sCfg.label}
                          </Badge>
                        </div>

                        {/* Priority */}
                        <div>
                          <Badge
                            variant="outline"
                            className={`text-[10px] py-0.5 border whitespace-nowrap ${pCfg.color}`}
                          >
                            <Flag className="h-2.5 w-2.5 mr-0.5" />
                            {pCfg.label}
                          </Badge>
                        </div>

                        {/* Assignee */}
                        <div className="flex items-center gap-1.5 min-w-0">
                          {task.assigneeName ? (
                            <>
                              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                                {task.assigneeName[0]?.toUpperCase()}
                              </div>
                              <span className="text-xs text-slate-600 truncate">
                                {task.assigneeName}
                              </span>
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
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onEditTask(task)
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" /> Edit Task
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onDeleteTask(task.taskId)
                                }}
                              >
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
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── Issues List ─── */}
      {activeListTab === "issues" && (
        <Card className="overflow-hidden border-slate-200/80">
          <CardContent className="p-0 overflow-x-auto">
            <div className="min-w-[850px]">
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
                    <button
                      onClick={() => setListSearchQuery("")}
                      className="text-xs text-blue-500 hover:text-blue-700 mt-1"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredIssues.map((issue: any) => {
                    const isCfg = IssueStatusCfg[issue.status] || {
                      label: issue.status,
                      color: "text-slate-600 bg-slate-50 border-slate-200",
                    }
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
                            <span className="text-xs text-slate-400 font-mono flex-shrink-0">
                              ISSUE-{issue.issueId}
                            </span>
                            <span className="font-medium text-sm text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                              {issue.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 ml-5 text-xs text-slate-400">
                            {issue._taskTitle && (
                              <span className="flex items-center gap-0.5 truncate max-w-[200px]">
                                <ListTodo className="h-3 w-3" />
                                {issue._taskTitle}
                              </span>
                            )}
                            {issue.type && (
                              <Badge variant="outline" className="text-[9px] py-0 h-4 border-slate-200">
                                {issue.type}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Status */}
                        <div>
                          <Badge
                            variant="outline"
                            className={`text-[10px] py-0.5 border whitespace-nowrap ${isCfg.color}`}
                          >
                            {isCfg.label}
                          </Badge>
                        </div>

                        {/* Priority */}
                        <div>
                          <Badge
                            variant="outline"
                            className={`text-[10px] py-0.5 border whitespace-nowrap ${pCfg.color}`}
                          >
                            <Flag className="h-2.5 w-2.5 mr-0.5" />
                            {pCfg.label}
                          </Badge>
                        </div>

                        {/* Reporter */}
                        <div className="flex items-center gap-1.5 min-w-0">
                          {issue.reporterName ? (
                            <>
                              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                                {issue.reporterName[0]?.toUpperCase()}
                              </div>
                              <span className="text-xs text-slate-600 truncate">
                                {issue.reporterName}
                              </span>
                            </>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Unknown</span>
                          )}
                        </div>

                        {/* Due Date */}
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Calendar className="h-3 w-3 flex-shrink-0" />
                          <span className="whitespace-nowrap">
                            {issue.dueDate ? formatDate(issue.dueDate) : "No due date"}
                          </span>
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
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onEditIssue(issue, issue.taskId)
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" /> Edit Issue
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onDeleteIssue(issue.issueId)
                                }}
                              >
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
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
