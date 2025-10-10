"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, FolderKanban, ListTodo, LogOut, Calendar } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const { user, token, logout, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/auth/login")
    }
  }, [token, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">ProManage</h1>
              <p className="text-sm text-muted-foreground">Project Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button onClick={logout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Chào mừng trở lại, {user.name}!</h2>
          <p className="text-muted-foreground">Đây là tổng quan về các dự án của bạn</p>
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
              <ListTodo className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-muted-foreground">23 đã hoàn thành trong tuần này</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Thành viên</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Số lượng thành viên</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đang họp</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Số cuộc họp đang diễn ra</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Dự án gần đây</CardTitle>
              <CardDescription>Các dự án bạn đang tham gia</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Website Redesign", status: "Đang tiến hành", team: 5, progress: 65 },
                { name: "Mobile App Development", status: "Đang tiến hành", team: 3, progress: 45 },
                { name: "Marketing Campaign", status: "Gần hoàn thành", team: 7, progress: 90 },
              ].map((project) => (
                <div
                  key={project.name}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{project.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {project.team} thành viên
                      </span>
                      <span>{project.status}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{project.progress}%</div>
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
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Thiết kế wireframe", due: "2 ngày", priority: "Cao" },
                  { name: "Review code", due: "3 ngày", priority: "Trung bình" },
                  { name: "Viết tài liệu", due: "5 ngày", priority: "Cao" },
                ].map((task) => (
                  <div
                    key={task.name}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{task.name}</h3>
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
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
