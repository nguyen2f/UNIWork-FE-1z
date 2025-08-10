"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, Download, Calendar } from "lucide-react"
import { Sidebar } from "../../components/sidebar"
import { Header } from "../../components/header"

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("month")

  const projectStats = [
    { name: "Website Redesign", progress: 65, status: "active", tasks: 12, completed: 8 },
    { name: "Mobile App Development", progress: 40, status: "active", tasks: 15, completed: 6 },
    { name: "API Integration", progress: 85, status: "active", tasks: 8, completed: 7 },
    { name: "Database Migration", progress: 100, status: "completed", tasks: 10, completed: 10 },
  ]

  const teamStats = [
    { name: "Senior Developer", tasksCompleted: 24, tasksInProgress: 3, efficiency: 92 },
    { name: "UI Designer", tasksCompleted: 18, tasksInProgress: 2, efficiency: 88 },
    { name: "Project Manager", tasksCompleted: 15, tasksInProgress: 5, efficiency: 85 },
    { name: "QA Engineer", tasksCompleted: 12, tasksInProgress: 1, efficiency: 95 },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "on-hold":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Đang thực hiện"
      case "completed":
        return "Hoàn thành"
      case "on-hold":
        return "Tạm dừng"
      default:
        return status
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
                <p className="text-gray-600 mt-2">Theo dõi tiến độ và hiệu suất của các dự án</p>
              </div>
              <div className="flex space-x-2">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Tuần này</SelectItem>
                    <SelectItem value="month">Tháng này</SelectItem>
                    <SelectItem value="quarter">Quý này</SelectItem>
                    <SelectItem value="year">Năm này</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Xuất báo cáo
                </Button>
              </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Tổng dự án</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
                      <p className="text-sm text-green-600 mt-1 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +2 từ tháng trước
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Hoàn thành</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">8</p>
                      <p className="text-sm text-green-600 mt-1 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +3 từ tháng trước
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Đang thực hiện</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">4</p>
                      <p className="text-sm text-blue-600 mt-1">Đúng kế hoạch</p>
                    </div>
                    <Calendar className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Hiệu suất team</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">89%</p>
                      <p className="text-sm text-green-600 mt-1 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +5% từ tháng trước
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Project Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Tiến độ dự án</CardTitle>
                  <CardDescription>Tình trạng tiến độ của các dự án đang thực hiện</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {projectStats.map((project, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{project.name}</span>
                            <Badge className={getStatusColor(project.status)}>{getStatusText(project.status)}</Badge>
                          </div>
                          <span className="text-sm font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>
                            {project.completed}/{project.tasks} công việc hoàn thành
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Team Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Hiệu suất thành viên</CardTitle>
                  <CardDescription>Thống kê công việc và hiệu suất của từng thành viên</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {teamStats.map((member, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{member.name}</span>
                          <span className="text-sm font-medium">{member.efficiency}%</span>
                        </div>
                        <Progress value={member.efficiency} className="h-2" />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Hoàn thành: {member.tasksCompleted}</span>
                          <span>Đang làm: {member.tasksInProgress}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Trends */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Xu hướng theo tháng</CardTitle>
                <CardDescription>Biểu đồ thống kê tiến độ và hiệu suất theo thời gian</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Biểu đồ sẽ được hiển thị ở đây</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Tích hợp với thư viện biểu đồ như Chart.js hoặc Recharts
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
