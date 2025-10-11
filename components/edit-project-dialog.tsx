"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import { X, Loader2, Users } from "lucide-react"
import { mockUsers } from "@/lib/data"
import { toast } from "sonner"
import type { Project } from "@/types"

interface EditProjectDialogProps {
  trigger?: React.ReactNode
  project: Project
  onSuccess?: () => void
}

export function EditProjectDialog({ trigger, project, onSuccess }: EditProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "planning",
    priority: "medium",
    budget: "",
    startDate: "",
    endDate: "",
  })

  useEffect(() => {
    if (open && project) {
      setFormData({
        name: project.name,
        description: project.description,
        status: project.status,
        priority: project.priority,
        budget: project.budget?.toString() || "",
        startDate: project.startDate?.split("T")[0] || "",
        endDate: project.endDate?.split("T")[0] || "",
      })
      setSelectedMembers(project.members?.map((m) => m.userId) || [])
    }
  }, [open, project])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleMember = (userId: string) => {
    setSelectedMembers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedProject = {
        ...project,
        ...formData,
        budget: formData.budget ? Number.parseFloat(formData.budget) : 0,
        members: selectedMembers.map((userId) => ({
          userId,
          projectId: project.id,
          role: "member" as const,
          joinedAt: new Date().toISOString(),
          user: mockUsers.find((u) => u.id === userId)!,
        })),
        updatedAt: new Date().toISOString(),
      }

      console.log("Updated project:", updatedProject)
      toast.success("Cập nhật dự án thành công!")

      setOpen(false)
      onSuccess?.()
    } catch (error) {
      toast.error("Không thể cập nhật dự án")
    } finally {
      setLoading(false)
    }
  }

  const selectedUsers = mockUsers.filter((user) => selectedMembers.includes(user.id))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || <Button variant="outline">Chỉnh sửa</Button>}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa dự án</DialogTitle>
          <DialogDescription>Cập nhật thông tin dự án</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="name">Tên dự án *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                className="mt-1"
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
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Lên kế hoạch</SelectItem>
                  <SelectItem value="active">Đang thực hiện</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="on-hold">Tạm dừng</SelectItem>
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

            <div>
              <Label htmlFor="startDate">Ngày bắt đầu</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="endDate">Ngày kết thúc</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="budget">Ngân sách (VNĐ)</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget}
                onChange={(e) => handleChange("budget", e.target.value)}
                className="mt-1"
                min="0"
              />
            </div>

            <div className="md:col-span-2">
              <Label>Thành viên</Label>
              <div className="mt-2 space-y-2">
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedUsers.map((user) => (
                    <Badge key={user.id} variant="secondary" className="pl-2 pr-1 py-1">
                      <Avatar className="h-5 w-5 mr-2">
                        <AvatarFallback className="text-xs">{user.avatar}</AvatarFallback>
                      </Avatar>
                      {user.name}
                      <button
                        type="button"
                        onClick={() => toggleMember(user.id)}
                        className="ml-2 hover:bg-gray-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>

                <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
                  <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>Chọn thành viên tham gia dự án</span>
                  </div>
                  <div className="space-y-2">
                    {mockUsers.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => toggleMember(user.id)}
                        className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-100 ${
                          selectedMembers.includes(user.id) ? "bg-blue-50 border border-blue-200" : ""
                        }`}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{user.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        {selectedMembers.includes(user.id) && (
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
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cập nhật
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
