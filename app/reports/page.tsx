"use client"

import { useState } from "react"
import { Download, Filter, Calendar, BarChart3, PieChart, TrendingUp, FileText, Share } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Sidebar } from "../../components/sidebar"
import { Header } from "../../components/header"

export default function ReportsPage() {
  const [reportTemplates] = useState([
    {
      id: 1,
      name: "Executive Dashboard",
      description: "High-level overview of all projects, budgets, and KPIs",
      type: "Executive",
      frequency: "Weekly",
      lastGenerated: "2024-02-14",
      recipients: ["CEO", "CTO", "CFO"],
      status: "Active",
    },
    {
      id: 2,
      name: "Project Performance Report",
      description: "Detailed analysis of project progress, risks, and deliverables",
      type: "Operational",
      frequency: "Bi-weekly",
      lastGenerated: "2024-02-12",
      recipients: ["Project Managers", "Department Heads"],
      status: "Active",
    },
    {
      id: 3,
      name: "Budget Utilization Report",
      description: "Financial performance and budget tracking across all projects",
      type: "Financial",
      frequency: "Monthly",
      lastGenerated: "2024-02-01",
      recipients: ["CFO", "Finance Team", "Project Managers"],
      status: "Active",
    },
    {
      id: 4,
      name: "Resource Allocation Report",
      description: "Team utilization, capacity planning, and resource optimization",
      type: "HR",
      frequency: "Monthly",
      lastGenerated: "2024-01-30",
      recipients: ["HR Director", "Department Heads"],
      status: "Active",
    },
    {
      id: 5,
      name: "Compliance Status Report",
      description: "Security, audit, and regulatory compliance tracking",
      type: "Compliance",
      frequency: "Quarterly",
      lastGenerated: "2024-01-15",
      recipients: ["CISO", "Compliance Officer", "Legal Team"],
      status: "Scheduled",
    },
  ])

  const [kpiData] = useState([
    { name: "Project Success Rate", value: 87, target: 90, trend: "up" },
    { name: "Budget Adherence", value: 92, target: 95, trend: "up" },
    { name: "On-Time Delivery", value: 78, target: 85, trend: "down" },
    { name: "Team Utilization", value: 84, target: 80, trend: "up" },
    { name: "Client Satisfaction", value: 94, target: 90, trend: "up" },
    { name: "Risk Mitigation", value: 89, target: 85, trend: "up" },
  ])

  const [recentReports] = useState([
    {
      id: 1,
      name: "Q1 2024 Executive Summary",
      type: "Executive",
      generatedDate: "2024-02-14",
      size: "2.4 MB",
      format: "PDF",
      downloads: 23,
    },
    {
      id: 2,
      name: "February Project Status",
      type: "Operational",
      generatedDate: "2024-02-12",
      size: "1.8 MB",
      format: "PDF",
      downloads: 45,
    },
    {
      id: 3,
      name: "Budget Analysis - January",
      type: "Financial",
      generatedDate: "2024-02-01",
      size: "3.2 MB",
      format: "Excel",
      downloads: 18,
    },
    {
      id: 4,
      name: "Team Performance Metrics",
      type: "HR",
      generatedDate: "2024-01-30",
      size: "1.5 MB",
      format: "PDF",
      downloads: 12,
    },
  ])

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Executive":
        return "bg-purple-100 text-purple-800"
      case "Operational":
        return "bg-blue-100 text-blue-800"
      case "Financial":
        return "bg-green-100 text-green-800"
      case "HR":
        return "bg-orange-100 text-orange-800"
      case "Compliance":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Scheduled":
        return "bg-yellow-100 text-yellow-800"
      case "Inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
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
                <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
                <p className="text-gray-600 mt-2">Generate insights and track performance across all projects</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Report
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="templates">Report Templates</TabsTrigger>
                <TabsTrigger value="kpis">KPI Dashboard</TabsTrigger>
                <TabsTrigger value="recent">Recent Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Quick Stats */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Performance Overview</CardTitle>
                        <CardDescription>Key metrics and performance indicators</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {kpiData.slice(0, 4).map((kpi, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">{kpi.name}</span>
                                <div className="flex items-center space-x-1">
                                  <span className="text-sm font-bold">{kpi.value}%</span>
                                  <TrendingUp className={`h-4 w-4 ${kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                                </div>
                              </div>
                              <Progress value={kpi.value} className="h-2" />
                              <div className="text-xs text-gray-500">Target: {kpi.target}%</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Report Generation */}
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Report Generation</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Report Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="executive">Executive Summary</SelectItem>
                            <SelectItem value="project">Project Status</SelectItem>
                            <SelectItem value="budget">Budget Analysis</SelectItem>
                            <SelectItem value="team">Team Performance</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Time Period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="quarter">This Quarter</SelectItem>
                            <SelectItem value="year">This Year</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="excel">Excel</SelectItem>
                            <SelectItem value="powerpoint">PowerPoint</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Generate Report
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="templates" className="mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Report Templates</CardTitle>
                      <CardDescription>Automated and scheduled report templates</CardDescription>
                    </div>
                    <Select>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="executive">Executive</SelectItem>
                        <SelectItem value="operational">Operational</SelectItem>
                        <SelectItem value="financial">Financial</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reportTemplates.map((template) => (
                        <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{template.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                            </div>
                            <div className="flex space-x-2">
                              <Badge className={getTypeColor(template.type)}>
                                {template.type}
                              </Badge>
                              <Badge className={getStatusColor(template.status)}>
                                {template.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Frequency:</span>
                              <span className="ml-2 font-medium">{template.frequency}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Last Generated:</span>
                              <span className="ml-2 font-medium">{template.lastGenerated}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Recipients:</span>
                              <span className="ml-2 font-medium">{template.recipients.length} users</span>
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="outline" size="sm">
                              <Share className="h-4 w-4 mr-1" />
                              Share
                            </Button>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Generate
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="kpis" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {kpiData.map((kpi, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{kpi.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-3xl font-bold">{kpi.value}%</span>
                            <div className="flex items-center space-x-1">
                              <TrendingUp className={`h-5 w-5 ${kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                              <span className={`text-sm font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                {kpi.trend === 'up' ? '+' : '-'}2.3%
                              </span>
                            </div>
                          </div>
                          <Progress value={kpi.value} className="h-3" />
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Current: {kpi.value}%</span>
                            <span>Target: {kpi.target}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="recent" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Reports</CardTitle>
                    <CardDescription>Recently generated reports and downloads</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentReports.map((report) => (
                        <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                          <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{report.name}</h4>
                              <p className="text-sm text-gray-600">
                                Generated on {report.generatedDate} • {report.size} • {report.downloads} downloads
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getTypeColor(report.type)}>
                              {report.type}
                            </Badge>
                            <Badge variant="outline">
                              {report.format}
                            </Badge>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
