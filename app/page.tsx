"use client"

import { useState } from "react"
import { CalendarDays, CheckCircle2, Clock, Plus, TrendingUp, Users, AlertTriangle, DollarSign, Target, Activity } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sidebar } from "../components/sidebar"
import { Header } from "../components/header"

export default function Dashboard() {
  const [projects] = useState([
    {
      id: 1,
      name: "Enterprise CRM Migration",
      description: "Migration of legacy CRM system to Salesforce with data integration and user training",
      progress: 78,
      dueDate: "2024-03-15",
      status: "On Track",
      priority: "Critical",
      team: ["JD", "SM", "AL", "RK", "MH"],
      tasks: { completed: 24, total: 31 },
      budget: { allocated: 250000, spent: 195000 },
      client: "Acme Corporation",
      department: "IT Operations",
    },
    {
      id: 2,
      name: "Digital Transformation Initiative",
      description: "Company-wide digital transformation including process automation and cloud migration",
      progress: 45,
      dueDate: "2024-06-30",
      status: "In Progress",
      priority: "High",
      team: ["RW", "KL", "MJ", "TH", "NK", "LS"],
      tasks: { completed: 18, total: 40 },
      budget: { allocated: 500000, spent: 225000 },
      client: "Internal",
      department: "Digital Strategy",
    },
    {
      id: 3,
      name: "Security Compliance Audit",
      description: "SOC 2 Type II compliance audit and implementation of security controls",
      progress: 92,
      dueDate: "2024-02-28",
      status: "Nearly Complete",
      priority: "Critical",
      team: ["DK", "PL", "AM"],
      tasks: { completed: 23, total: 25 },
      budget: { allocated: 150000, spent: 138000 },
      client: "Internal",
      department: "Security & Compliance",
    },
  ])

  const [recentActivities] = useState([
    { 
      id: 1, 
      title: "Security audit documentation completed", 
      project: "Security Compliance Audit", 
      priority: "Critical", 
      time: "2 hours ago",
      user: "David Kim",
      type: "milestone"
    },
    { 
      id: 2, 
      title: "CRM data migration phase 2 started", 
      project: "Enterprise CRM Migration", 
      priority: "High", 
      time: "4 hours ago",
      user: "Sarah Miller",
      type: "update"
    },
    { 
      id: 3, 
      title: "Budget approval received for Q2 initiatives", 
      project: "Digital Transformation", 
      priority: "Medium", 
      time: "6 hours ago",
      user: "John Doe",
      type: "approval"
    },
    { 
      id: 4, 
      title: "Stakeholder review meeting scheduled", 
      project: "Enterprise CRM Migration", 
      priority: "High", 
      time: "8 hours ago",
      user: "Rachel Wong",
      type: "meeting"
    },
  ])

  const stats = [
    { 
      title: "Active Projects", 
      value: "18", 
      icon: Target, 
      change: "+3 from last quarter",
      trend: "up",
      color: "blue"
    },
    { 
      title: "Total Budget", 
      value: "$2.4M", 
      icon: DollarSign, 
      change: "15% of annual budget",
      trend: "neutral",
      color: "green"
    },
    { 
      title: "Team Utilization", 
      value: "87%", 
      icon: Users, 
      change: "+5% from last month",
      trend: "up",
      color: "purple"
    },
    { 
      title: "At Risk Projects", 
      value: "2", 
      icon: AlertTriangle, 
      change: "-1 from last week",
      trend: "down",
      color: "red"
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Track":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Nearly Complete":
        return "bg-purple-100 text-purple-800"
      case "At Risk":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
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
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>
              <p className="text-gray-600 mt-2">Real-time insights into project performance and organizational metrics</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                        <p className="text-sm text-gray-500 mt-1 flex items-center">
                          <Activity className="h-3 w-3 mr-1" />
                          {stat.change}
                        </p>
                      </div>
                      <div className={`h-12 w-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                        <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Strategic Projects */}
              <div className="lg:col-span-2">
                <Card className="shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100">
                    <div>
                      <CardTitle className="text-xl">Strategic Projects</CardTitle>
                      <CardDescription>High-priority initiatives and their current status</CardDescription>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      New Project
                    </Button>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {projects.map((project) => (
                        <div key={project.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-gray-900 text-lg">{project.name}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                  {project.status}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(project.priority)}`}>
                                  {project.priority}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <CalendarDays className="h-4 w-4 mr-1" />
                                  Due {project.dueDate}
                                </span>
                                <span>Client: {project.client}</span>
                                <span>Dept: {project.department}</span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium">{project.progress}%</span>
                              </div>
                              <Progress value={project.progress} className="h-2" />
                            </div>
                            
                            <div className="text-sm">
                              <div className="text-gray-600 mb-1">Budget Status</div>
                              <div className="font-medium">
                                ${(project.budget.spent / 1000).toFixed(0)}K / ${(project.budget.allocated / 1000).toFixed(0)}K
                              </div>
                              <div className="text-xs text-gray-500">
                                {Math.round((project.budget.spent / project.budget.allocated) * 100)}% utilized
                              </div>
                            </div>

                            <div className="text-sm">
                              <div className="text-gray-600 mb-1">Task Completion</div>
                              <div className="font-medium">
                                {project.tasks.completed} / {project.tasks.total} tasks
                              </div>
                              <div className="text-xs text-gray-500">
                                {Math.round((project.tasks.completed / project.tasks.total) * 100)}% complete
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-600">
                              <Users className="h-4 w-4 mr-2" />
                              Team ({project.team.length} members)
                            </div>
                            <div className="flex -space-x-2">
                              {project.team.slice(0, 5).map((member, idx) => (
                                <Avatar key={idx} className="h-8 w-8 border-2 border-white">
                                  <AvatarFallback className="text-xs bg-blue-100 text-blue-700">{member}</AvatarFallback>
                                </Avatar>
                              ))}
                              {project.team.length > 5 && (
                                <div className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                                  <span className="text-xs text-gray-600">+{project.team.length - 5}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div>
                <Card className="shadow-sm">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="text-xl">Recent Activity</CardTitle>
                    <CardDescription>Latest updates and milestones</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                        >
                          <div className="flex-shrink-0 mt-1">
                            <div className={`h-3 w-3 rounded-full ${
                              activity.type === 'milestone' ? 'bg-green-500' :
                              activity.type === 'approval' ? 'bg-blue-500' :
                              activity.type === 'meeting' ? 'bg-purple-500' : 'bg-orange-500'
                            }`}></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.project}</p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant={
                                    activity.priority === "Critical"
                                      ? "destructive"
                                      : activity.priority === "High"
                                        ? "default"
                                        : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {activity.priority}
                                </Badge>
                              </div>
                              <div className="text-xs text-gray-400">
                                <div>{activity.user}</div>
                                <div>{activity.time}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      View All Activity
                    </Button>
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
