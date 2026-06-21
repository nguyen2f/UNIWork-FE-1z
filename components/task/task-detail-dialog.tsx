"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  Clock,
  AlertCircle,
  User,
  Edit,
  Trash2,
  Upload,
  Loader2,
  Send,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  Download,
  Eye,
  Bug,
  Plus,
} from "lucide-react"
import { toast } from "sonner"
import type { Task } from "@/types/task.types"
import { taskService } from "@/services/task.service"
import { commentService } from "@/services/comment.service"
import { fileService } from "@/services/file.service"
import { IssueDialog } from "@/components/issue/issue-dialog"
import { EditTaskDialog } from "@/components/task/edit-task-dialog"
import type { IssueDTO } from "@/types/issue.types"

interface TaskDetailDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const StatusMap = {
  PENDING: { code: 0, label: "Pending", color: "bg-gray-500 text-white" },
  DOING: { code: 1, label: "In Progress", color: "bg-blue-500 text-white" },
  REVIEWING: { code: 2, label: "Reviewing", color: "bg-yellow-500 text-white" },
  COMPLETED: { code: 3, label: "Completed", color: "bg-green-500 text-white" },
  CANCELLED: { code: 4, label: "Cancelled", color: "bg-red-500 text-white" },
}

const PriorityMap = {
  LOW: { code: 0, label: "Low", color: "bg-green-500 text-white" },
  MEDIUM: { code: 1, label: "Medium", color: "bg-yellow-500 text-white" },
  HIGH: { code: 2, label: "High", color: "bg-red-500 text-white" },
  CRITICAL: { code: 3, label: "Critical", color: "bg-orange-500 text-white" },
}

export function TaskDetailDialog({ task, open, onOpenChange }: TaskDetailDialogProps) {
  const [taskDetail, setTaskDetail] = useState<any>(null)
  const [childTasks, setChildTasks] = useState<any[]>([])
  const [comments, setComments] = useState<any[]>([])
  const [fileAttachments, setFileAttachments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false)
  const [isFilesExpanded, setIsFilesExpanded] = useState(false)
  const [previewFile, setPreviewFile] = useState<any>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [issues, setIssues] = useState<IssueDTO[]>([])
  const [isIssuesExpanded, setIsIssuesExpanded] = useState(false)
  const [issueDialogOpen, setIssueDialogOpen] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState<IssueDTO | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  useEffect(() => {
    if (!open || !task) return

    setTaskDetail(null)
    setChildTasks([])
    setComments([])
    setFileAttachments([])
    setIssues([])

    fetchTaskDetail()
  }, [open, task?.taskId])


  const fetchTaskDetail = async () => {
    if (!task) return
    try {
      setLoading(true)
      const data = await taskService.getDetail(task.taskId)

      setTaskDetail(data.task)
      setChildTasks(data.childTasks || [])
      setComments(data.comments || [])
      
      try {
        const filesRes = await fileService.getFiles(task.taskId)
        setFileAttachments(filesRes.data || filesRes || [])
      } catch (err) {
        console.error("Failed to fetch files from getFiles API, falling back:", err)
        setFileAttachments(data.fileAttachments || [])
      }

      setIssues(data.issues || [])
    } catch (error) {
      console.error("Failed to fetch task detail:", error)
      toast.error("Failed to load task details")
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!task || !newComment.trim()) return

    try {
      setSubmitting(true)

      const commentPayload = {
        taskId: task.taskId,
        authorId: Number(localStorage.getItem("userId")),
        posterId: task.assignedTo,
        content: newComment.trim(),
      }

      await commentService.add(commentPayload as any)

      toast.success("Comment added successfully")
      setNewComment("")

      // Refresh task detail to get updated comments
      fetchTaskDetail()
    } catch (error: any) {
      console.error("Add comment error:", error?.response?.data || error)
      toast.error("Failed to add comment")
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusChange = async (statusKey: string, statusCode: number) => {
    if (!task) return
    try {
      const response = await taskService.updateStatus(task.projectId, task.stageId, task.taskId, { status: statusCode } as any)
      toast.success("Task status updated successfully.")

      // Refresh task detail to get updated status
      fetchTaskDetail()
    } catch (err) {
      console.error("Update failed:", err)
      toast.error("Failed to update status")
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatCommentDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file || !task) return

    try {
      setUploading(true)
      await fileService.upload(task.projectId, task.taskId, file)
      fetchTaskDetail()
      toast.success("Upload file thành công")
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload file")
    } finally {
      setUploading(false)
      e.target.value = "" // reset input
    }
  }


  const handleDeleteFile = async (fileId: number) => {
    if (!task) return
    try {
      await fileService.delete(task.projectId, task.taskId, String(fileId))
      toast.success("File deleted successfully")
      fetchTaskDetail()
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("Failed to delete file")
    }
  }

  const handleDownloadFile = (file: any) => {
    if (!task) return
    fileService.download(task.projectId, task.taskId, file.fileId, file.originalFileName || "file")
  }

  if (!task) return null

  const displayTask = taskDetail || task
  const currentStatus = StatusMap[displayTask.status as keyof typeof StatusMap] || StatusMap.PENDING
  const currentPriority = PriorityMap[displayTask.priority as keyof typeof PriorityMap] || PriorityMap.LOW

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle className="text-2xl">{displayTask.title}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto min-h-0 py-6">
            <div className="space-y-6 pr-4">
              {/* Task Info */}
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{displayTask.description}</p>

                {/* Status + Priority */}
                <div className="flex gap-2 flex-wrap">
                  <Badge className={currentStatus.color}>{currentStatus.label}</Badge>
                  <Badge className={currentPriority.color}>{currentPriority.label}</Badge>
                </div>

                {/* Task Details Grid */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">DUE DATE</p>
                      <p className="text-sm font-medium">{formatDate(displayTask.dueDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">PRIORITY</p>
                      <Badge className={`mt-1 ${currentPriority.color}`}>{currentPriority.label}</Badge>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">CREATED</p>
                      <p className="text-sm font-medium">{formatDate(displayTask.createdDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">ASSIGNED TO</p>
                      <p className="text-sm font-medium">{displayTask.assigneeName || ""}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Issues Section */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between w-full">
                  <button
                    type="button"
                    onClick={() => setIsIssuesExpanded(!isIssuesExpanded)}
                    className="flex items-center gap-2 text-left"
                  >
                    <Bug className="h-5 w-5 text-red-500" />
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      Issues ({issues.length})
                      {isIssuesExpanded ? (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      )}
                    </h3>
                  </button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIssue(null);
                      setIssueDialogOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Issue
                  </Button>
                </div>

                {isIssuesExpanded && (
                  <div className="space-y-2">
                    {issues.length === 0 ? (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        No issues found for this task.
                      </div>
                    ) : (
                      issues.map((issue) => (
                        <div
                          key={issue.issueId}
                          className="p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedIssue(issue);
                            setIssueDialogOpen(true);
                          }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="font-medium text-sm flex items-center gap-2">
                                {issue.title}
                                <Badge variant="outline" className="text-xs">{issue.issueType}</Badge>
                              </p>
                              {issue.description && (
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{issue.description}</p>
                              )}
                              <div className="flex gap-2 mt-2">
                                <Badge className={`text-xs ${
                                  issue.status === 'OPEN' ? 'bg-blue-500' :
                                  issue.status === 'IN_PROGRESS' ? 'bg-yellow-500' :
                                  issue.status === 'RESOLVED' ? 'bg-green-500' :
                                  issue.status === 'CLOSED' ? 'bg-gray-500' : 'bg-orange-500'
                                } text-white`}>{issue.status}</Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">{issue.assignedToName || "Unassigned"}</p>
                              <p className="text-xs text-gray-500 mt-1">{formatDate(issue.createdDate)}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Child Tasks Section */}
              {childTasks.length > 0 && (
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ChevronRight className="h-5 w-5" />
                    Sub-tasks ({childTasks.length})
                  </h3>
                  <div className="space-y-2">
                    {childTasks.map((childTask) => {
                      const childStatus = StatusMap[childTask.status as keyof typeof StatusMap] || StatusMap.PENDING
                      const childPriority = PriorityMap[childTask.priority as keyof typeof PriorityMap] || PriorityMap.LOW
                      return (
                        <div
                          key={childTask.taskId}
                          className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{childTask.title}</p>
                              {childTask.description && (
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{childTask.description}</p>
                              )}
                              <div className="flex gap-2 mt-2">
                                <Badge className={`text-xs ${childStatus.color}`}>{childStatus.label}</Badge>
                                <Badge className={`text-xs ${childPriority.color}`}>{childPriority.label}</Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">{childTask.assigneeName || "Unassigned"}</p>
                              <p className="text-xs text-gray-500 mt-1">{formatDate(childTask.dueDate)}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Update Status */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(StatusMap).map(([key, value]) => {
                    const isActive = displayTask.status === key
                    return (
                      <Button
                        key={key}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleStatusChange(key, value.code)}
                        className={isActive ? value.color : ""}
                      >
                        {value.label}
                      </Button>
                    )
                  })}
                </div>
              </div>

              {/* Comments Section */}
              <div className="space-y-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsCommentsExpanded(!isCommentsExpanded)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
                  </div>
                  {isCommentsExpanded ? (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                </button>

                {isCommentsExpanded && (
                  <>
                    {/* Add Comment */}
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[80px] resize-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                            handleAddComment()
                          }
                        }}
                      />
                      <div className="flex justify-end">
                        <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim() || submitting}>
                          {submitting ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4 mr-2" />
                          )}
                          Post Comment
                        </Button>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {comments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No comments yet</p>
                          <p className="text-xs">Be the first to comment!</p>
                        </div>
                      ) : (
                        comments.map((comment) => (
                          <div
                            key={comment.commentId || comment.id}
                            className="flex gap-3 p-3 rounded-lg hover:bg-gray-50"
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                                  comment.authorName,
                                )}&chars=1`}
                              />

                              <AvatarFallback className="text-sm font-semibold">
                                {comment.authorName?.[0]?.toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">{comment.authorName || "User"}</span>
                                <span className="text-xs text-gray-500">{formatCommentDate(comment.createdDate)}</span>
                              </div>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Files Section */}
              <div className="space-y-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsFilesExpanded(!isFilesExpanded)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Files & Attachments ({fileAttachments.length})</h3>
                  </div>
                  {isFilesExpanded ? (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                </button>

                {isFilesExpanded && (
                  <div className="space-y-6">
                    {/* File Attachments List */}
                    {fileAttachments.length > 0 && (
                      <div className="space-y-2">
                        {fileAttachments.map((file) => (
                          <div
                            key={file.fileId}
                            className="p-3 border rounded-lg flex items-center justify-between hover:bg-gray-50"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <Upload className="h-4 w-4 text-gray-500 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{file.originalFileName}</p>
                                <div className="flex gap-2 text-xs text-gray-500">
                                  <span>{(file.fileSize / 1024).toFixed(2)} KB</span>
                                  <span>•</span>
                                  <span>{file.uploaderName}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => {
                                  setPreviewFile(file)
                                  setIsPreviewOpen(true)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleDownloadFile(file)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteFile(file.fileId)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* File Upload Area */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Upload New File</p>
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                        onClick={() => document.getElementById("file-input")?.click()}
                      >
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm font-medium text-gray-700">Click to upload or drag file</p>
                        <p className="text-xs text-gray-500 mt-1">PDF, DOC (max 50MB)</p>
                        <input
                          id="file-input"
                          type="file"
                          className="hidden"
                          onChange={handleFileUpload}
                          disabled={uploading}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Task
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete Task
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b flex-shrink-0">
            <DialogTitle className="flex justify-between items-center pr-8">
              <span className="truncate">{previewFile?.originalFileName}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center p-4">
            {previewFile?.contentType?.startsWith("image/") ? (
              <img
                src={previewFile.fileUrl}
                alt={previewFile.originalFileName}
                className="max-w-full max-h-full object-contain shadow-lg"
              />
            ) : previewFile?.contentType === "application/pdf" ? (
              <iframe src={previewFile.fileUrl} className="w-full h-full border-none" title="PDF Preview" />
            ) : (
              <div className="text-center p-8">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">No preview available for this file type.</p>
                <Button onClick={() => handleDownloadFile(previewFile)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download to View
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <IssueDialog
        taskId={task.taskId}
        projectId={displayTask?.projectId}
        issue={selectedIssue}
        open={issueDialogOpen}
        onOpenChange={setIssueDialogOpen}
        onSuccess={fetchTaskDetail}
      />
      <EditTaskDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        task={displayTask}
        onSuccess={fetchTaskDetail}
      />
    </Dialog>
  )
}
