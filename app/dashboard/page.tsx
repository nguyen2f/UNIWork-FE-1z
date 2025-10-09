"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Building2,
  Users,
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertCircle,
  LogOut,
  BarChart3,
  Calendar,
} from "lucide-react"

export default function DashboardPage() {
  const { user, token, logout, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/auth/login")
    }
  }, [token, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    )
  }

  const stats = [
    { title: "Tổng dự án", value: "12", icon: FolderKanban, color: "text-blue-600" },
    { title: "Công việc hoàn thành", value: "48", icon: CheckCircle2, color: "text-green-600" },
    { title: "Đang thực hiện", value: "24", icon: Clock, color: "text-yellow-600" },
    { title: "Cần xử lý", value: "6", icon: AlertCircle, color: "text-red-600" },
  ]

  const recentProjects = [
    { name: "Website Redesign", progress: 75, status: "Đang thực hiện", team: 8 },
    { name: "Mobile App Development", progress: 45, status: "Đang thực hiện", team: 6 },
    { name: "Marketing Campaign", progress: 90, status: "Gần hoàn thành", team: 5 },
    { name: "System Upgrade", progress: 30, status: "Mới bắt đầu", team: 4 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">ProManage</h1>
              <p className="text-sm text-muted-foreground">Quản lý dự án</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Xin chào, {user.name}! 👋</h2>
          <p className="text-muted-foreground">Đây là tổng quan về các dự án của bạn</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button className="h-auto py-4 flex flex-col items-start bg-transparent" variant="outline">
            <FolderKanban className="h-6 w-6 mb-2 text-primary" />
            <span className="font-semibold">Dự án mới</span>
            <span className="text-xs text-muted-foreground">Tạo dự án mới</span>
          </Button>
          <Button className="h-auto py-4 flex flex-col items-start bg-transparent" variant="outline">
            <Calendar className="h-6 w-6 mb-2 text-primary" />
            <span className="font-semibold">Lịch làm việc</span>
            <span className="text-xs text-muted-foreground">Xem lịch trình</span>
          </Button>
          <Button className="h-auto py-4 flex flex-col items-start bg-transparent" variant="outline">
            <BarChart3 className="h-6 w-6 mb-2 text-primary" />
            <span className="font-semibold">Báo cáo</span>
            <span className="text-xs text-muted-foreground">Xem thống kê</span>
          </Button>
        </div>

        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Dự án gần đây</CardTitle>
            <CardDescription>Các dự án bạn đang tham gia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div
                  key={project.name}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{project.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {project.team} thành viên
                      </span>
                      <span>{project.status}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{project.progress}%</div>
                    <div className="w-24 h-2 bg-secondary rounded-full mt-2">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
