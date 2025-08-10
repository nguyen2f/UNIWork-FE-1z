"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Sidebar } from "../../../components/sidebar"
import { Header } from "../../../components/header"
import { useProjects } from "@/hooks/useProjects"
import Link from "next/link"

export default function CreateProjectPage() {
  const router = useRouter()
  const { createProject } = useProjects()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "planning",
    priority: "medium",
    budget: "",
    startDate: "",
    endDate: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const projectData = {
        ...formData,
        budget: formData.budget ? Number.parseFloat(formData.budget) : 0,
      }

      await createProject(projectData)
      router.push("/projects")
    } catch (err: any) {
      setError(err.message || "Không thể tạo dự án")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-8">
              <Link href="/projects">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Tạo dự án mới</h1>
                <p className="text-gray-600 mt-2">Điền thông tin để tạo dự án mới</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Thông tin dự án</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Label htmlFor="name">Tên dự án *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        required
                        className="mt-1"
                        placeholder="Nhập tên dự án"
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
                        placeholder="Mô tả chi tiết về dự án"
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
                      <Label htmlFor="budget">Ngân sách (VNĐ)</Label>
                      <Input
                        id="budget"
                        type="number"
                        value={formData.budget}
                        onChange={(e) => handleChange("budget", e.target.value)}
                        className="mt-1"
                        placeholder="0"
                        min="0"
                      />
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
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Link href="/projects">
                      <Button type="button" variant="outline">
                        Hủy
                      </Button>
                    </Link>
                    <Button type="submit" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Tạo dự án
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
