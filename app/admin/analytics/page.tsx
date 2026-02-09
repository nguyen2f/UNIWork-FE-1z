"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const taskTrendData = [
  { date: "Mon", tasks: 120, completed: 95, overdue: 5 },
  { date: "Tue", tasks: 135, completed: 108, overdue: 8 },
  { date: "Wed", tasks: 148, completed: 125, overdue: 6 },
  { date: "Thu", tasks: 156, completed: 138, overdue: 9 },
  { date: "Fri", tasks: 142, completed: 128, overdue: 4 },
  { date: "Sat", tasks: 98, completed: 88, overdue: 2 },
  { date: "Sun", tasks: 75, completed: 68, overdue: 1 },
]

const projectStatusData = [
  { name: "On Track", value: 18, color: "#10b981" },
  { name: "At Risk", value: 4, color: "#f59e0b" },
  { name: "Off Track", value: 2, color: "#ef4444" },
]

const departmentPerformance = [
  { dept: "Engineering", completion: 92, efficiency: 88 },
  { dept: "Design", completion: 85, efficiency: 92 },
  { dept: "Marketing", completion: 78, efficiency: 81 },
  { dept: "Sales", completion: 88, efficiency: 85 },
  { dept: "Operations", completion: 95, efficiency: 89 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("week")

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader
        title="Analytics"
        description="Detailed project and team performance metrics"
      />

      <div className="p-6 space-y-8">
        {/* Time Range Filter */}
        <div className="flex gap-2">
          {["week", "month", "quarter"].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              onClick={() => setTimeRange(range)}
              className="capitalize"
            >
              This {range}
            </Button>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Task Trends */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Task Completion Trend</CardTitle>
              <CardDescription>Daily tasks and completion rates</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={taskTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="tasks" fill="#3b82f6" name="Assigned" />
                  <Bar dataKey="completed" fill="#10b981" name="Completed" />
                  <Bar dataKey="overdue" fill="#ef4444" name="Overdue" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Project Status */}
          <Card>
            <CardHeader>
              <CardTitle>Project Status Distribution</CardTitle>
              <CardDescription>Current project health status</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Department Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>Completion and efficiency rates</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" stroke="var(--muted-foreground)" />
                  <YAxis dataKey="dept" type="category" stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="completion" fill="#3b82f6" name="Completion" />
                  <Bar dataKey="efficiency" fill="#10b981" name="Efficiency" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Metrics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Avg. Task Completion",
              value: "89%",
              change: "+5%",
            },
            {
              label: "On-Time Delivery",
              value: "92%",
              change: "+3%",
            },
            {
              label: "Team Utilization",
              value: "84%",
              change: "+2%",
            },
            {
              label: "Quality Score",
              value: "4.6/5",
              change: "+0.2",
            },
          ].map((metric, idx) => (
            <Card key={idx}>
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </p>
                <p className="text-2xl font-bold mt-2">{metric.value}</p>
                <p className="text-sm text-green-600 mt-1">{metric.change} from last period</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
