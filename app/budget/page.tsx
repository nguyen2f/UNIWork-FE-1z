"use client"

import { useState } from "react"
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, Download, Filter, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "../../components/sidebar"
import { Header } from "../../components/header"

export default function BudgetPage() {
  const [budgetData] = useState({
    totalBudget: 2400000,
    allocatedBudget: 1950000,
    spentBudget: 1283000,
    remainingBudget: 667000,
    projectedSpend: 1850000,
  })

  const [projectBudgets] = useState([
    {
      id: 1,
      name: "Enterprise CRM Migration",
      allocated: 250000,
      spent: 195000,
      remaining: 55000,
      utilization: 78,
      status: "On Track",
      department: "IT Operations",
      manager: "John Doe",
      variance: -5000,
    },
    {
      id: 2,
      name: "Digital Transformation Initiative",
      allocated: 500000,
      spent: 225000,
      remaining: 275000,
      utilization: 45,
      status: "Under Budget",
      department: "Digital Strategy",
      manager: "Sarah Miller",
      variance: 25000,
    },
    {
      id: 3,
      name: "SOC 2 Compliance Implementation",
      allocated: 150000,
      spent: 138000,
      remaining: 12000,
      utilization: 92,
      status: "At Risk",
      department: "Security & Compliance",
      manager: "David Kim",
      variance: -8000,
    },
    {
      id: 4,
      name: "Global ERP Rollout Phase 2",
      allocated: 750000,
      spent: 45000,
      remaining: 705000,
      utilization: 6,
      status: "Planning",
      department: "Enterprise Systems",
      manager: "Michael Rodriguez",
      variance: 0,
    },
    {
      id: 5,
      name: "Customer Data Platform",
      allocated: 300000,
      spent: 180000,
      remaining: 120000,
      utilization: 60,
      status: "Over Budget",
      department: "Data Engineering",
      manager: "Lisa Smith",
      variance: -30000,
    },
  ])

  const [departmentBudgets] = useState([
    { name: "IT Operations", allocated: 600000, spent: 420000, utilization: 70 },
    { name: "Digital Strategy", allocated: 500000, spent: 225000, utilization: 45 },
    { name: "Security & Compliance", allocated: 300000, spent: 245000, utilization: 82 },
    { name: "Enterprise Systems", allocated: 750000, spent: 180000, utilization: 24 },
    { name: "Data Engineering", allocated: 250000, spent: 213000, utilization: 85 },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Track":
        return "bg-green-100 text-green-800"
      case "Under Budget":
        return "bg-blue-100 text-blue-800"
      case "At Risk":
        return "bg-yellow-100 text-yellow-800"
      case "Over Budget":
        return "bg-red-100 text-red-800"
      case "Planning":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
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
                <h1 className="text-3xl font-bold text-gray-900">Budget Management</h1>
                <p className="text-gray-600 mt-2">Track and manage project budgets and financial performance</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Budget
                </Button>
              </div>
            </div>

            {/* Budget Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Budget</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(budgetData.totalBudget)}</p>
                      <p className="text-sm text-gray-500 mt-1">Annual allocation</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Allocated</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(budgetData.allocatedBudget)}</p>
                      <p className="text-sm text-green-600 mt-1 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        81% of total
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Spent</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(budgetData.spentBudget)}</p>
                      <p className="text-sm text-orange-600 mt-1 flex items-center">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        66% utilized
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <TrendingDown className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Remaining</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(budgetData.remainingBudget)}</p>
                      <p className="text-sm text-purple-600 mt-1">Available funds</p>
                    </div>
                    <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Project Budgets */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Project Budget Tracking</CardTitle>
                      <CardDescription>Individual project budget performance and utilization</CardDescription>
                    </div>
                    <Select>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="All Projects" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Projects</SelectItem>
                        <SelectItem value="active">Active Only</SelectItem>
                        <SelectItem value="at-risk">At Risk</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {projectBudgets.map((project) => (
                        <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{project.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{project.department} • {project.manager}</p>
                            </div>
                            <Badge className={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Allocated</p>
                              <p className="font-semibold">{formatCurrency(project.allocated)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Spent</p>
                              <p className="font-semibold">{formatCurrency(project.spent)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Remaining</p>
                              <p className="font-semibold">{formatCurrency(project.remaining)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Variance</p>
                              <p className={`font-semibold ${project.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {project.variance >= 0 ? '+' : ''}{formatCurrency(project.variance)}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Budget Utilization</span>
                              <span className="font-medium">{project.utilization}%</span>
                            </div>
                            <Progress 
                              value={project.utilization} 
                              className={`h-2 ${project.utilization > 90 ? 'bg-red-100' : project.utilization > 75 ? 'bg-yellow-100' : 'bg-green-100'}`} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Department Budgets */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Department Budgets</CardTitle>
                    <CardDescription>Budget allocation by department</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {departmentBudgets.map((dept, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{dept.name}</span>
                            <span className="text-sm text-gray-600">{dept.utilization}%</span>
                          </div>
                          <Progress value={dept.utilization} className="h-2" />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{formatCurrency(dept.spent)} spent</span>
                            <span>{formatCurrency(dept.allocated)} allocated</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Budget Alerts */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                      Budget Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm font-medium text-red-800">Over Budget</p>
                        <p className="text-xs text-red-600 mt-1">Customer Data Platform exceeded budget by $30K</p>
                      </div>
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm font-medium text-yellow-800">High Utilization</p>
                        <p className="text-xs text-yellow-600 mt-1">SOC 2 Compliance at 92% budget utilization</p>
                      </div>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">Under Utilized</p>
                        <p className="text-xs text-blue-600 mt-1">ERP Rollout Phase 2 only 6% utilized</p>
                      </div>
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
