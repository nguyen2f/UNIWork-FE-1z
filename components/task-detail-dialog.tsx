"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, AlertCircle, User, Edit, Trash2, Upload, Loader2, Send, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import type { Task } from "@/types"
import { updateTask, getTaskDetail } from "@/app/services/taskService"
import { getAllCommentsByTaskId, addComment } from "@/app/services/commentService"

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
}

export function TaskDetailDialog({ task, open, onOpenChange }: TaskDetailDialogProps) {
    const [taskDetail, setTaskDetail] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [comments, setComments] = useState<any[]>([])
    const [loadingComments, setLoadingComments] = useState(false)
    const [newComment, setNewComment] = useState("")
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (open && task) {
            fetchTaskDetail()
            fetchComments()
        }
    }, [open, task])

    const fetchTaskDetail = async () => {
        if (!task) return
        try {
            setLoading(true)
            const response = await getTaskDetail(task.projectId, task.taskId)
            const data = response.data.data.task
            setTaskDetail({ data })
        } catch (error) {
            console.error("Failed to fetch task detail:", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchComments = async () => {
        if (!task) return
        try {
            setLoadingComments(true)
            const response = await getAllCommentsByTaskId(task.taskId)
            setComments(response.data || [])
        } catch (error) {
            console.error("Failed to fetch comments:", error)
            setComments([])
        } finally {
            setLoadingComments(false)
        }
    }

    const handleAddComment = async () => {
        if (!task || !newComment.trim()) return;

        try {
            setSubmitting(true);

            const commentPayload = {
                taskId: task.taskId,
                authorId: Number(localStorage.getItem("userId")),
                posterId: task.assigneeId,
                content: newComment.trim(),
            };

            console.log("SEND COMMENT:", commentPayload);

            await addComment(commentPayload);

            toast.success("Comment added successfully");
            setNewComment("");
            fetchComments();
        } catch (error: any) {
            console.error("Add comment error:", error?.response?.data || error);
            toast.error("Failed to add comment");
        } finally {
            setSubmitting(false);
        }
    };


    const handleStatusChange = async (statusKey: string, statusCode: number) => {
        if (!task) return
        try {
            console.log("🔄 Updating status:", { statusKey, statusCode })

            // Gửi code number lên API
            const response = await updateTask(task.projectId, task.taskId, { status: statusCode })
            console.log("✅ API response:", response.data)

            toast.success("Task status updated successfully.")

            // Lấy data từ response (không cần fetch lại)
            const updatedTask = response.data?.data
            if (updatedTask) {
                setTaskDetail(updatedTask)
                console.log("✅ Local state updated to:", updatedTask.status)
            }
        } catch (err) {
            console.error("❌ Update failed:", err)
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
            year: "numeric"
        })
    }

    if (!task) return null

    const displayTask = taskDetail || task
    const currentStatus = StatusMap[displayTask.status] || StatusMap.PENDING
    const currentPriority = PriorityMap[displayTask.priority] || PriorityMap.LOW

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-2xl">{displayTask.title}</DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                ) : (
                    <ScrollArea className="flex-1 overflow-hidden">
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
                                            <p className="text-sm font-medium">
                                                {formatDate(displayTask.dueDate)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <AlertCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">PRIORITY</p>
                                            <Badge className={`mt-1 ${currentPriority.color}`}>
                                                {currentPriority.label}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">CREATED</p>
                                            <p className="text-sm font-medium">
                                                {formatDate(displayTask.createdDate)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">ASSIGNED TO</p>
                                            <p className="text-sm font-medium">
                                                {displayTask.assignedTo || "Team Member"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

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
                                                onClick={() => handleStatusChange(key, value.code)}                                                className={isActive ? value.color : ""}
                                            >
                                                {value.label}
                                            </Button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Comments Section */}
                            <div className="space-y-4 pt-4 border-t">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5 text-gray-600" />
                                    <h3 className="text-lg font-semibold">
                                        Comments ({comments.length})
                                    </h3>
                                </div>

                                {/* Add Comment */}
                                <div className="space-y-2">
                                    <Textarea
                                        placeholder="Write a comment..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="min-h-[80px] resize-none"
                                    />
                                    <div className="flex justify-end">
                                        <Button
                                            size="sm"
                                            onClick={handleAddComment}
                                            disabled={!newComment.trim() || submitting}
                                        >
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
                                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                                    {loadingComments ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                                        </div>
                                    ) : comments.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                            <p className="text-sm">No comments yet</p>
                                            <p className="text-xs">Be the first to comment!</p>
                                        </div>
                                    ) : (
                                        comments.map((comment) => (
                                            <div key={comment.id} className="flex gap-3 p-3 rounded-lg hover:bg-gray-50">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={comment.userAvatar} />
                                                    <AvatarFallback>
                                                        {comment.userName?.charAt(0) || "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-sm">
                                                            {comment.userName || "User"}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {formatCommentDate(comment.createdDate)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-700">
                                                        {comment.content}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* File Upload */}
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="text-lg font-semibold">Attachments</h3>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                    <p className="text-sm font-medium text-gray-700">Drag and drop files or click to upload</p>
                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF, DOC up to 10MB</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2 pt-4 border-t">
                                <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit Task
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete Task
                                </Button>
                            </div>
                        </div>
                    </ScrollArea>
                )}
            </DialogContent>
        </Dialog>
    )
}
