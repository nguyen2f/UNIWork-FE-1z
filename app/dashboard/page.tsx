"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FolderKanban, CheckSquare, TrendingUp, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [projects, setProjects] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [projectsData, tasksData] = await Promise.all([api.getProjects(), api.getTasks()])
      setProjects(projectsData)
      setTasks(tasksData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      title: "Tổng dự án",
      value: projects.length,
      icon: FolderKanban,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Công việc",
      value: tasks.length,
      icon: CheckSquare,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Đang thực hiện",
      value: tasks.filter((t) => t.status === "in-progress").length,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Hoàn thành",
      value: tasks.filter((t) => t.status === "completed").length,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">ProManage Enterprise</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Xin chào, <span className="font-medium">{user?.name}</span>
              </span>
              <Button onClick={logout} variant="outline">
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Projects Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Dự án gần đây</CardTitle>
                <CardDescription>Quản lý và theo dõi tiến độ dự án</CardDescription>
              </div>
              <Button asChild>
                <Link href="/projects">Xem tất cả</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.slice(0, 3).map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          project.status === "in-progress"
                            ? "bg-yellow-100 text-yellow-700"
                            : project.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {project.status === "in-progress"
                          ? "Đang thực hiện"
                          : project.status === "completed"
                            ? "Hoàn thành"
                            : "Lên kế hoạch"}
                      </span>
                      <span className="text-xs text-muted-foreground">Tiến độ: {project.progress}%</span>
                    </div>
                  </div>
                  <div className="w-32">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
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

        {/* Tasks Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Công việc cần làm</CardTitle>
                <CardDescription>Các nhiệm vụ đang chờ xử lý</CardDescription>
              </div>
              <Button asChild variant="outline">
                <Link href="/tasks">Xem tất cả</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks
                .filter((t) => t.status !== "completed")
                .slice(0, 5)
                .map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`p-2 rounded ${
                        task.priority === "high"
                          ? "bg-red-100"
                          : task.priority === "medium"
                            ? "bg-yellow-100"
                            : "bg-blue-100"
                      }`}
                    >
                      <AlertCircle
                        className={`h-4 w-4 ${
                          task.priority === "high"
                            ? "text-red-600"
                            : task.priority === "medium"
                              ? "text-yellow-600"
                              : "text-blue-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        task.status === "in-progress" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {task.status === "in-progress" ? "Đang làm" : "Chờ xử lý"}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
