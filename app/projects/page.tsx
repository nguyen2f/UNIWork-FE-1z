"use client"

import { useState } from "react"
import { Search, MoreHorizontal, Calendar, Users, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "../../components/sidebar"
import { Header } from "../../components/header"
import { CreateProjectDialog } from "../../components/create-project-dialog"
import { EditProjectDialog } from "../../components/edit-project-dialog"
import { ViewLayoutToggle } from "../../components/view-layout-toggle"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { mockProjects, mockUsers } from "@/lib/data"

export default function ProjectsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [view, setView] = useState<"grid" | "list">("grid")

  const [projects] = useState(() => {
    return mockProjects.map((project) => ({
      ...project,
      members: mockUsers.slice(0, 3).map((user) => ({
        userId: user.id,
        projectId: project.id,
        role:
          user.role === "admin"
            ? ("owner" as const)
            : user.role === "manager"
              ? ("manager" as const)
              : ("member" as const),
        joinedAt: "2024-02-01T00:00:00Z",
        user,
      })),
    }))
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "active":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "planning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "on-hold":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-300"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 border-green-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "planning":
        return "Lên kế hoạch"
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

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "low":
        return "Thấp"
      case "medium":
        return "Trung bình"
      case "high":
        return "Cao"
      case "critical":
        return "Khẩn cấp"
      default:
        return priority
    }
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleDeleteProject = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa dự án này?")) {
      console.log("Delete project:", id)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Danh sách dự án</h1>
                <p className="text-gray-600 mt-2">Quản lý tất cả các dự án của tổ chức</p>
              </div>
              <CreateProjectDialog />
            </div>

            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm dự án..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="planning">Lên kế hoạch</SelectItem>
                    <SelectItem value="active">Đang thực hiện</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                    <SelectItem value="on-hold">Tạm dừng</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Độ ưu tiên" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="low">Thấp</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="high">Cao</SelectItem>
                    <SelectItem value="critical">Khẩn cấp</SelectItem>
                  </SelectContent>
                </Select>
                <ViewLayoutToggle view={view} onViewChange={setView} />
              </div>
            </div>

            {view === "grid" ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredProjects.map((project) => (
                  <Card
                    key={project.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Link href={`/projects/${project.id}`}>
                              <CardTitle className="text-lg hover:text-blue-600">{project.name}</CardTitle>
                            </Link>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => router.push(`/projects/${project.id}`)}>
                                  Xem chi tiết
                                </DropdownMenuItem>
                                <EditProjectDialog
                                  project={project}
                                  trigger={
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Chỉnh sửa</DropdownMenuItem>
                                  }
                                />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteProject(project.id)}
                                  className="text-red-600"
                                >
                                  Xóa dự án
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <CardDescription className="text-sm line-clamp-2 mb-3">{project.description}</CardDescription>

                          <div className="flex items-center gap-2 mb-3">
                            <span
                              className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(project.status)}`}
                            >
                              {getStatusText(project.status)}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-md text-xs font-medium border ${getPriorityColor(project.priority)}`}
                            >
                              {getPriorityText(project.priority)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tiến độ</span>
                          <span className="font-medium">{project.progress || 0}%</span>
                        </div>
                        <Progress value={project.progress || 0} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Hạn: {new Date(project.endDate).toLocaleDateString("vi-VN")}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-600">
                            <DollarSign className="h-4 w-4 mr-2" />
                            <span>{new Intl.NumberFormat("vi-VN").format(project.budget || 0)} VNĐ</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          Nhóm ({project.members?.length || 0} thành viên)
                        </div>
                        <div className="flex -space-x-2">
                          {project.members?.slice(0, 3).map((member, idx) => (
                            <Avatar key={idx} className="h-8 w-8 border-2 border-white">
                              <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                                {member.user?.avatar || "U"}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {(project.members?.length || 0) > 3 && (
                            <div className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                              <span className="text-xs text-gray-600">+{(project.members?.length || 0) - 3}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <Link href={`/projects/${project.id}`}>
                              <h3 className="text-lg font-semibold hover:text-blue-600">{project.name}</h3>
                            </Link>
                            <span
                              className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(project.status)}`}
                            >
                              {getStatusText(project.status)}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-md text-xs font-medium border ${getPriorityColor(project.priority)}`}
                            >
                              {getPriorityText(project.priority)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-1">{project.description}</p>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Progress</p>
                            <p className="text-lg font-semibold">{project.progress}%</p>
                          </div>

                          <div className="flex -space-x-2">
                            {project.members?.slice(0, 3).map((member, idx) => (
                              <Avatar key={idx} className="h-8 w-8 border-2 border-white">
                                <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                                  {member.user?.avatar || "U"}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/projects/${project.id}`)}>
                                Xem chi tiết
                              </DropdownMenuItem>
                              <EditProjectDialog
                                project={project}
                                trigger={
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Chỉnh sửa</DropdownMenuItem>
                                }
                              />
                              <DropdownMenuItem
                                onClick={() => handleDeleteProject(project.id)}
                                className="text-red-600"
                              >
                                Xóa dự án
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Không tìm thấy dự án nào</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
