"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  FolderKanban,
  ListTodo,
  Plus,
  TrendingUp,
  Users,
  UserPlus,
} from "lucide-react"
import { useState } from "react"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { InviteTeamMemberDialog } from "@/components/invite-team-member-dialog"

export default function DashboardPage() {
  const [createProjectOpen, setCreateProjectOpen] = useState(false)
  const [createTaskOpen, setCreateTaskOpen] = useState(false)
  const [inviteTeamOpen, setInviteTeamOpen] = useState(false)

  const stats = [
    {
      title: "Active Projects",
      value: "12",
      change: "+2 this month",
      icon: FolderKanban,
      color: "text-blue-600",
    },
    {
      title: "Tasks Completed",
      value: "147",
      change: "+23 this week",
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      title: "Team Members",
      value: "28",
      change: "+4 new",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Pending Tasks",
      value: "34",
      change: "-8 from last week",
      icon: Clock,
      color: "text-orange-600",
    },
  ]

  const recentProjects = [
    {
      id: "1",
      name: "Website Redesign",
      progress: 75,
      status: "In Progress",
      team: 5,
      deadline: "2024-01-20",
    },
    {
      id: "2",
      name: "Mobile App Development",
      progress: 45,
      status: "In Progress",
      team: 8,
      deadline: "2024-02-15",
    },
    {
      id: "3",
      name: "Marketing Campaign",
      progress: 90,
      status: "In Progress",
      team: 4,
      deadline: "2024-01-10",
    },
  ]

  const upcomingTasks = [
    {
      id: "1",
      title: "Review design mockups",
      project: "Website Redesign",
      priority: "High",
      dueDate: "Today",
    },
    {
      id: "2",
      title: "Update API documentation",
      project: "Mobile App Development",
      priority: "Medium",
      dueDate: "Tomorrow",
    },
    {
      id: "3",
      title: "Client presentation",
      project: "Marketing Campaign",
      priority: "High",
      dueDate: "Jan 15",
    },
    {
      id: "4",
      title: "Code review session",
      project: "Mobile App Development",
      priority: "Low",
      dueDate: "Jan 16",
    },
  ]

  const teamActivity = [
    {
      user: "Sarah Johnson",
      action: "completed",
      target: "Design Review",
      time: "2 hours ago",
      avatar: "/placeholder-user.jpg",
    },
    {
      user: "Michael Chen",
      action: "created",
      target: "New API Endpoint",
      time: "4 hours ago",
      avatar: "/placeholder-user.jpg",
    },
    {
      user: "Emma Wilson",
      action: "updated",
      target: "Project Timeline",
      time: "5 hours ago",
      avatar: "/placeholder-user.jpg",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive"
      case "Medium":
        return "default"
      case "Low":
        return "secondary"
      default:
        return "default"
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {/* Quick Actions */}
          <div className="mb-6 flex gap-3">
            <Button onClick={() => setCreateProjectOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
            <Button onClick={() => setCreateTaskOpen(true)} variant="outline" className="gap-2">
              <ListTodo className="h-4 w-4" />
              Create Task
            </Button>
            <Button onClick={() => setInviteTeamOpen(true)} variant="outline" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Invite Team Member
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2 mb-6">
            {/* Recent Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderKanban className="h-5 w-5" />
                  Recent Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>{project.team} members</span>
                          <Calendar className="h-3 w-3 ml-2" />
                          <span>Due {project.deadline}</span>
                        </div>
                      </div>
                      <Badge variant="outline">{project.status}</Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListTodo className="h-5 w-5" />
                  Upcoming Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-start justify-between p-3 rounded-lg border">
                    <div className="space-y-1">
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">{task.project}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant={getPriorityColor(task.priority)}>{task.priority}</Badge>
                      <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Team Activity & Performance */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Team Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Team Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {teamActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={activity.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{activity.user[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>{" "}
                        <span className="text-muted-foreground">{activity.action}</span>{" "}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tasks Completion Rate</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <Progress value={87} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>On-time Delivery</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <Progress value={92} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Team Productivity</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <Progress value={78} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Budget Utilization</span>
                    <span className="font-medium">65%</span>
                  </div>
                  <Progress value={65} />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <CreateProjectDialog open={createProjectOpen} onOpenChange={setCreateProjectOpen} />
      <CreateTaskDialog open={createTaskOpen} onOpenChange={setCreateTaskOpen} />
      <InviteTeamMemberDialog open={inviteTeamOpen} onOpenChange={setInviteTeamOpen} />
    </div>
  )
}
