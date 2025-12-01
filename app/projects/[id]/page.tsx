"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Users,
  CheckSquare,
  MessageSquare,
  MoreHorizontal,
  Calendar,
  DollarSign,
} from "lucide-react"
import { Sidebar } from "../../../components/sidebar"
import { Header } from "../../../components/header"
import { ProjectMembers } from "../../../components/project-members"
import { ProjectMessages } from "../../../components/project-messages"
import Link from "next/link"
import type { Project } from "@/types"
import { mockProjects, mockTasks, mockUsers } from "@/lib/data"
import { ProjectDetailTasks } from "../../../components/project-detail-tasks"
import {getDetailProject} from "@/app/services/projectService";

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project>()
  const [loading, setLoading] = useState(true)
  const projectId = Number(params.id);

  useEffect(() => {
    fetchProject(projectId)
  }, []);

  const fetchProject = async (projectId: number) => {
    try {
      setLoading(true)
      const response = await getDetailProject(projectId)
      setProject(response.data)
      console.log(response.data)
    } catch (error) {
      console.error("Failed to fetch project details:", error)
    } finally {
      setLoading(false)
    }
  }



  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLANNING":
        return "bg-yellow-100 text-yellow-800"
      case "ACTIVE":
        return "bg-green-100 text-green-800"
      case "COMPLETED":
        return "bg-blue-100 text-blue-800"
      case "ON-HOLD":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "LOW":
        return "bg-green-100 text-green-800"
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800"
      case "HIGH":
        return "bg-orange-100 text-orange-800"
      case "CRITICAL":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "PLANNING":
        return "Lên kế hoạch"
      case "ACTIVE":
        return "Đang thực hiện"
      case "COMPLETED":
        return "Hoàn thành"
      case "ON-HOLD":
        return "Tạm dừng"
      default:
        return status
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "LOW":
        return "LOW"
      case "MEDIUM":
        return "MEDIUM"
      case "HIGH":
        return "HIGH"
      case "CRITICAL":
        return "CRITICAL"
      default:
        return priority
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div>Đang tải...</div>
          </main>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div>Không tìm thấy dự án</div>
          </main>
        </div>
      </div>
    )
  }

  console.log(project)



  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <Link href="/projects">
                  <Button variant="outline" size="icon">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                  <p className="text-gray-600 mt-2">{project.description}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <MoreHorizontal className="h-4 w-4 mr-2" />
                    Hành động
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa dự án
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Users className="h-4 w-4 mr-2" />
                    Quản lý thành viên
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa dự án
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Project Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Status</p>
                      <Badge className={`mt-2 ${getStatusColor(project.status)}`}>
                        {getStatusText(project.status)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Priority</p>
                      <Badge className={`mt-2 ${getPriorityColor(project.priority)}`}>
                        {getPriorityText(project.priority)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Risk Level</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{project.riskLevel}</p>
                    </div>
                  </div>
                  <Progress value={project.progress} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Deadline</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {project.endDate}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Project Details */}
            <Tabs defaultValue="tasks" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="tasks" className="flex items-center">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Công việc
                </TabsTrigger>
                <TabsTrigger value="members" className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Thành viên
                </TabsTrigger>
                <TabsTrigger value="messages" className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Tin nhắn
                </TabsTrigger>
                <TabsTrigger value="overview" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Tổng quan
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tasks" className="mt-6">
                <ProjectDetailTasks projectId={project.projectId} tasks={project.tasks} />
              </TabsContent>

              <TabsContent value="members" className="mt-6">
                <ProjectMembers projectId={project.projectId} members={project.members} />
              </TabsContent>

              <TabsContent value="messages" className="mt-6">
                <ProjectMessages projectId={project.projectId} />
              </TabsContent>

              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Thông tin dự án</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Ngày bắt đầu</p>
                        <p className="text-sm text-gray-900">{project.startDate}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Ngày kết thúc</p>
                        <p className="text-sm text-gray-900">{project.endDate}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Người tạo</p>
                        <p className="text-sm text-gray-900">Project Manager</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Ngày tạo</p>
                        <p className="text-sm text-gray-900">
                          {new Date(project.createdAt).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/*<Card>*/}
                  {/*  <CardHeader>*/}
                  {/*    <CardTitle>Thống kê</CardTitle>*/}
                  {/*  </CardHeader>*/}
                  {/*  <CardContent className="space-y-4">*/}
                  {/*    <div className="flex justify-between">*/}
                  {/*      <span className="text-sm text-gray-600">Tổng số công việc</span>*/}
                  {/*      <span className="text-sm font-medium">{project.tasks.length}</span>*/}
                  {/*    </div>*/}
                  {/*    <div className="flex justify-between">*/}
                  {/*      <span className="text-sm text-gray-600">Hoàn thành</span>*/}
                  {/*      <span className="text-sm font-medium text-green-600">*/}
                  {/*        {project.tasks.filter((t) => t.status === "completed").length}*/}
                  {/*      </span>*/}
                  {/*    </div>*/}
                  {/*    <div className="flex justify-between">*/}
                  {/*      <span className="text-sm text-gray-600">Đang thực hiện</span>*/}
                  {/*      <span className="text-sm font-medium text-blue-600">*/}
                  {/*        {project.tasks.filter((t) => t.status === "in-progress").length}*/}
                  {/*      </span>*/}
                  {/*    </div>*/}
                  {/*    <div className="flex justify-between">*/}
                  {/*      <span className="text-sm text-gray-600">Thành viên</span>*/}
                  {/*      <span className="text-sm font-medium">{project.members.length}</span>*/}
                  {/*    </div>*/}
                  {/*  </CardContent>*/}
                  {/*</Card>*/}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
