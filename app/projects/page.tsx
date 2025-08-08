"use client"

import { useState } from "react"
import { Plus, Search, Filter, MoreHorizontal, Calendar, Users, Target, DollarSign, AlertTriangle, TrendingUp, Building2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "../../components/sidebar"
import { Header } from "../../components/header"

export default function ProjectsPage() {
  const [projects] = useState([
    {
      id: 1,
      name: "Enterprise CRM Migration",
      description: "Migration of legacy CRM system to Salesforce with comprehensive data integration, user training, and change management",
      status: "On Track",
      priority: "Critical",
      progress: 78,
      dueDate: "Mar 15, 2024",
      team: ["JD", "SM", "AL", "RK", "MH", "TW"],
      tasks: { completed: 24, total: 31 },
      budget: { allocated: 250000, spent: 195000 },
      category: "Digital Transformation",
      client: "Acme Corporation",
      department: "IT Operations",
      manager: "John Doe",
      risk: "Low",
    },
    {
      id: 2,
      name: "Digital Transformation Initiative",
      description: "Company-wide digital transformation including process automation, cloud migration, and employee digital literacy programs",
      status: "In Progress",
      priority: "High",
      progress: 45,
      dueDate: "Jun 30, 2024",
      team: ["RW", "KL", "MJ", "TH", "NK", "LS", "BR", "CM"],
      tasks: { completed: 18, total: 40 },
      budget: { allocated: 500000, spent: 225000 },
      category: "Strategic Initiative",
      client: "Internal",
      department: "Digital Strategy",
      manager: "Sarah Miller",
      risk: "Medium",
    },
    {
      id: 3,
      name: "SOC 2 Compliance Implementation",
      description: "SOC 2 Type II compliance audit preparation and implementation of required security controls and documentation",
      status: "Nearly Complete",
      priority: "Critical",
      progress: 92,
      dueDate: "Feb 28, 2024",
      team: ["DK", "PL", "AM", "JB"],
      tasks: { completed: 23, total: 25 },
      budget: { allocated: 150000, spent: 138000 },
      category: "Compliance",
      client: "Internal",
      department: "Security & Compliance",
      manager: "David Kim",
      risk: "Low",
    },
    {
      id: 4,
      name: "Global ERP Rollout Phase 2",
      description: "Second phase of global ERP system rollout covering EMEA region with localization and integration requirements",
      status: "Planning",
      priority: "High",
      progress: 15,
      dueDate: "Sep 30, 2024",
      team: ["MR", "JB", "KW", "LH", "NP"],
      tasks: { completed: 3, total: 28 },
      budget: { allocated: 750000, spent: 45000 },
      category: "Infrastructure",
      client: "Global Operations",
      department: "Enterprise Systems",
      manager: "Michael Rodriguez",
      risk: "High",
    },
    {
      id: 5,
      name: "Customer Data Platform",
      description: "Implementation of unified customer data platform for 360-degree customer view and advanced analytics",
      status: "At Risk",
      priority: "High",
      progress: 35,
      dueDate: "May 15, 2024",
      team: ["LS", "BN", "CO", "DF"],
      tasks: { completed: 8, total: 22 },
      budget: { allocated: 300000, spent: 180000 },
      category: "Data & Analytics",
      client: "Marketing & Sales",
      department: "Data Engineering",
      manager: "Lisa Smith",
      risk: "High",
    },
    {
      id: 6,
      name: "Mobile Workforce Solution",
      description: "Development and deployment of mobile applications for field workforce with offline capabilities",
      status: "Completed",
      priority: "Medium",
      progress: 100,
      dueDate: "Jan 15, 2024",
      team: ["AM", "BN", "CO", "EF", "GH"],
      tasks: { completed: 19, total: 19 },
      budget: { allocated: 200000, spent: 185000 },
      category: "Mobile Development",
      client: "Field Operations",
      department: "Application Development",
      manager: "Alex Johnson",
      risk: "Low",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "On Track":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "In Progress":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Nearly Complete":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "Planning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "At Risk":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-300"
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-300"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "Low":
        return "bg-green-100 text-green-800 border-green-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High":
        return "text-red-600"
      case "Medium":
        return "text-yellow-600"
      case "Low":
        return "text-green-600"
      default:
        return "text-gray-600"
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
                <h1 className="text-3xl font-bold text-gray-900">Project Portfolio</h1>
                <p className="text-gray-600 mt-2">Comprehensive view of all organizational projects and initiatives</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search projects by name, client, or department..." className="pl-10" />
              </div>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="on-track">On Track</SelectItem>
                    <SelectItem value="at-risk">At Risk</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer border border-gray-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Project</DropdownMenuItem>
                              <DropdownMenuItem>Generate Report</DropdownMenuItem>
                              <DropdownMenuItem>Export Data</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Archive</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <CardDescription className="text-sm line-clamp-2 mb-3">{project.description}</CardDescription>
                        
                        {/* Status and Priority Badges */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                          <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getPriorityColor(project.priority)}`}>
                            {project.priority}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {project.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <Target className="h-4 w-4 mr-2" />
                          <span>Tasks: {project.tasks.completed}/{project.tasks.total}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Due: {project.dueDate}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <DollarSign className="h-4 w-4 mr-2" />
                          <span>${(project.budget.spent / 1000).toFixed(0)}K / ${(project.budget.allocated / 1000).toFixed(0)}K</span>
                        </div>
                        <div className="flex items-center">
                          <AlertTriangle className={`h-4 w-4 mr-2 ${getRiskColor(project.risk)}`} />
                          <span className={`${getRiskColor(project.risk)} font-medium`}>
                            {project.risk} Risk
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="pt-3 border-t border-gray-100 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Client:</span>
                        <span className="font-medium">{project.client}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Department:</span>
                        <span className="font-medium">{project.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Project Manager:</span>
                        <span className="font-medium">{project.manager}</span>
                      </div>
                    </div>

                    {/* Team */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
