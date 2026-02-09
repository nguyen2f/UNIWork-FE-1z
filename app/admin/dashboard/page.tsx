"use client"

import { useState } from "react"
import { Users, TrendingUp, Activity, Database, Target, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { KPICard } from "@/components/admin/kpi-card"
import { AdminHeader } from "@/components/admin/admin-header"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts"

const projectTrendData = [
  { month: "Jan", completed: 12, inProgress: 8, planned: 5 },
  { month: "Feb", completed: 14, inProgress: 10, planned: 6 },
  { month: "Mar", completed: 16, inProgress: 12, planned: 7 },
  { month: "Apr", completed: 19, inProgress: 14, planned: 8 },
  { month: "May", completed: 22, inProgress: 16, planned: 9 },
  { month: "Jun", completed: 25, inProgress: 18, planned: 10 },
]

const employeeProductivityData = [
  { week: "W1", tasks: 45, completed: 42, quality: 94 },
  { week: "W2", tasks: 52, completed: 48, quality: 91 },
  { week: "W3", tasks: 48, completed: 46, quality: 96 },
  { week: "W4", tasks: 55, completed: 51, quality: 93 },
]

const recentActivities = [
  {
    id: 1,
    user: "Sarah Johnson",
    action: "Created new project",
    project: "Q2 Product Launch",
    timestamp: "2 hours ago",
    type: "create",
  },
  {
    id: 2,
    user: "Michael Chen",
    action: "Completed milestone",
    project: "Infrastructure Upgrade",
    timestamp: "4 hours ago",
    type: "complete",
  },
  {
    id: 3,
    user: "Emma Davis",
    action: "Reassigned 5 tasks",
    project: "Customer Portal",
    timestamp: "1 day ago",
    type: "update",
  },
  {
    id: 4,
    user: "James Wilson",
    action: "Added team member",
    project: "Mobile App Development",
    timestamp: "2 days ago",
    type: "member",
  },
]

export default function AdminDashboardPage() {
  const [stats] = useState({
    activeProjects: 24,
    totalTeamMembers: 156,
    completionRate: "78%",
    overallHealth: "92%",
    budgetUtilization: "67%",
    riskAlerts: 3,
  })

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader
        title="Dashboard"
        description="Monitor system performance and project metrics"
      />

      <div className="p-6 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <KPICard
            title="Active Projects"
            value={stats.activeProjects}
            subtitle="Across all teams"
            icon={Target}
            color="blue"
            trend={{ value: 12, isPositive: true }}
          />
          <KPICard
            title="Team Members"
            value={stats.totalTeamMembers}
            subtitle="Active in system"
            icon={Users}
            color="green"
            trend={{ value: 8, isPositive: true }}
          />
          <KPICard
            title="Project Health"
            value={stats.overallHealth}
            subtitle="System average"
            icon={Activity}
            color="purple"
            trend={{ value: 3, isPositive: true }}
          />
          <KPICard
            title="Completion Rate"
            value={stats.completionRate}
            subtitle="Last quarter"
            icon={TrendingUp}
            color="orange"
            trend={{ value: 5, isPositive: true }}
          />
          <KPICard
            title="Budget Utilization"
            value={stats.budgetUtilization}
            subtitle="FY 2024"
            icon={Database}
            color="blue"
            trend={{ value: 2, isPositive: false }}
          />
          <KPICard
            title="Risk Alerts"
            value={stats.riskAlerts}
            subtitle="Requiring attention"
            icon={AlertCircle}
            color="orange"
            trend={{ value: 1, isPositive: false }}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Progress Trend</CardTitle>
              <CardDescription>Last 6 months overview</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="completed" fill="#10b981" name="Completed" />
                  <Bar dataKey="inProgress" fill="#3b82f6" name="In Progress" />
                  <Bar dataKey="planned" fill="#f59e0b" name="Planned" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Employee Productivity</CardTitle>
              <CardDescription>Current month performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={employeeProductivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="week" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="tasks"
                    stroke="#3b82f6"
                    name="Tasks Assigned"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#10b981"
                    name="Tasks Completed"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="quality"
                    stroke="#f59e0b"
                    name="Quality Score"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium">
                      {activity.user}{" "}
                      <span className="text-muted-foreground font-normal">
                        {activity.action}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.project}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
