"use client"

import { useState } from "react"
import {
  FolderKanban,
  CheckSquare,
  Users,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  DollarSign,
  Target,
  Activity,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { InviteTeamMemberDialog } from "@/components/invite-team-member-dialog"
import Link from "next/link"

export default function DashboardPage() {
  const [activeProjects] = useState([
    {
      id: "1",
      name: "Enterprise CRM Migration",
      progress: 78,
      status: "on-track",
      dueDate: "2024-02-28",
      team: ["JD", "SM", "AL"],
      priority: "high",
    },
    {
      id: "2",
      name: "Digital Transformation Initiative",
      progress: 45,
      status: "at-risk",
      dueDate: "2024-03-15",
      team: ["RW", "KL", "MJ"],
      priority: "critical",
    },
    {
      id: "3",
      name: "SOC 2 Compliance Implementation",
      progress: 92,
      status: "on-track",
      dueDate: "2024-02-20",
      team: ["DK", "PL"],
      priority: "high",
    },
    {
      id: "4",
      name: "Global ERP Rollout Phase 2",
      progress: 34,
      status: "delayed",
      dueDate: "2024-04-30",
      team: ["MR", "JB", "KW"],
      priority: "medium",
    },
  ])

  const [recentActivity] = useState([
    {
      id: "1",
      user: "Sarah Miller",
      avatar: "SM",
      action: "completed task",
      target: "Update user authentication flow",
      project: "CRM Migration",
      time: "5 minutes ago",
    },
    {
      id: "2",
      user: "David Kim",
      avatar: "DK",
      action: "uploaded document",
      target: "Security Audit Report Q1",
      project: "SOC 2 Compliance",
      time: "1 hour ago",
    },
    {
      id: "3",
      user: "Alex Johnson",
      avatar: "AJ",
      action: "commented on",
      target: "API Integration Milestone",
      project: "Digital Transformation",
      time: "2 hours ago",
    },
    {
      id: "4",
      user: "Rachel Wong",
      avatar: "RW",
      action: "assigned task to",
      target: "John Doe",
      project: "ERP Rollout",
      time: "3 hours ago",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-track":
        return "text-green-600 bg-green-100"
      case "at-risk":
        return "text-yellow-600 bg-yellow-100"
      case "delayed":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your projects.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Active Projects</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">18</p>
                      <p className="text-sm text-green-600 mt-1 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +12% from last month
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FolderKanban className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Completed Tasks</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">142</p>
                      <p className="text-sm text-green-600 mt-1 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +8% from last week
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckSquare className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Team Members</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">24</p>
                      <p className="text-sm text-purple-600 mt-1 flex items-center">
                        <Activity className="h-3 w-3 mr-1" />
                        18 active now
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Budget Used</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">$2.4M</p>
                      <p className="text-sm text-orange-600 mt-1">68% of allocated</p>
                    </div>
                    <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Active Projects</CardTitle>
                      <CardDescription>Track progress and status of ongoing initiatives</CardDescription>
                    </div>
                    <Link href="/projects">
                      <Button variant="outline" size="sm">
                        View All
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeProjects.map((project) => (
                        <div
                          key={project.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{project.name}</h3>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                                  {project.status.replace("-", " ").toUpperCase()}
                                </Badge>
                                <Badge className={`text-xs border ${getPriorityColor(project.priority)}`}>
                                  {project.priority.toUpperCase()}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex -space-x-2">
                              {project.team.map((member, idx) => (
                                <Avatar key={idx} className="h-8 w-8 border-2 border-white">
                                  <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                                    {member}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium">{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                Due: {project.dueDate}
                              </span>
                              <span>{project.team.length} members</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CreateProjectDialog
                      trigger={
                        <Button className="w-full justify-start bg-transparent" variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          New Project
                        </Button>
                      }
                    />
                    <CreateTaskDialog
                      trigger={
                        <Button className="w-full justify-start bg-transparent" variant="outline">
                          <CheckSquare className="h-4 w-4 mr-2" />
                          Create Task
                        </Button>
                      }
                    />
                    <InviteTeamMemberDialog
                      trigger={
                        <Button className="w-full justify-start bg-transparent" variant="outline">
                          <Users className="h-4 w-4 mr-2" />
                          Invite Team Member
                        </Button>
                      }
                    />
                    <Link href="/reports">
                      <Button className="w-full justify-start bg-transparent" variant="outline">
                        <Activity className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="h-5 w-5 mr-2" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                              {activity.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm">
                              <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                              <span className="font-medium">{activity.target}</span>
                            </p>
                            <p className="text-xs text-gray-500">{activity.project}</p>
                            <p className="text-xs text-gray-400">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
