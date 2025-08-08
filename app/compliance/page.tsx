"use client"

import { useState } from "react"
import { Shield, AlertTriangle, CheckCircle, Clock, FileText, Download, Plus, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "../../components/sidebar"
import { Header } from "../../components/header"

export default function CompliancePage() {
  const [complianceItems] = useState([
    {
      id: 1,
      name: "SOC 2 Type II Audit",
      description: "Annual SOC 2 Type II compliance audit and certification",
      status: "In Progress",
      priority: "Critical",
      dueDate: "2024-02-28",
      progress: 92,
      assignee: "David Kim",
      framework: "SOC 2",
      lastUpdated: "2024-02-14",
      documents: 23,
    },
    {
      id: 2,
      name: "GDPR Data Protection Review",
      description: "Quarterly review of GDPR compliance and data protection measures",
      status: "Completed",
      priority: "High",
      dueDate: "2024-01-31",
      progress: 100,
      assignee: "Sarah Miller",
      framework: "GDPR",
      lastUpdated: "2024-01-30",
      documents: 15,
    },
    {
      id: 3,
      name: "ISO 27001 Certification Renewal",
      description: "Annual ISO 27001 information security management certification renewal",
      status: "Planning",
      priority: "High",
      dueDate: "2024-06-30",
      progress: 25,
      assignee: "Michael Rodriguez",
      framework: "ISO 27001",
      lastUpdated: "2024-02-10",
      documents: 8,
    },
    {
      id: 4,
      name: "PCI DSS Compliance Assessment",
      description: "Payment Card Industry Data Security Standard compliance assessment",
      status: "At Risk",
      priority: "Critical",
      dueDate: "2024-03-15",
      progress: 45,
      assignee: "Lisa Smith",
      framework: "PCI DSS",
      lastUpdated: "2024-02-12",
      documents: 12,
    },
    {
      id: 5,
      name: "HIPAA Security Rule Audit",
      description: "Healthcare data security and privacy compliance audit",
      status: "Scheduled",
      priority: "Medium",
      dueDate: "2024-04-30",
      progress: 10,
      assignee: "Tom Harris",
      framework: "HIPAA",
      lastUpdated: "2024-02-08",
      documents: 5,
    },
  ])

  const [complianceStats] = useState({
    totalItems: 15,
    completed: 8,
    inProgress: 4,
    atRisk: 2,
    overdue: 1,
    complianceScore: 87,
  })

  const [frameworks] = useState([
    { name: "SOC 2", items: 3, compliance: 92, status: "Good" },
    { name: "GDPR", items: 4, compliance: 95, status: "Excellent" },
    { name: "ISO 27001", items: 2, compliance: 78, status: "Needs Attention" },
    { name: "PCI DSS", items: 3, compliance: 85, status: "Good" },
    { name: "HIPAA", items: 3, compliance: 88, status: "Good" },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Planning":
        return "bg-purple-100 text-purple-800"
      case "At Risk":
        return "bg-red-100 text-red-800"
      case "Scheduled":
        return "bg-yellow-100 text-yellow-800"
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

  const getFrameworkStatusColor = (status: string) => {
    switch (status) {
      case "Excellent":
        return "text-green-600"
      case "Good":
        return "text-blue-600"
      case "Needs Attention":
        return "text-red-600"
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
                <h1 className="text-3xl font-bold text-gray-900">Compliance Management</h1>
                <p className="text-gray-600 mt-2">Track and manage regulatory compliance and security audits</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Compliance Item
                </Button>
              </div>
            </div>

            {/* Compliance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Compliance Score</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{complianceStats.complianceScore}%</p>
                      <p className="text-sm text-green-600 mt-1">Above target</p>
                    </div>
                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Shield className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">In Progress</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{complianceStats.inProgress}</p>
                      <p className="text-sm text-blue-600 mt-1">Active items</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">At Risk</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{complianceStats.atRisk}</p>
                      <p className="text-sm text-red-600 mt-1">Need attention</p>
                    </div>
                    <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Completed</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{complianceStats.completed}</p>
                      <p className="text-sm text-purple-600 mt-1">This quarter</p>
                    </div>
                    <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="items" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="items">Compliance Items</TabsTrigger>
                <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
                <TabsTrigger value="reports">Reports & Documentation</TabsTrigger>
              </TabsList>

              <TabsContent value="items" className="mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Compliance Items</CardTitle>
                      <CardDescription>Track all compliance requirements and audits</CardDescription>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search compliance items..." className="pl-10 w-64" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {complianceItems.map((item) => (
                        <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{item.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            </div>
                            <div className="flex space-x-2">
                              <Badge className={getStatusColor(item.status)}>
                                {item.status}
                              </Badge>
                              <Badge variant="outline" className={getPriorityColor(item.priority)}>
                                {item.priority}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Framework</p>
                              <p className="font-medium">{item.framework}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Assignee</p>
                              <p className="font-medium">{item.assignee}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Due Date</p>
                              <p className="font-medium">{item.dueDate}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Documents</p>
                              <p className="font-medium">{item.documents} files</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium">{item.progress}%</span>
                            </div>
                            <Progress value={item.progress} className="h-2" />
                            <div className="text-xs text-gray-500">
                              Last updated: {item.lastUpdated}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="frameworks" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Compliance Frameworks</CardTitle>
                    <CardDescription>Overview of compliance status by framework</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {frameworks.map((framework, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-gray-900">{framework.name}</h3>
                              <p className="text-sm text-gray-600">{framework.items} compliance items</p>
                            </div>
                            <div className="text-right">
                              <p className={`font-medium ${getFrameworkStatusColor(framework.status)}`}>
                                {framework.status}
                              </p>
                              <p className="text-sm text-gray-600">{framework.compliance}% compliant</p>
                            </div>
                          </div>
                          <Progress value={framework.compliance} className="h-3" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Compliance Reports & Documentation</CardTitle>
                    <CardDescription>Generated reports and compliance documentation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">SOC 2 Audit Report 2024</h4>
                            <p className="text-sm text-gray-600">Generated on Feb 14, 2024 • 2.4 MB</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">GDPR Compliance Summary Q1</h4>
                            <p className="text-sm text-gray-600">Generated on Jan 31, 2024 • 1.8 MB</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">ISO 27001 Gap Analysis</h4>
                            <p className="text-sm text-gray-600">Generated on Feb 10, 2024 • 3.2 MB</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
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
