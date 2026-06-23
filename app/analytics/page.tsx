"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, Calendar, Download, Filter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

export default function AnalyticsPage() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState("month")

  useEffect(() => {
    const role = localStorage.getItem("role")
    if (role === "EMPLOYEE") {
      router.push("/dashboard")
    }
  }, [router])

  const [performanceMetrics] = useState([
    { name: "Project Completion Rate", value: 87, change: 5, trend: "up", target: 90 },
    { name: "Budget Efficiency", value: 92, change: -2, trend: "down", target: 95 },
    { name: "Team Productivity", value: 84, change: 8, trend: "up", target: 85 },
    { name: "Client Satisfaction", value: 94, change: 3, trend: "up", target: 90 },
    { name: "On-Time Delivery", value: 78, change: -7, trend: "down", target: 85 },
    { name: "Resource Utilization", value: 89, change: 4, trend: "up", target: 85 },
  ])

  const [projectAnalytics] = useState([
    { name: "Enterprise CRM Migration", progress: 78, budget: 78, timeline: 85, risk: "Low" },
    { name: "Digital Transformation", progress: 45, budget: 45, timeline: 50, risk: "Medium" },
    { name: "SOC 2 Compliance", progress: 92, budget: 92, timeline: 95, risk: "Low" },
    { name: "Global ERP Rollout", progress: 15, budget: 6, timeline: 20, risk: "High" },
    { name: "Customer Data Platform", progress: 35, budget: 60, timeline: 40, risk: "High" },
  ])

  const [departmentMetrics] = useState([
    { name: "IT Operations", projects: 4, completion: 85, budget: 92, utilization: 88 },
    { name: "Digital Strategy", projects: 3, completion: 67, budget: 78, utilization: 82 },
    { name: "Security & Compliance", projects: 2, completion: 95, budget: 96, utilization: 90 },
    { name: "Enterprise Systems", projects: 2, completion: 45, budget: 24, utilization: 65 },
    { name: "Data Engineering", projects: 1, completion: 35, budget: 60, utilization: 75 },
  ])

  const [trendData] = useState([
    { month: "Oct", projects: 12, budget: 1200000, completion: 82 },
    { month: "Nov", projects: 15, budget: 1450000, completion: 85 },
    { month: "Dec", projects: 18, budget: 1680000, completion: 87 },
    { month: "Jan", projects: 16, budget: 1580000, completion: 84 },
    { month: "Feb", projects: 18, budget: 1750000, completion: 89 },
  ])

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-green-600 bg-green-100"
      case "Medium":
        return "text-yellow-600 bg-yellow-100"
      case "High":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
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
                <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
                <p className="text-gray-600 mt-2">Advanced analytics and performance insights across all projects</p>
              </div>
              <div className="flex space-x-2">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="projects">Project Analytics</TabsTrigger>
                <TabsTrigger value="departments">Department Metrics</TabsTrigger>
                <TabsTrigger value="trends">Trends & Forecasting</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {performanceMetrics.map((metric, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium text-gray-900">{metric.name}</h3>
                          <div className="flex items-center space-x-1">
                            {metric.trend === "up" ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                            <span className={`text-sm font-medium ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                              {metric.change > 0 ? "+" : ""}{metric.change}%
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Current</span>
                            <span className="font-bold text-2xl">{metric.value}%</span>
                          </div>
                          <Progress value={metric.value} className="h-2" />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Target: {metric.target}%</span>
                            <span>{metric.value >= metric.target ? "✓ On Target" : "Below Target"}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Quick Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Activity className="h-5 w-5 mr-2" />
                        Performance Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <span className="text-sm font-medium">Projects On Track</span>
                          <span className="text-lg font-bold text-green-600">14/18</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                          <span className="text-sm font-medium">Projects At Risk</span>
                          <span className="text-lg font-bold text-yellow-600">2/18</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                          <span className="text-sm font-medium">Projects Over Budget</span>
                          <span className="text-lg font-bold text-red-600">2/18</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2" />
                        Key Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                          <p className="text-sm font-medium text-blue-800">Team Productivity Up</p>
                          <p className="text-xs text-blue-600 mt-1">8% increase in productivity this month</p>
                        </div>
                        <div className="p-3 border-l-4 border-green-500 bg-green-50">
                          <p className="text-sm font-medium text-green-800">Budget Efficiency Improved</p>
                          <p className="text-xs text-green-600 mt-1">92% budget efficiency across all projects</p>
                        </div>
                        <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50">
                          <p className="text-sm font-medium text-yellow-800">Timeline Attention Needed</p>
                          <p className="text-xs text-yellow-600 mt-1">On-time delivery rate decreased by 7%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="projects" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Performance Analysis</CardTitle>
                    <CardDescription>Detailed performance metrics for each active project</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {projectAnalytics.map((project, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">{project.name}</h3>
                            <Badge className={getRiskColor(project.risk)}>
                              {project.risk} Risk
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium">{project.progress}%</span>
                              </div>
                              <Progress value={project.progress} className="h-2" />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Budget Utilization</span>
                                <span className="font-medium">{project.budget}%</span>
                              </div>
                              <Progress value={project.budget} className="h-2" />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Timeline Progress</span>
                                <span className="font-medium">{project.timeline}%</span>
                              </div>
                              <Progress value={project.timeline} className="h-2" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="departments" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Department Performance Metrics</CardTitle>
                    <CardDescription>Performance analysis by department and team</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {departmentMetrics.map((dept, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                            <Badge variant="outline">{dept.projects} Projects</Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Completion Rate</span>
                                <span className="font-medium">{dept.completion}%</span>
                              </div>
                              <Progress value={dept.completion} className="h-2" />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Budget Efficiency</span>
                                <span className="font-medium">{dept.budget}%</span>
                              </div>
                              <Progress value={dept.budget} className="h-2" />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Team Utilization</span>
                                <span className="font-medium">{dept.utilization}%</span>
                              </div>
                              <Progress value={dept.utilization} className="h-2" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trends" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Trends</CardTitle>
                      <CardDescription>Historical project performance over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {trendData.map((data, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div>
                              <span className="font-medium">{data.month}</span>
                              <p className="text-sm text-gray-600">{data.projects} projects</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${(data.budget / 1000000).toFixed(1)}M</p>
                              <p className="text-sm text-gray-600">{data.completion}% completion</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Forecasting</CardTitle>
                      <CardDescription>Projected performance for next quarter</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2">Q2 2024 Projections</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Expected Projects:</span>
                              <span className="font-medium">22</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Projected Budget:</span>
                              <span className="font-medium">$2.1M</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Completion Rate:</span>
                              <span className="font-medium">91%</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-2">Recommendations</h4>
                          <ul className="text-sm text-green-700 space-y-1">
                            <li>• Focus on timeline management</li>
                            <li>• Increase resource allocation for high-risk projects</li>
                            <li>• Implement additional quality checkpoints</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
