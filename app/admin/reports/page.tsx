"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Filter, MoreHorizontal, Download } from "lucide-react"

const reportData = [
  {
    id: 1,
    name: "Q2 Project Performance",
    type: "Performance",
    period: "Apr - Jun 2024",
    status: "Completed",
    generatedBy: "Admin",
    date: "2024-06-30",
  },
  {
    id: 2,
    name: "Team Productivity Analysis",
    type: "Productivity",
    period: "May 2024",
    status: "Completed",
    generatedBy: "Manager",
    date: "2024-06-15",
  },
  {
    id: 3,
    name: "Budget Allocation Review",
    type: "Financial",
    period: "Q2 2024",
    status: "In Progress",
    generatedBy: "Finance",
    date: "2024-06-10",
  },
  {
    id: 4,
    name: "Risk Assessment Report",
    type: "Risk",
    period: "May 2024",
    status: "Completed",
    generatedBy: "Admin",
    date: "2024-06-05",
  },
  {
    id: 5,
    name: "Employee Satisfaction Survey",
    type: "HR",
    period: "May 2024",
    status: "Completed",
    generatedBy: "HR",
    date: "2024-06-01",
  },
]

const summaryMetrics = [
  { label: "Active Projects", value: "24" },
  { label: "Completed Tasks", value: "892" },
  { label: "Team Members", value: "156" },
  { label: "Budget Spent", value: "$487K" },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800"
    case "In Progress":
      return "bg-blue-100 text-blue-800"
    case "Pending":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const filteredReports = reportData.filter((report) => {
    const matchesSearch = report.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || report.type === filterType
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader
        title="Reports"
        description="Access and manage system reports and analytics"
        actionLabel="Generate Report"
      />

      <div className="p-6 space-y-8">
        {/* Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {summaryMetrics.map((metric, idx) => (
            <Card key={idx}>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="text-2xl font-bold mt-1">{metric.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reports Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Reports</CardTitle>
                <CardDescription>Manage and download system reports</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filter */}
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Type
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilterType("all")}>
                    All Types
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("Performance")}>
                    Performance
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("Productivity")}>
                    Productivity
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("Financial")}>
                    Financial
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("Risk")}>
                    Risk
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("HR")}>
                    HR
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Reports List */}
            <div className="space-y-2 border rounded-lg divide-y">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {report.period} • Generated by {report.generatedBy}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{report.date}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Download</DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
