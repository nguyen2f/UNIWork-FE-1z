"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BarChart3, TrendingUp, Download, Calendar, Users, AlertTriangle,
  CheckCircle2, Clock, FolderKanban, Layers, Bug, Loader2
} from "lucide-react"
import { SidebarContent as Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import {
  fetchMemberWorkload,
  fetchOverdueItems,
  fetchProjectReport,
} from "@/services/report.service"
import type { MemberWorkloadDTO, OverdueItemDTO } from "@/types/report.types"
import type { ProjectReport } from "@/types/project.types"

export default function ReportsPage() {
  const [loading, setLoading] = useState(true)
  const [memberWorkload, setMemberWorkload] = useState<MemberWorkloadDTO[]>([])
  const [overdueItems, setOverdueItems] = useState<OverdueItemDTO[]>([])
  const [projectReports, setProjectReports] = useState<ProjectReport[]>([])
  const [selectedTab, setSelectedTab] = useState<"overview" | "workload" | "overdue">("overview")

  useEffect(() => {
    loadAllReports()
  }, [])

  const loadAllReports = async () => {
    setLoading(true)
    try {
      const [workloadRes, overdueRes, projectRes] = await Promise.allSettled([
        fetchMemberWorkload(),
        fetchOverdueItems(),
        fetchProjectReport(0, 20),
      ])

      if (workloadRes.status === "fulfilled") {
        const data = workloadRes.value
        setMemberWorkload(Array.isArray(data) ? data : (data as any)?.data ?? [])
      }
      if (overdueRes.status === "fulfilled") {
        const data = overdueRes.value
        setOverdueItems(Array.isArray(data) ? data : (data as any)?.data ?? [])
      }
      if (projectRes.status === "fulfilled") {
        const data = projectRes.value as any
        setProjectReports(data?.data ?? [])
      }
    } catch (err) {
      console.error("Load reports error:", err)
    } finally {
      setLoading(false)
    }
  }

  const totalTasks = memberWorkload.reduce((sum, m) => sum + (m.totalTasks || 0), 0)
  const totalCompleted = memberWorkload.reduce((sum, m) => sum + (m.completedTasks || 0), 0)
  const totalIssues = memberWorkload.reduce((sum, m) => sum + (m.totalIssues || 0), 0)
  const resolvedIssues = memberWorkload.reduce((sum, m) => sum + (m.resolvedIssues || 0), 0)

  const getOverdueSeverity = (days: number) => {
    if (days > 7) return "destructive"
    if (days > 3) return "default"
    return "secondary"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case "CRITICAL": return "bg-red-100 text-red-700"
      case "HIGH": return "bg-orange-100 text-orange-700"
      case "MEDIUM": return "bg-yellow-100 text-yellow-700"
      case "LOW": return "bg-green-100 text-green-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-3" />
              <p className="text-gray-500">Đang tải báo cáo...</p>
            </div>
          </main>
        </div>
      </div>
    )
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
                <Button variant="outline" onClick={loadAllReports}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Làm mới
                </Button>
              </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Tổng dự án</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{projectReports.length}</p>
                      <p className="text-sm text-blue-600 mt-1 flex items-center">
                        <FolderKanban className="h-3 w-3 mr-1" />
                        Đang theo dõi
                      </p>
                    </div>
                    <FolderKanban className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Tasks hoàn thành</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{totalCompleted}</p>
                      <p className="text-sm text-green-600 mt-1 flex items-center">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {totalTasks > 0 ? `${((totalCompleted / totalTasks) * 100).toFixed(0)}%` : "0%"} tổng
                      </p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Issues đã giải quyết</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{resolvedIssues}</p>
                      <p className="text-sm text-orange-600 mt-1 flex items-center">
                        <Bug className="h-3 w-3 mr-1" />
                        {totalIssues > 0 ? `${((resolvedIssues / totalIssues) * 100).toFixed(0)}%` : "0%"} tổng
                      </p>
                    </div>
                    <Bug className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Quá hạn</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{overdueItems.length}</p>
                      <p className="text-sm text-red-600 mt-1 flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Cần xử lý
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6">
              {[
                { key: "overview" as const, label: "Tổng quan dự án", icon: FolderKanban },
                { key: "workload" as const, label: "Khối lượng công việc", icon: Users },
                { key: "overdue" as const, label: "Quá hạn", icon: AlertTriangle },
              ].map((tab) => (
                <Button
                  key={tab.key}
                  variant={selectedTab === tab.key ? "default" : "outline"}
                  onClick={() => setSelectedTab(tab.key)}
                  className="gap-2"
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                  {tab.key === "overdue" && overdueItems.length > 0 && (
                    <Badge variant="destructive" className="ml-1 h-5 px-1.5 text-[10px]">
                      {overdueItems.length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>

            {/* Tab Content */}
            {selectedTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Project Progress */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FolderKanban className="h-5 w-5 text-blue-600" />
                      Tiến độ dự án
                    </CardTitle>
                    <CardDescription>Tình trạng tiến độ của các dự án đang thực hiện</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {projectReports.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <FolderKanban className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                        <p>Không có dữ liệu dự án</p>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        {projectReports.map((project, index) => (
                          <div key={project.project?.projectId ?? index} className="p-4 rounded-xl border bg-white hover:shadow-sm transition-shadow space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-gray-900">{project.project?.name}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {project.project?.status}
                                </Badge>
                              </div>
                              <span className="text-sm font-bold text-blue-600">{project.completedPercent}%</span>
                            </div>
                            <Progress value={project.completedPercent} className="h-2" />
                            <div className="flex justify-between text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>{project.countMember} thành viên</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>Đến: {project.project?.endDate}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedTab === "workload" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-600" />
                    Khối lượng công việc thành viên
                  </CardTitle>
                  <CardDescription>Thống kê tasks và issues của từng thành viên trong các dự án</CardDescription>
                </CardHeader>
                <CardContent>
                  {memberWorkload.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                      <p>Không có dữ liệu</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {memberWorkload.map((member, index) => {
                        const taskPercent = member.totalTasks > 0 ? (member.completedTasks / member.totalTasks * 100) : 0
                        const issuePercent = member.totalIssues > 0 ? (member.resolvedIssues / member.totalIssues * 100) : 0
                        return (
                          <div key={member.userId ?? index} className="p-4 rounded-xl border bg-white hover:shadow-sm transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                  {(member.userName || "?").charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">{member.userName}</p>
                                  <p className="text-xs text-gray-500">{member.projectCount ?? 0} dự án</p>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600 flex items-center gap-1">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                                    Tasks
                                  </span>
                                  <span className="font-medium">{member.completedTasks}/{member.totalTasks}</span>
                                </div>
                                <Progress value={taskPercent} className="h-1.5" />
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600 flex items-center gap-1">
                                    <Bug className="h-3.5 w-3.5 text-orange-500" />
                                    Issues
                                  </span>
                                  <span className="font-medium">{member.resolvedIssues}/{member.totalIssues}</span>
                                </div>
                                <Progress value={issuePercent} className="h-1.5" />
                              </div>
                            </div>

                            <div className="flex gap-2 mt-3 text-xs">
                              <Badge variant="secondary" className="gap-1">
                                <Clock className="h-3 w-3" />
                                {member.pendingTasks} pending
                              </Badge>
                              <Badge variant="secondary" className="gap-1">
                                <Layers className="h-3 w-3" />
                                {member.doingTasks} doing
                              </Badge>
                              <Badge variant="secondary" className="gap-1">
                                <Bug className="h-3 w-3" />
                                {member.openIssues} open
                              </Badge>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {selectedTab === "overdue" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Danh sách quá hạn
                    {overdueItems.length > 0 && (
                      <Badge variant="destructive" className="ml-2">{overdueItems.length}</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>Tasks và Issues đã quá hạn, sắp xếp theo số ngày quá hạn</CardDescription>
                </CardHeader>
                <CardContent>
                  {overdueItems.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-green-400" />
                      <p className="font-medium text-green-600">Không có mục nào quá hạn!</p>
                      <p className="text-sm text-gray-400 mt-1">Tất cả đang đúng tiến độ</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {overdueItems.map((item, index) => (
                        <div key={`${item.itemType}-${item.itemId}`} className="flex items-center gap-4 p-4 rounded-xl border bg-white hover:shadow-sm transition-shadow">
                          <div className="flex-shrink-0">
                            {item.itemType === "TASK" ? (
                              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                <Bug className="h-5 w-5 text-orange-600" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-sm text-gray-900 truncate">{item.title}</p>
                              <Badge variant="outline" className="text-[10px] h-4 flex-shrink-0">
                                {item.itemType}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <FolderKanban className="h-3 w-3" />
                                {item.projectName}
                              </span>
                              {item.assigneeName && (
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {item.assigneeName}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {item.dueDate}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(item.priority)}`}>
                              {item.priority}
                            </span>
                            <Badge variant={getOverdueSeverity(item.daysOverdue)} className="font-bold">
                              -{item.daysOverdue}d
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
