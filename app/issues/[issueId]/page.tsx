"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import {
  Calendar, Clock, User, Edit, Trash2, Loader2, Bug, ArrowLeft,
  ChevronRight, Flag, FolderKanban, Layers, ListTodo, AlertTriangle
} from "lucide-react"
import { toast } from "sonner"
import { issueService } from "@/services/issue.service"
import { IssueDialog } from "@/components/issue/issue-dialog"
import type { IssueDTO } from "@/types/issue.types"

const StatusMap: Record<string, { label: string; dot: string; bg: string }> = {
  OPEN: { label: "Open", dot: "bg-blue-500", bg: "bg-blue-50 text-blue-700 border-blue-200" },
  IN_PROGRESS: { label: "In Progress", dot: "bg-amber-500", bg: "bg-amber-50 text-amber-700 border-amber-200" },
  RESOLVED: { label: "Resolved", dot: "bg-emerald-500", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  CLOSED: { label: "Closed", dot: "bg-slate-400", bg: "bg-slate-100 text-slate-600 border-slate-200" },
  REOPENED: { label: "Reopened", dot: "bg-orange-500", bg: "bg-orange-50 text-orange-700 border-orange-200" },
}

const PriorityMap: Record<string, { label: string; color: string }> = {
  LOW: { label: "Low", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  MEDIUM: { label: "Medium", color: "text-amber-600 bg-amber-50 border-amber-200" },
  HIGH: { label: "High", color: "text-orange-600 bg-orange-50 border-orange-200" },
  CRITICAL: { label: "Critical", color: "text-red-600 bg-red-50 border-red-200" },
}

const IssueTypeCfg: Record<string, { label: string; color: string }> = {
  BUG: { label: "Bug", color: "text-red-600 bg-red-50 border-red-200" },
  IMPROVEMENT: { label: "Improvement", color: "text-blue-600 bg-blue-50 border-blue-200" },
  QUESTION: { label: "Question", color: "text-violet-600 bg-violet-50 border-violet-200" },
  DOCUMENTATION: { label: "Documentation", color: "text-teal-600 bg-teal-50 border-teal-200" },
  OTHER: { label: "Other", color: "text-slate-600 bg-slate-50 border-slate-200" },
}

export default function IssueDetailPage() {
  const params = useParams()
  const router = useRouter()
  const issueId = Number(params.issueId)

  const [issue, setIssue] = useState<IssueDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false)
  const [completionTime, setCompletionTime] = useState<string>("")
  const [pendingStatusChange, setPendingStatusChange] = useState<{key: string} | null>(null)

  useEffect(() => { if (issueId) fetchIssueDetail() }, [issueId])

  const fetchIssueDetail = async () => {
    try {
      setLoading(true)
      const data: any = await issueService.getDetail(issueId)
      if (!data) { setLoading(false); return }
      setIssue(data.data || data)
    } catch (error) {
      console.error("Failed to fetch issue:", error)
      toast.error("Failed to load issue details")
    } finally { setLoading(false) }
  }

  const handleDelete = async () => {
    if (!issue || !confirm("Are you sure you want to delete this issue?")) return
    try {
      await issueService.delete(issue.issueId)
      toast.success("Issue deleted")
      router.push(`/tasks/${issue.taskId}`)
    } catch { toast.error("Failed to delete issue") }
  }

  const handleStatusChange = async (statusKey: string, actualHours?: number) => {
    if (!issue) return
    const issueStatusMap: Record<string, number> = {
      OPEN: 0,
      IN_PROGRESS: 1,
      RESOLVED: 2,
      CLOSED: 3,
      REOPENED: 4,
    }
    const statusInt = issueStatusMap[statusKey] !== undefined ? issueStatusMap[statusKey] : statusKey;
    try {
      const payload: any = { status: statusInt }
      if (actualHours !== undefined) {
        payload.actualHours = actualHours
      }
      await issueService.update(issue.issueId, payload)
      toast.success("Status updated")
      fetchIssueDetail()
    } catch { toast.error("Failed to update status") }
  }

  const fmt = (d: string | null) => {
    if (!d) return "N/A"
    return new Date(d).toLocaleDateString("vi-VN", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
  }

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar /><div className="flex-1 flex flex-col overflow-hidden"><Header />
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
            <div className="flex flex-col items-center gap-3"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /><p className="text-sm text-slate-500">Loading issue...</p></div>
          </div></div></div>
    )
  }

  if (!issue) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar /><div className="flex-1 flex flex-col overflow-hidden"><Header />
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-white">
            <Bug className="h-12 w-12 text-slate-300 mb-4" />
            <h2 className="text-xl font-semibold text-slate-700">Issue Not Found</h2>
            <p className="text-slate-500 mt-2 mb-6">The issue does not exist or you don't have permission.</p>
            <Button onClick={() => router.back()} variant="outline"><ArrowLeft className="h-4 w-4 mr-2" /> Go Back</Button>
          </div></div></div>
    )
  }

  const cs = StatusMap[issue.status] || StatusMap.OPEN
  const issueType = issue.type || issue.issueType || "OTHER"
  const typeCfg = IssueTypeCfg[issueType] || IssueTypeCfg.OTHER
  const priorityCfg = PriorityMap[issue.priority] || PriorityMap.MEDIUM

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-slate-50">
          <div className="max-w-6xl mx-auto px-6 py-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm mb-6 flex-wrap">
              <Link href="/projects" className="text-slate-500 hover:text-blue-600 transition-colors font-medium">Projects</Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <Link href={`/projects/${issue.projectId}`} className="text-slate-500 hover:text-blue-600 transition-colors font-medium">
                <FolderKanban className="h-3.5 w-3.5 inline mr-1" />Project #{issue.projectId}
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <Link href={`/tasks/${issue.taskId}`} className="text-slate-500 hover:text-blue-600 transition-colors font-medium">
                <ListTodo className="h-3.5 w-3.5 inline mr-1" />{issue.taskTitle || `Task #${issue.taskId}`}
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-slate-900 font-semibold truncate max-w-[250px]">{issue.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Issue Header */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="rounded-xl bg-gradient-to-br from-red-500 to-orange-500 p-3 flex-shrink-0">
                        <Bug className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <span className="text-xs text-slate-400 font-mono block mb-1">ISSUE-{issue.issueId}</span>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">{issue.title}</h1>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className={`border ${cs.bg}`}>
                            <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${cs.dot}`} />{cs.label}
                          </Badge>
                          <Badge variant="outline" className={`border ${typeCfg.color}`}>{typeCfg.label}</Badge>
                          {issue.priority && (
                            <Badge variant="outline" className={`border ${priorityCfg.color}`}>
                              <Flag className="h-3 w-3 mr-1" />{priorityCfg.label}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)}><Edit className="h-3.5 w-3.5 mr-1" /> Edit</Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={handleDelete}><Trash2 className="h-3.5 w-3.5 mr-1" /> Delete</Button>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-6">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{issue.description || "No description provided."}</p>
                  </div>

                  {/* Parent Task Reference */}
                  <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-100 p-2"><ListTodo className="h-4 w-4 text-blue-600" /></div>
                      <div>
                        <p className="text-xs text-blue-600 font-medium">Parent Task</p>
                        <p className="text-sm font-semibold text-blue-900">{issue.taskTitle || `TASK-${issue.taskId}`}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push(`/tasks/${issue.taskId}`)} className="bg-white">
                      View Task <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </div>

                  {/* Status Update */}
                  <div className="pt-5 border-t border-slate-100">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Update Status</h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(StatusMap).map(([key, v]) => {
                        const isAllowed = (() => {
                          const current = issue.status;
                          if (current === key) return true;
                          switch (current) {
                            case "OPEN": return key === "IN_PROGRESS" || key === "CLOSED";
                            case "IN_PROGRESS": return key === "RESOLVED" || key === "CLOSED";
                            case "RESOLVED": return key === "CLOSED" || key === "IN_PROGRESS";
                            case "CLOSED": return key === "REOPENED";
                            case "REOPENED": return key === "IN_PROGRESS" || key === "CLOSED";
                            default: return true;
                          }
                        })();

                        return (
                          <Button key={key} variant={issue.status === key ? "default" : "outline"} size="sm"
                            onClick={() => handleStatusChange(key)}
                            disabled={!isAllowed && issue.status !== key}
                            className={issue.status === key ? `${v.bg} border` : (!isAllowed ? "opacity-50 cursor-not-allowed" : "")}>
                            <div className={`w-2 h-2 rounded-full mr-1.5 ${v.dot}`} />{v.label}
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Details</h3>
                  <div className="space-y-4">
                    {[
                      { icon: User, label: "Reporter", value: issue.reporterName || "System" },
                      { icon: User, label: "Assignee", value: (issue as any).assigneeName || issue.assignedToName || "Unassigned" },
                      { icon: Clock, label: "Created", value: fmt(issue.createdDate) },
                      { icon: Clock, label: "Updated", value: fmt(issue.updatedDate || issue.createdDate) },
                      { icon: Calendar, label: "Due Date", value: fmt(issue.dueDate) },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <item.icon className="h-4 w-4 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-slate-500">{item.label}</p>
                          <p className="text-sm font-medium text-slate-900">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Navigation */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Navigation</h3>
                  <div className="space-y-2">
                    <button onClick={() => router.push(`/tasks/${issue.taskId}`)} className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all text-left">
                      <ListTodo className="h-4 w-4 text-blue-500" />
                      <div><p className="text-xs text-slate-500">Parent Task</p><p className="text-sm font-medium text-slate-900">{issue.taskTitle || `TASK-${issue.taskId}`}</p></div>
                    </button>
                    <button onClick={() => router.push(`/projects/${issue.projectId}`)} className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all text-left">
                      <FolderKanban className="h-4 w-4 text-indigo-500" />
                      <div><p className="text-xs text-slate-500">Project</p><p className="text-sm font-medium text-slate-900">Project #{issue.projectId}</p></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <IssueDialog taskId={issue.taskId} projectId={issue.projectId} issue={issue as any} open={editDialogOpen} onOpenChange={setEditDialogOpen} onSuccess={fetchIssueDetail} />

      {/* Completion Modal - Temporarily disabled
      <Dialog open={isCompletionModalOpen} onOpenChange={setIsCompletionModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Issue</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-slate-500">
              Please enter the total time spent (in hours) to resolve this issue.
            </p>
            <div className="space-y-2">
              <Label htmlFor="issueActualHours">Time Spent (Hours)</Label>
              <Input
                id="issueActualHours"
                type="number"
                min="0"
                step="0.5"
                value={completionTime}
                onChange={(e) => setCompletionTime(e.target.value)}
                placeholder="e.g. 2.5"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCompletionModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!completionTime) {
                  toast.error("Please enter the time spent")
                  return
                }
                if (pendingStatusChange) {
                  handleStatusChange(pendingStatusChange.key, Number(completionTime))
                  setIsCompletionModalOpen(false)
                  setCompletionTime("")
                  setPendingStatusChange(null)
                }
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      */}
    </div>
  )
}
