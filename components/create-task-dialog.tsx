"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Plus, Loader2, User } from "lucide-react"
import { mockUsers, mockProjects } from "@/lib/data"
import { toast } from "sonner"

interface CreateTaskDialogProps {
  trigger?: React.ReactNode
  projectId?: string
  onSuccess?: () => void
}

export function CreateTaskDialog({ trigger, projectId, onSuccess }: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    projectId: projectId || "",
    assigneeId: "",
    dueDate: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const assignee = mockUsers.find((u) => u.id === formData.assigneeId)
      const project = mockProjects.find((p) => p.id === formData.projectId)

      const taskData = {
        id: `task-${Date.now()}`,
        ...formData,
        createdBy: "current-user-id",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assignee: assignee!,
      }

      console.log("Created task:", taskData)
      toast.success("Tạo công việc thành công!")

      setOpen(false)
      resetForm()
      onSuccess?.()
    } catch (error) {
      toast.error("Không thể tạo công việc")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      projectId: projectId || "",
      assigneeId: "",
      dueDate: "",
    })
  }

  const selectedAssignee = mockUsers.find((user) => user.id === formData.assigneeId)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tạo công việc
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo công việc mới</DialogTitle>
          <DialogDescription>Điền thông tin để tạo công việc mới</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Tiêu đề công việc *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
                className="mt-1"
                placeholder="Nhập tiêu đề công việc"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Mô tả *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                required
                className="mt-1"
                rows={4}
                placeholder="Mô tả chi tiết về công việc"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="projectId">Dự án *</Label>
              <Select
                value={formData.projectId}
                onValueChange={(value) => handleChange("projectId", value)}
                disabled={!!projectId}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chọn dự án" />
                </SelectTrigger>
                <SelectContent>
                  {mockProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">Chưa làm</SelectItem>
                  <SelectItem value="in-progress">Đang làm</SelectItem>
                  <SelectItem value="review">Đang review</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Độ ưu tiên</Label>
              <Select value={formData.priority} onValueChange={(value) => handleChange("priority", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Thấp</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="high">Cao</SelectItem>
                  <SelectItem value="critical">Khẩn cấp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="dueDate">Hạn hoàn thành</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="md:col-span-2">
              <Label>Người thực hiện</Label>
              {selectedAssignee && (
                <div className="mt-2 mb-3">
                  <Badge variant="secondary" className="pl-2 pr-3 py-2">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarFallback>{selectedAssignee.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{selectedAssignee.name}</span>
                      <span className="text-xs text-gray-500">{selectedAssignee.email}</span>
                    </div>
                  </Badge>
                </div>
              )}

              <div className="border rounded-md p-3 max-h-48 overflow-y-auto mt-2">
                <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>Chọn người thực hiện công việc</span>
                </div>
                <div className="space-y-2">
                  {mockUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleChange("assigneeId", user.id)}
                      className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-100 ${
                        formData.assigneeId === user.id ? "bg-blue-50 border border-blue-200" : ""
                      }`}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{user.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      {formData.assigneeId === user.id && (
                        <Badge variant="outline" className="text-xs">
                          Đã chọn
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading || !formData.assigneeId}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Tạo công việc
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
