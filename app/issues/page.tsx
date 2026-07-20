"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { IssueDialog } from "@/components/issue/issue-dialog"
import {
  Calendar, MoreVertical, Plus, Search, AlertCircle, Edit, Trash2, Clock,
  Eye, Kanban, ChevronRight, Flag, LayoutGrid, List, User, Bug
} from "lucide-react"
import { toast } from "sonner"
import { issueService } from "@/services/issue.service"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

const StatusCfg: Record<string, { label: string; dot: string; bg: string }> = {
  OPEN:        { label: "Open",        dot: "bg-blue-400",    bg: "bg-blue-50 text-blue-700 border-blue-200" },
  IN_PROGRESS: { label: "In Progress", dot: "bg-amber-500",   bg: "bg-amber-50 text-amber-700 border-amber-200" },
  RESOLVED:    { label: "Resolved",    dot: "bg-emerald-500", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  CLOSED:      { label: "Closed",      dot: "bg-slate-400",   bg: "bg-slate-100 text-slate-700 border-slate-200" },
  REOPENED:    { label: "Reopened",     dot: "bg-red-500",     bg: "bg-red-50 text-red-700 border-red-200" },
}

const PriorityCfg: Record<string, { label: string; color: string }> = {
  LOW:      { label: "Low",      color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  MEDIUM:   { label: "Medium",   color: "text-amber-600 bg-amber-50 border-amber-200" },
  HIGH:     { label: "High",     color: "text-orange-600 bg-orange-50 border-orange-200" },
  CRITICAL: { label: "Critical", color: "text-red-600 bg-red-50 border-red-200" },
}

const TypeCfg: Record<string, { label: string; color: string }> = {
  BUG:           { label: "Bug",           color: "text-red-600 bg-red-50 border-red-200" },
  IMPROVEMENT:   { label: "Improvement",   color: "text-blue-600 bg-blue-50 border-blue-200" },
  QUESTION:      { label: "Question",      color: "text-purple-600 bg-purple-50 border-purple-200" },
  DOCUMENTATION: { label: "Documentation", color: "text-teal-600 bg-teal-50 border-teal-200" },
  OTHER:         { label: "Other",         color: "text-slate-600 bg-slate-50 border-slate-200" },
}

export default function IssuesPage() {
  const router = useRouter()
  const [view, setView] = useState<"grid" | "list" | "kanban">("grid")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState<any>(null)
  const [issues, setIssues] = useState<any[]>([])
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null)
  const [projectFilter, setProjectFilter] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => { fetchIssues() }, [])

  const fetchIssues = async () => {
    try {
      const res = await issueService.getMyIssues()
      if (res) setIssues((res as any).data || res || [])
    } catch (error) { console.error(error) }
  }

  const handleEdit = (issue: any) => { setSelectedIssue(issue); setEditDialogOpen(true) }
  const handleViewDetail = (issue: any) => { router.push(`/issues/${issue.issueId}`) }
  const handleDelete = async (issueId: number) => {
    try {
      await issueService.delete(issueId)
      toast.success("Issue deleted")
      fetchIssues()
    } catch (error) {
      toast.error("Failed to delete issue")
    }
  }

  const kanbanColumns = [
    { id: "OPEN", title: "Open" },
    { id: "IN_PROGRESS", title: "In Progress" },
    { id: "RESOLVED", title: "Resolved" },
    { id: "CLOSED", title: "Closed" },
    { id: "REOPENED", title: "Reopened" },
  ]

  const filteredIssues = issues.filter((i) => {
    if (statusFilter && i.status !== statusFilter) return false
    if (priorityFilter && i.priority !== priorityFilter) return false
    if (projectFilter && String(i.projectId) !== projectFilter) return false
    if (searchQuery) {
      const titleMatch = i.title?.toLowerCase().includes(searchQuery.toLowerCase())
      const descMatch = i.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const taskMatch = i.taskTitle?.toLowerCase().includes(searchQuery.toLowerCase())
      if (!titleMatch && !descMatch && !taskMatch) return false
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
                <h1 className="text-2xl font-bold text-slate-900">My Issues</h1>
                <p className="text-sm text-slate-500 mt-1">Track and manage your assigned issues & bugs</p>
              </div>
              <Button onClick={() => setCreateDialogOpen(true)} className="gap-1.5 shadow-sm">
                <Plus className="h-4 w-4" /> New Issue
              </Button>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full md:flex-1">
                <div className="relative w-full sm:w-auto flex-1 sm:max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search issues..."
                    className="pl-9 bg-white border-slate-200 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 sm:flex gap-3 w-full sm:w-auto">
                  <Select onValueChange={(v) => setStatusFilter(v === "CLEAR" ? null : v)}>
                    <SelectTrigger className="w-full sm:w-[130px] lg:w-[150px] bg-white"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLEAR">All Status</SelectItem>
                      {Object.entries(StatusCfg).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select onValueChange={(v) => setPriorityFilter(v === "CLEAR" ? null : v)}>
                    <SelectTrigger className="w-full sm:w-[130px] lg:w-[150px] bg-white"><SelectValue placeholder="Priority" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLEAR">All Priority</SelectItem>
                      {Object.entries(PriorityCfg).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Select onValueChange={(v) => setProjectFilter(v === "CLEAR" ? null : v)}>
                  <SelectTrigger className="w-full sm:w-[150px] bg-white"><SelectValue placeholder="Project" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLEAR">All Projects</SelectItem>
                    {Array.from(new Set(issues.map(i => i.projectId))).filter(Boolean).map(id => {
                      const issue = issues.find(i => i.projectId === id)
                      return <SelectItem key={id} value={String(id)}>{issue?.projectName || `Project #${id}`}</SelectItem>
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
                {filteredIssues.map((issue) => {
                  const status = StatusCfg[issue.status] || StatusCfg.OPEN
                  const priority = PriorityCfg[issue.priority] || PriorityCfg.MEDIUM
                  const type = TypeCfg[issue.type || issue.issueType] || TypeCfg.OTHER
                  return (
                    <Card key={issue.issueId} className="group hover:shadow-lg hover:border-orange-200/80 transition-all duration-300 cursor-pointer"
                      onClick={() => handleViewDetail(issue)}>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-2.5 flex-1 min-w-0">
                            <div className="rounded-lg bg-gradient-to-br from-orange-500 to-red-600 p-2 flex-shrink-0 mt-0.5">
                              <AlertCircle className="h-3.5 w-3.5 text-white" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-semibold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2">{issue.title}</h3>
                              {issue.taskTitle && <p className="text-xs text-slate-400 mt-0.5">Task: {issue.taskTitle}</p>}
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                <MoreVertical className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewDetail(issue) }}><Eye className="h-4 w-4 mr-2" /> View</DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(issue) }}><Edit className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDelete(issue.issueId) }} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        {issue.description && <p className="text-xs text-slate-500 line-clamp-2 mb-3">{issue.description}</p>}
                        <div className="flex gap-1.5 flex-wrap mb-3">
                          <Badge variant="outline" className={`text-xs border ${status.bg}`}>
                            <div className={`w-1.5 h-1.5 rounded-full mr-1 ${status.dot}`} />{status.label}
                          </Badge>
                          <Badge variant="outline" className={`text-xs border ${priority.color}`}>
                            <Flag className="h-2.5 w-2.5 mr-1" />{priority.label}
                          </Badge>
                          <Badge variant="outline" className={`text-xs border ${type.color}`}>
                            <Bug className="h-2.5 w-2.5 mr-1" />{type.label}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                          {issue.assigneeName && <span className="flex items-center gap-1"><User className="h-3 w-3" />{issue.assigneeName}</span>}
                          <span className="flex items-center gap-1 ml-auto"><Calendar className="h-3 w-3" />{issue.dueDate || "No deadline"}</span>
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
                {filteredIssues.map((issue) => {
                  const status = StatusCfg[issue.status] || StatusCfg.OPEN
                  const priority = PriorityCfg[issue.priority] || PriorityCfg.MEDIUM
                  const type = TypeCfg[issue.type || issue.issueType] || TypeCfg.OTHER
                  return (
                    <Card key={issue.issueId} className="group hover:shadow-md hover:border-orange-200/80 transition-all duration-200 cursor-pointer"
                      onClick={() => handleViewDetail(issue)}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${status.dot}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs text-slate-400 font-mono">ISSUE-{issue.issueId}</span>
                              <h3 className="font-medium text-slate-900 truncate group-hover:text-orange-600 transition-colors">{issue.title}</h3>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className={`text-xs border ${type.color}`}><Bug className="h-2.5 w-2.5 mr-1" />{type.label}</Badge>
                              <Badge variant="outline" className={`text-xs border ${priority.color}`}><Flag className="h-2.5 w-2.5 mr-1" />{priority.label}</Badge>
                              <Badge variant="outline" className="text-xs">{status.label}</Badge>
                              {issue.taskTitle && <span className="text-xs text-slate-400">{issue.taskTitle}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0 text-xs text-slate-400">
                            {issue.assigneeName && (
                              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-xs font-semibold">
                                {issue.assigneeName[0]?.toUpperCase() || "?"}
                              </div>
                            )}
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{issue.dueDate || "—"}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-orange-400 transition-colors" />
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
                  const colIssues = filteredIssues.filter((i) => i.status === column.id)
                  const colCfg = StatusCfg[column.id] || StatusCfg.OPEN
                  return (
                    <div key={column.id} className="flex-shrink-0 w-72">
                      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${colCfg.dot}`} />
                            <h3 className="font-semibold text-sm text-slate-700">{column.title}</h3>
                          </div>
                          <Badge variant="secondary" className="rounded-full text-xs">{colIssues.length}</Badge>
                        </div>
                        <div className="p-3 space-y-2 min-h-[200px] bg-slate-50/50">
                          {colIssues.map((issue) => {
                            const priority = PriorityCfg[issue.priority] || PriorityCfg.MEDIUM
                            const type = TypeCfg[issue.type || issue.issueType] || TypeCfg.OTHER
                            return (
                              <Card key={issue.issueId} className="group hover:shadow-md transition-shadow cursor-pointer border-slate-200"
                                onClick={() => handleViewDetail(issue)}>
                                <CardContent className="p-3">
                                  <h4 className="text-sm font-medium text-slate-900 line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">{issue.title}</h4>
                                  <div className="flex gap-1.5 flex-wrap">
                                    <Badge variant="outline" className={`text-xs border ${priority.color}`}>
                                      <Flag className="h-2.5 w-2.5 mr-1" />{priority.label}
                                    </Badge>
                                    <Badge variant="outline" className={`text-xs border ${type.color}`}>
                                      <Bug className="h-2.5 w-2.5 mr-1" />{type.label}
                                    </Badge>
                                  </div>
                                  {issue.assigneeName && (
                                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
                                      <div className="h-5 w-5 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-[10px] font-semibold">
                                        {issue.assigneeName[0]?.toUpperCase()}
                                      </div>
                                      <span className="text-xs text-slate-500">{issue.assigneeName}</span>
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

      <IssueDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={fetchIssues}
      />
      <IssueDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        issue={selectedIssue}
        onSuccess={fetchIssues}
      />
    </div>
  )
}
