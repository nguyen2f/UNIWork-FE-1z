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
  TrendingUp,
} from "lucide-react"

export default function DashboardPage() {
  const { user, token, logout, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log("Dashboard - Auth state:", { user, token, isLoading, isAuthenticated })

    if (!isLoading && !isAuthenticated) {
      console.log("Not authenticated, redirecting to login...")
      router.push("/auth/login")
    }
  }, [isAuthenticated, isLoading, router, user, token])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-lg text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Đang chuyển hướng...</p>
        </div>
      </div>
    )
  }

  const stats = [
    { title: "Tổng dự án", value: "12", icon: FolderKanban, color: "text-blue-600", bgColor: "bg-blue-100" },
    { title: "Hoàn thành", value: "48", icon: CheckCircle2, color: "text-green-600", bgColor: "bg-green-100" },
    { title: "Đang thực hiện", value: "24", icon: Clock, color: "text-yellow-600", bgColor: "bg-yellow-100" },
    { title: "Cần xử lý", value: "6", icon: AlertCircle, color: "text-red-600", bgColor: "bg-red-100" },
  ]

  const recentProjects = [
    { name: "Website Redesign", progress: 75, status: "Đang thực hiện", team: 8, dueDate: "15/12/2024" },
    { name: "Mobile App Development", progress: 45, status: "Đang thực hiện", team: 6, dueDate: "20/12/2024" },
    { name: "Marketing Campaign", progress: 90, status: "Gần hoàn thành", team: 5, dueDate: "10/12/2024" },
    { name: "System Upgrade", progress: 30, status: "Mới bắt đầu", team: 4, dueDate: "25/12/2024" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                ProManage
              </h1>
              <p className="text-sm text-muted-foreground">Enterprise Edition</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={logout} className="gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2">Xin chào, {user.name}! 👋</h2>
          <p className="text-lg text-muted-foreground">Đây là tổng quan về các dự án của bạn hôm nay</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+12% so với tháng trước</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button
            className="h-auto py-6 flex flex-col items-start bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            size="lg"
          >
            <FolderKanban className="h-8 w-8 mb-2" />
            <span className="font-semibold text-lg">Tạo dự án mới</span>
            <span className="text-xs opacity-90">Bắt đầu một dự án mới</span>
          </Button>
          <Button
            className="h-auto py-6 flex flex-col items-start bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            size="lg"
          >
            <Calendar className="h-8 w-8 mb-2" />
            <span className="font-semibold text-lg">Xem lịch trình</span>
            <span className="text-xs opacity-90">Quản lý công việc</span>
          </Button>
          <Button
            className="h-auto py-6 flex flex-col items-start bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
            size="lg"
          >
            <BarChart3 className="h-8 w-8 mb-2" />
            <span className="font-semibold text-lg">Xem báo cáo</span>
            <span className="text-xs opacity-90">Phân tích thống kê</span>
          </Button>
        </div>

        {/* Recent Projects */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Dự án gần đây</CardTitle>
                <CardDescription className="text-base">Các dự án bạn đang tham gia</CardDescription>
              </div>
              <Button variant="outline">Xem tất cả</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div
                  key={project.name}
                  className="flex items-center justify-between p-5 border-2 rounded-xl hover:border-primary hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{project.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {project.team} thành viên
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Hạn: {project.dueDate}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {project.status}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right ml-6">
                    <div className="text-3xl font-bold text-primary">{project.progress}%</div>
                    <div className="text-xs text-muted-foreground mt-1">Hoàn thành</div>
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
