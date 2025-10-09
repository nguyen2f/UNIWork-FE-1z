"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, LogOut, FolderKanban, Users, CheckSquare, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const { user, token, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!token) {
      router.push("/auth/login")
    }
  }, [token, router])

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Đang tải...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">UniWork</h1>
              <p className="text-sm text-muted-foreground">Project Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="outline" size="icon" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Chào mừng trở lại, {user.name}!</h2>
          <p className="text-muted-foreground">Đây là tổng quan về các dự án và công việc của bạn</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng dự án</CardTitle>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 từ tháng trước</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Công việc</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-muted-foreground">24 đã hoàn thành</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Thành viên</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">+4 thành viên mới</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hiệu suất</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">+5% từ tuần trước</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Dự án gần đây</CardTitle>
              <CardDescription>Các dự án bạn đang làm việc</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Website Redesign", progress: 75, status: "Đang tiến hành" },
                { name: "Mobile App Development", progress: 45, status: "Đang tiến hành" },
                { name: "Marketing Campaign", progress: 90, status: "Sắp hoàn thành" },
              ].map((project, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground">{project.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{project.progress}%</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Công việc sắp đến hạn</CardTitle>
              <CardDescription>Cần hoàn thành trong tuần này</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Thiết kế giao diện trang chủ", due: "2 ngày", priority: "Cao" },
                { name: "Viết tài liệu API", due: "3 ngày", priority: "Trung bình" },
                { name: "Review code module thanh toán", due: "5 ngày", priority: "Cao" },
              ].map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{task.name}</p>
                    <p className="text-sm text-muted-foreground">Còn {task.due}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      task.priority === "Cao" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
