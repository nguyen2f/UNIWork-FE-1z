"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import {
  Calendar, Clock, AlertCircle, User, Edit, Trash2, Upload, Loader2, Send,
  MessageSquare, ChevronRight, Download, Bug, Plus, ArrowLeft, ListTodo,
  Flag, Tag, Layers, FolderKanban
} from "lucide-react"
import { toast } from "sonner"
import { taskService } from "@/services/task.service"
import { commentService } from "@/services/comment.service"
import { fileService } from "@/services/file.service"
import { IssueDialog } from "@/components/issue/issue-dialog"
import type { IssueDTO } from "@/types/issue.types"

const StatusMap: Record<string, { code: number; label: string; dot: string; bg: string }> = {
  PENDING: { code: 0, label: "Pending", dot: "bg-slate-400", bg: "bg-slate-100 text-slate-700" },
  DOING: { code: 1, label: "In Progress", dot: "bg-amber-500", bg: "bg-amber-50 text-amber-700" },
  REVIEWING: { code: 2, label: "Reviewing", dot: "bg-blue-500", bg: "bg-blue-50 text-blue-700" },
  COMPLETED: { code: 3, label: "Completed", dot: "bg-emerald-500", bg: "bg-emerald-50 text-emerald-700" },
  CANCELLED: { code: 4, label: "Cancelled", dot: "bg-red-500", bg: "bg-red-50 text-red-700" },
}

const PriorityMap: Record<string, { code: number; label: string; color: string }> = {
  LOW: { code: 0, label: "Low", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  MEDIUM: { code: 1, label: "Medium", color: "text-amber-600 bg-amber-50 border-amber-200" },
  HIGH: { code: 2, label: "High", color: "text-orange-600 bg-orange-50 border-orange-200" },
  CRITICAL: { code: 3, label: "Critical", color: "text-red-600 bg-red-50 border-red-200" },
}

const IssueStatusColor: Record<string, string> = {
  OPEN: "bg-blue-50 text-blue-700 border-blue-200",
  IN_PROGRESS: "bg-amber-50 text-amber-700 border-amber-200",
  RESOLVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CLOSED: "bg-slate-100 text-slate-600 border-slate-200",
  REOPENED: "bg-orange-50 text-orange-700 border-orange-200",
}

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = Number(params.taskId)

  const [taskDetail, setTaskDetail] = useState<any>(null)

  const [comments, setComments] = useState<any[]>([])
  const [fileAttachments, setFileAttachments] = useState<any[]>([])
  const [issues, setIssues] = useState<IssueDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [issueDialogOpen, setIssueDialogOpen] = useState(false)
  
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false)
  const [completionTime, setCompletionTime] = useState<string>("")
  const [pendingStatusChange, setPendingStatusChange] = useState<{key: string, code: number} | null>(null)

  useEffect(() => { if (taskId) fetchTaskDetail() }, [taskId])

  const fetchTaskDetail = async () => {
    try {
      setLoading(true)
      const data: any = await taskService.getDetail(taskId)
      if (!data) { setLoading(false); return }
      const payload = data.data || data
      setTaskDetail(payload.task)

      setComments(payload.comments || [])
      setFileAttachments(payload.fileAttachments || [])
      setIssues(payload.issues || [])
    } catch (error) {
      console.error("Failed to fetch task detail:", error)
      toast.error("Failed to load task details")
    } finally { setLoading(false) }
  }

  const handleAddComment = async () => {
    if (!newComment.trim() || !taskDetail) return
    try {
      setSubmitting(true)
      await commentService.add({ taskId, authorId: Number(localStorage.getItem("userId")), posterId: taskDetail.assignedTo, content: newComment.trim() } as any)
      toast.success("Comment added")
      setNewComment("")
      fetchTaskDetail()
    } catch { toast.error("Failed to add comment") }
    finally { setSubmitting(false) }
  }

  const handleStatusChange = async (key: string, code: number, actualHours?: number) => {
    if (!taskDetail) return
    try {
      const payload: any = { status: code }
      if (actualHours !== undefined) {
        payload.actualHours = actualHours
      }
      await taskService.updateStatus(taskDetail.projectId, taskDetail.stageId, taskId, payload)
      toast.success("Status updated")
      fetchTaskDetail()
    } catch { toast.error("Failed to update status") }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !taskDetail) return
    try {
      setUploading(true)
      await fileService.upload(taskDetail.projectId, taskId, file)
      fetchTaskDetail()
      toast.success("File uploaded")
    } catch { toast.error("Failed to upload file") }
    finally { setUploading(false); e.target.value = "" }
  }

  const handleDeleteFile = async (fileId: number) => {
    if (!taskDetail) return
    try {
      await fileService.delete(taskDetail.projectId, taskId, String(fileId))
      toast.success("File deleted")
      fetchTaskDetail()
    } catch { toast.error("Failed to delete file") }
  }

  const handleDownloadFile = (file: any) => {
    if (!taskDetail) return
    fileService.download(taskDetail.projectId, taskId, file.fileId, file.originalFileName || "file")
  }

  const fmt = (d: string) => d ? new Date(d).toLocaleDateString("vi-VN", { year: "numeric", month: "short", day: "numeric" }) : "N/A"
  const fmtRel = (d: string) => {
    if (!d) return ""
    const ms = Date.now() - new Date(d).getTime()
    const m = Math.floor(ms / 60000), h = Math.floor(ms / 3600000), dy = Math.floor(ms / 86400000)
    if (m < 1) return "Just now"
    if (m < 60) return `${m}m ago`
    if (h < 24) return `${h}h ago`
    if (dy < 7) return `${dy}d ago`
    return new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar /><div className="flex-1 flex flex-col overflow-hidden"><Header />
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
            <div className="flex flex-col items-center gap-3"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /><p className="text-sm text-slate-500">Loading task...</p></div>
          </div></div></div>
    )
  }

  if (!taskDetail) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar /><div className="flex-1 flex flex-col overflow-hidden"><Header />
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-white">
            <AlertCircle className="h-12 w-12 text-slate-300 mb-4" />
            <h2 className="text-xl font-semibold text-slate-700">Task Not Found</h2>
            <p className="text-slate-500 mt-2 mb-6">The task does not exist or you don't have permission.</p>
            <Button onClick={() => router.back()} variant="outline"><ArrowLeft className="h-4 w-4 mr-2" /> Go Back</Button>
          </div></div></div>
    )
  }

  const cs = StatusMap[taskDetail.status] || StatusMap.PENDING
  const cp = PriorityMap[taskDetail.priority] || PriorityMap.LOW

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
              <Link href={`/projects/${taskDetail.projectId}`} className="text-slate-500 hover:text-blue-600 transition-colors font-medium">
                <FolderKanban className="h-3.5 w-3.5 inline mr-1" />Project #{taskDetail.projectId}
              </Link>
              {taskDetail.stageName && (<><ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                <Link href={`/projects/${taskDetail.projectId}/stages/${taskDetail.stageId}`} className="text-slate-500 hover:text-blue-600 transition-colors font-medium">
                  <Layers className="h-3.5 w-3.5 inline mr-1" />{taskDetail.stageName}
                </Link></>)}
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-slate-900 font-semibold truncate max-w-[250px]">{taskDetail.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Task Header */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <span className="text-xs text-slate-400 font-mono mb-1 block">TASK-{taskId}</span>
                      <h1 className="text-2xl font-bold text-slate-900 mb-2">{taskDetail.title}</h1>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className={`border ${cs.bg}`}>
                          <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${cs.dot}`} />{cs.label}
                        </Badge>
                        <Badge variant="outline" className={`border ${cp.color}`}>
                          <Flag className="h-3 w-3 mr-1" />{cp.label}
                        </Badge>
                        {taskDetail.tags && <Badge variant="outline" className="text-xs"><Tag className="h-3 w-3 mr-1" />{taskDetail.tags}</Badge>}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button variant="outline" size="sm"><Edit className="h-3.5 w-3.5 mr-1" /> Edit</Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5 mr-1" /> Delete</Button>
                    </div>
                  </div>
                  {taskDetail.description && (
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-sm text-slate-700 whitespace-pre-wrap">{taskDetail.description}</div>
                  )}

                  {/* Status Update */}
                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Update Status</h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(StatusMap).map(([key, v]) => {
                        const isAllowed = (() => {
                          const current = taskDetail.status;
                          if (current === key) return true;
                          switch (current) {
                            case "PENDING": return key === "DOING" || key === "CANCELLED";
                            case "DOING": return key === "REVIEWING" || key === "CANCELLED";
                            case "REVIEWING": return key === "COMPLETED" || key === "DOING";
                            case "CANCELLED": return key === "DOING";
                            case "COMPLETED": return false;
                            default: return true;
                          }
                        })();

                        return (
                          <Button key={key} variant={taskDetail.status === key ? "default" : "outline"} size="sm"
                            onClick={() => handleStatusChange(key, v.code)}
                            disabled={!isAllowed && taskDetail.status !== key}
                            className={taskDetail.status === key ? `${v.bg} border` : (!isAllowed ? "opacity-50 cursor-not-allowed" : "")}>
                            <div className={`w-2 h-2 rounded-full mr-1.5 ${v.dot}`} />{v.label}
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Issues */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2"><Bug className="h-4 w-4 text-red-500" /> Issues ({issues.length})</h3>
                    <Button variant="outline" size="sm" onClick={() => setIssueDialogOpen(true)}><Plus className="h-3.5 w-3.5 mr-1" /> Add Issue</Button>
                  </div>
                  {issues.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-8">No issues reported.</p>
                  ) : (
                    <div className="space-y-2">
                      {issues.map(issue => (
                        <div key={issue.issueId} className="group flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:border-blue-200 hover:shadow-sm cursor-pointer transition-all"
                          onClick={() => router.push(`/issues/${issue.issueId}`)}>
                          <Bug className="h-4 w-4 text-slate-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs text-blue-600 font-mono">ISSUE-{issue.issueId}</span>
                              <span className="text-sm font-medium text-slate-900 truncate group-hover:text-blue-600 transition-colors">{issue.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={`text-xs border ${IssueStatusColor[issue.status] || ""}`}>{issue.status}</Badge>
                              <Badge variant="outline" className="text-xs">{issue.issueType || issue.type}</Badge>
                            </div>
                          </div>
                          <span className="text-xs text-slate-400">{(issue as any).assigneeName || issue.assignedToName || "Unassigned"}</span>
                          <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-400 transition-colors" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>



                {/* Comments */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-4"><MessageSquare className="h-4 w-4" /> Comments ({comments.length})</h3>
                  <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto pr-1">
                    {comments.length === 0 && <p className="text-sm text-slate-400 text-center py-6">No comments yet.</p>}
                    {comments.map(c => (
                      <div key={c.commentId || c.id} className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-semibold">{c.authorName?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex gap-2 items-center mb-1">
                            <span className="text-sm font-semibold text-slate-900">{c.authorName || "User"}</span>
                            <span className="text-xs text-slate-400">{fmtRel(c.createdDate)}</span>
                          </div>
                          <p className="text-sm text-slate-700">{c.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Textarea placeholder="Write a comment..." value={newComment} onChange={e => setNewComment(e.target.value)} className="flex-1 min-h-[60px] resize-none" />
                    <Button onClick={handleAddComment} disabled={!newComment.trim() || submitting} size="icon" className="h-[60px] w-[60px]"><Send className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Info Card */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Details</h3>
                  <div className="space-y-4">
                    {[
                      { icon: FolderKanban, label: "Project", value: taskDetail.projectName || `Project #${taskDetail.projectId}` },
                      { icon: User, label: "Creator", value: taskDetail.createdByName || taskDetail.creatorName || "System" },
                      { icon: User, label: "Manager", value: taskDetail.managedByName || taskDetail.managerName || "N/A" },
                      { icon: User, label: "Assignee", value: taskDetail.assigneeName || "Unassigned" },
                      { icon: Layers, label: "Stage", value: taskDetail.stageName || "—" },
                      { icon: Bug, label: "Issues", value: taskDetail.issueCount != null ? `${taskDetail.issueCount} issue(s)` : `${issues.length} issue(s)` },
                      { icon: Calendar, label: "Due Date", value: fmt(taskDetail.dueDate) },
                      { icon: Clock, label: "Created", value: fmt(taskDetail.createdDate) },
                      { icon: Clock, label: "Updated", value: fmt(taskDetail.updatedDate) },
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

                {/* Files Card */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Upload className="h-3.5 w-3.5" /> Files ({fileAttachments.length})
                  </h3>
                  <div className="space-y-2 mb-3">
                    {fileAttachments.map(f => (
                      <div key={f.fileId} className="flex items-center gap-2 p-2 border border-slate-100 rounded-lg text-sm">
                        <Upload className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate flex-1 text-slate-700">{f.originalFileName}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDownloadFile(f)}><Download className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => handleDeleteFile(f.fileId)}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    ))}
                  </div>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-blue-300 transition-colors cursor-pointer"
                    onClick={() => document.getElementById("file-upload")?.click()}>
                    <Upload className="h-5 w-5 mx-auto text-slate-400 mb-1" />
                    <p className="text-xs text-slate-500">Click to upload</p>
                    <input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <IssueDialog taskId={taskId} projectId={taskDetail.projectId} open={issueDialogOpen} onOpenChange={setIssueDialogOpen} onSuccess={fetchTaskDetail} />

      {/* Completion Modal - Temporarily disabled
      <Dialog open={isCompletionModalOpen} onOpenChange={setIsCompletionModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Task</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-slate-500">
              Please enter the total time spent (in hours) to complete this task.
            </p>
            <div className="space-y-2">
              <Label htmlFor="actualHours">Time Spent (Hours)</Label>
              <Input
                id="actualHours"
                type="number"
                min="0"
                step="0.5"
                value={completionTime}
                onChange={(e) => setCompletionTime(e.target.value)}
                placeholder="e.g. 4.5"
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
                  handleStatusChange(pendingStatusChange.key, pendingStatusChange.code, Number(completionTime))
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
