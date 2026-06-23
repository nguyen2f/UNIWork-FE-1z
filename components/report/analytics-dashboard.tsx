"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  TrendingUp, Calendar, Users, AlertTriangle, CheckCircle2, Clock,
  FolderKanban, Bug, Loader2, ArrowUpRight, BarChart3, PieChartIcon,
  ShieldAlert, RefreshCw, CalendarDays, Activity, ChevronRight, CheckCircle,
  HelpCircle, Sparkles
} from "lucide-react"
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts"
import {
  fetchAnalyticsSummary,
  fetchCompletionTrend,
  fetchCreationTrend,
  fetchProjectAnalytics
} from "@/services/report.service"
import type {
  AnalyticsSummaryDTO,
  CompletionTrendDTO,
  CreationTrendDTO,
  ProjectAnalyticsDTO,
  StatusDistributionDTO,
  PriorityDistributionDTO
} from "@/types/report.types"
import type { ProjectReport } from "@/types/project.types"

// Soft curated colors for Status & Priority distributions
const STATUS_COLORS: Record<string, string> = {
  // Task status
  PENDING: "#6366f1", // Indigo
  DOING: "#f59e0b", // Yellow/Orange
  REVIEWING: "#ec4899", // Pink
  COMPLETED: "#10b981", // Emerald
  CANCELLED: "#ef4444", // Red
  
  // Issue status
  OPEN: "#3b82f6", // Blue
  IN_PROGRESS: "#f59e0b", // Amber
  RESOLVED: "#10b981", // Emerald
  CLOSED: "#6b7280", // Gray
  REOPENED: "#ef4444" // Red
}

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "#10b981",
  MEDIUM: "#f59e0b",
  HIGH: "#f97316",
  CRITICAL: "#ef4444"
}

interface AnalyticsDashboardProps {
  projectReports: ProjectReport[]
}

export function AnalyticsDashboard({ projectReports }: AnalyticsDashboardProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Global Analytics State
  const [summary, setSummary] = useState<AnalyticsSummaryDTO | null>(null)
  
  // Trend State
  const [completionTrend, setCompletionTrend] = useState<CompletionTrendDTO | null>(null)
  const [creationTrend, setCreationTrend] = useState<CreationTrendDTO | null>(null)
  const [granularity, setGranularity] = useState<"DAILY" | "MONTHLY" | "YEARLY">("DAILY")
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d")
  const [trendLoading, setTrendLoading] = useState(false)
  
  // Project-specific State
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all")
  const [projectAnalytics, setProjectAnalytics] = useState<ProjectAnalyticsDTO | null>(null)
  const [projectLoading, setProjectLoading] = useState(false)

  // Mounting lifecycle to avoid SSR mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Load Initial Global Data
  useEffect(() => {
    if (isMounted) {
      loadGlobalAnalytics()
    }
  }, [isMounted])

  // Load Trend Data when granularity or timeRange changes
  useEffect(() => {
    if (isMounted) {
      loadTrends()
    }
  }, [isMounted, granularity, timeRange])

  // Load Project Specific Data when selectedProjectId changes
  useEffect(() => {
    if (isMounted && selectedProjectId !== "all") {
      loadProjectSpecificAnalytics(Number(selectedProjectId))
    } else {
      setProjectAnalytics(null)
    }
  }, [isMounted, selectedProjectId])

  const loadGlobalAnalytics = async () => {
    setLoading(true)
    setError(null)
    try {
      const summaryData = await fetchAnalyticsSummary()
      setSummary(summaryData)
    } catch (err: any) {
      console.error("Error loading analytics summary:", err)
      const msg = err?.response?.data?.message || err?.message || ""
      if (err?.status === 403 || msg.includes("permission") || msg.includes("PERM_MANAGE_REPORTS")) {
        setError("ACCESS_RESTRICTED")
      } else {
        setError("An error occurred while loading system analytics data.")
      }
    } finally {
      setLoading(false)
    }
  }

  const loadTrends = async () => {
    setTrendLoading(true)
    try {
      // Calculate from/to timestamps
      const toTimestamp = Date.now()
      let daysBack = 30
      if (timeRange === "7d") daysBack = 7
      if (timeRange === "90d") daysBack = 90
      const fromTimestamp = toTimestamp - daysBack * 24 * 60 * 60 * 1000

      const [compRes, creatRes] = await Promise.all([
        fetchCompletionTrend(granularity, fromTimestamp, toTimestamp),
        fetchCreationTrend(granularity, fromTimestamp, toTimestamp)
      ])
      
      setCompletionTrend(compRes)
      setCreationTrend(creatRes)
    } catch (err) {
      console.error("Error loading trend data:", err)
    } finally {
      setTrendLoading(false)
    }
  }

  const loadProjectSpecificAnalytics = async (projectId: number) => {
    setProjectLoading(true)
    try {
      const projData = await fetchProjectAnalytics(projectId)
      setProjectAnalytics(projData)
    } catch (err) {
      console.error("Error loading project analytics:", err)
    } finally {
      setProjectLoading(false)
    }
  }

  if (!isMounted) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[200px] w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[300px] w-full rounded-2xl" />
          <Skeleton className="h-[300px] w-full rounded-2xl" />
        </div>
      </div>
    )
  }

  // Handle Unauthorized / Access Denied
  if (error === "ACCESS_RESTRICTED") {
    return (
      <Card className="border-red-200 bg-red-50/50 backdrop-blur-sm shadow-sm max-w-2xl mx-auto my-8">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <ShieldAlert className="h-6 w-6 text-red-600 animate-pulse" />
          </div>
          <CardTitle className="text-red-950 font-bold text-xl">Access Restricted</CardTitle>
          <CardDescription className="text-red-700">
            You need <code className="bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-mono text-xs">PERM_MANAGE_REPORTS</code> permission to access this analytics page.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center p-6 space-y-4">
          <p className="text-sm text-gray-600">
            The Dashboard & Advanced Reports page displays sensitive metrics regarding project performance, task completion rates, and system-wide workload distribution. Please contact an administrator to request permission.
          </p>
          <div className="pt-2">
            <Button variant="outline" onClick={loadGlobalAnalytics} className="border-red-200 hover:bg-red-50 text-red-700">
              <RefreshCw className="h-4 w-4 mr-2" /> Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-amber-200 bg-amber-50/50 backdrop-blur-sm max-w-xl mx-auto my-8 text-center p-6">
        <CardHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-2">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <CardTitle className="text-amber-950 text-lg font-semibold">Failed to Load Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">{error}</p>
          <Button onClick={loadGlobalAnalytics} className="bg-amber-600 hover:bg-amber-700 text-white">
            <RefreshCw className="h-4 w-4 mr-2" /> Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="space-y-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="shadow-sm">
              <CardContent className="p-6">
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-8 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-1/3 mb-6" />
              <Skeleton className="h-[250px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-1/2 mb-6" />
              <Skeleton className="h-[250px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Combine trend data for a dual chart
  const combinedTrendData = completionTrend?.dataPoints?.map(pt => {
    const creationPt = creationTrend?.dataPoints?.find(cPt => cPt.label === pt.label)
    return {
      label: pt.label,
      completedTasks: pt.tasks,
      completedIssues: pt.issues,
      createdTasks: creationPt ? creationPt.tasks : 0,
      createdIssues: creationPt ? creationPt.issues : 0,
    }
  }) || []

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Overview Cards (KPI Dashboard) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Task Completion Card */}
        <Card className="relative overflow-hidden border border-slate-100 hover:-translate-y-1 hover:shadow-md transition-all duration-300 bg-white">
          <div className="absolute top-0 right-0 w-24 h-24 -mr-4 -mt-4 bg-emerald-50 rounded-full -z-0 opacity-40" />
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tasks</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
                  {summary?.completedTasks}
                  <span className="text-sm font-medium text-slate-400"> / {summary?.totalTasks}</span>
                </h3>
                <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  Completion Rate: {(summary?.taskCompletionRate ?? 0).toFixed(1)}%
                </div>
              </div>
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={summary?.taskCompletionRate || 0} className="h-2 bg-slate-100" />
            </div>
          </CardContent>
        </Card>

        {/* Issue Resolution Card */}
        <Card className="relative overflow-hidden border border-slate-100 hover:-translate-y-1 hover:shadow-md transition-all duration-300 bg-white">
          <div className="absolute top-0 right-0 w-24 h-24 -mr-4 -mt-4 bg-blue-50 rounded-full -z-0 opacity-40" />
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Issues</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
                  {summary?.completedIssues}
                  <span className="text-sm font-medium text-slate-400"> / {summary?.totalIssues}</span>
                </h3>
                <div className="flex items-center gap-1 mt-2 text-xs font-medium text-blue-600">
                  <TrendingUp className="h-3 w-3" />
                  Resolved: {(summary?.issueCompletionRate ?? 0).toFixed(1)}%
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                <Bug className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={summary?.issueCompletionRate || 0} className="h-2 bg-slate-100" />
            </div>
          </CardContent>
        </Card>

        {/* Overdue Items Card */}
        <Card className="relative overflow-hidden border border-slate-100 hover:-translate-y-1 hover:shadow-md transition-all duration-300 bg-white">
          <div className="absolute top-0 right-0 w-24 h-24 -mr-4 -mt-4 bg-rose-50 rounded-full -z-0 opacity-40" />
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overdue Items</p>
                <h3 className="text-3xl font-extrabold text-rose-600 mt-2">
                  {(summary?.overdueTasks || 0) + (summary?.overdueIssues || 0)}
                </h3>
                <div className="flex items-center gap-2 mt-2 text-xs font-medium text-slate-500">
                  <span>Task: {summary?.overdueTasks}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span>Issue: {summary?.overdueIssues}</span>
                </div>
              </div>
              <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-rose-600 font-semibold bg-rose-50/50 p-2 rounded-xl">
              <span>System Overdue Rate:</span>
              <span>{(summary?.overdueRate ?? 0).toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Average Completion Time Card */}
        <Card className="relative overflow-hidden border border-slate-100 hover:-translate-y-1 hover:shadow-md transition-all duration-300 bg-white">
          <div className="absolute top-0 right-0 w-24 h-24 -mr-4 -mt-4 bg-amber-50 rounded-full -z-0 opacity-40" />
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Processing Time</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
                  {(summary?.avgTaskCompletionDays ?? 0).toFixed(1)}
                  <span className="text-sm font-medium text-slate-400"> days</span>
                </h3>
                <div className="flex items-center gap-1 mt-2 text-xs font-medium text-amber-600">
                  <Clock className="h-3 w-3" />
                  Issue Resolution: {(summary?.avgIssueResolutionDays ?? 0).toFixed(1)} days
                </div>
              </div>
              <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
                <Activity className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
              <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-spin" />
              <span>Forecast based on completed tasks</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selector: Project Specific Analytics */}
      <Card className="border border-slate-100 shadow-sm bg-gradient-to-r from-slate-50 to-white">
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-indigo-600" />
              View Project Details
            </h4>
            <p className="text-xs text-slate-500">Select a specific project to track velocity, deadlines, and status distribution</p>
          </div>
          <div className="w-full md:w-80">
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger className="bg-white border-slate-200 focus:ring-indigo-500">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">📊 All Projects (System-wide)</SelectItem>
                {projectReports.map((report) => (
                  <SelectItem 
                    key={report.project?.projectId} 
                    value={String(report.project?.projectId)}
                  >
                    📂 {report.project?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Project Specific Panel */}
      {selectedProjectId !== "all" && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {projectLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mr-3" />
              <span className="text-slate-500 font-medium">Analyzing project data...</span>
            </div>
          ) : projectAnalytics ? (
            <>
              {/* Project Stats Banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border border-slate-100 shadow-sm bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-slate-500 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Project Tasks Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-3xl font-extrabold text-slate-900">{projectAnalytics.completedTasks}/{projectAnalytics.totalTasks}</span>
                      <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none font-bold">
                        {(projectAnalytics.taskCompletionRate ?? 0).toFixed(1)}%
                      </Badge>
                    </div>
                    <Progress value={projectAnalytics.taskCompletionRate} className="h-2 bg-slate-100" />
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t text-slate-500">
                      <div>Completed this week: <strong className="text-slate-900">{projectAnalytics.tasksCompletedThisWeek}</strong></div>
                      <div>This month: <strong className="text-slate-900">{projectAnalytics.tasksCompletedThisMonth}</strong></div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-slate-100 shadow-sm bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-slate-500 flex items-center gap-2">
                      <Bug className="h-4 w-4 text-blue-500" />
                      Project Issues Resolution
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-3xl font-extrabold text-slate-900">{projectAnalytics.resolvedIssues}/{projectAnalytics.totalIssues}</span>
                      <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none font-bold">
                        {(projectAnalytics.issueResolutionRate ?? 0).toFixed(1)}%
                      </Badge>
                    </div>
                    <Progress value={projectAnalytics.issueResolutionRate} className="h-2 bg-slate-100" />
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t text-slate-500">
                      <div>Resolved this week: <strong className="text-slate-900">{projectAnalytics.issuesResolvedThisWeek}</strong></div>
                      <div>This month: <strong className="text-slate-900">{projectAnalytics.issuesResolvedThisMonth}</strong></div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-slate-100 shadow-sm bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-slate-500 flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-amber-500" />
                      Time & Velocity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Start:</span>
                      <span className="font-semibold text-slate-800">{new Date(projectAnalytics.projectStartDate).toLocaleDateString("en-US")}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Deadline:</span>
                      <span className="font-semibold text-slate-800">{new Date(projectAnalytics.projectEndDate).toLocaleDateString("en-US")}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t text-xs">
                      <span className="text-slate-500">Days remaining:</span>
                      <Badge variant={projectAnalytics.daysRemaining > 0 ? "secondary" : "destructive"}>
                        {projectAnalytics.daysRemaining} days
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 flex items-center gap-1">
                        Velocity:
                        <span title="Average number of tasks completed per day">
                          <HelpCircle className="h-3 w-3 text-slate-400" />
                        </span>
                      </span>
                      <span className="font-extrabold text-indigo-600">{(projectAnalytics.dailyTaskVelocity ?? 0).toFixed(2)} tasks/day</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Project Specific Distributions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project Task Distribution */}
                <Card className="border border-slate-100 shadow-sm bg-white">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold text-slate-600">Task Status Distribution</CardTitle>
                    <CardDescription>Actual status of tasks in project {projectAnalytics.projectName}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    {(!projectAnalytics?.taskStatusDistribution || projectAnalytics.taskStatusDistribution.length === 0) ? (
                      <div className="py-12 text-center text-slate-400 text-xs">No task data available</div>
                    ) : (
                      <div className="w-full flex flex-col md:flex-row items-center justify-around gap-6">
                        <div className="h-[200px] w-[200px] relative">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={(projectAnalytics.taskStatusDistribution || []) as any}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={3}
                                dataKey="count"
                                nameKey="status"
                              >
                                {(projectAnalytics.taskStatusDistribution || []).map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || "#cbd5e1"} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-extrabold text-slate-800">{projectAnalytics.totalTasks}</span>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Tasks</span>
                          </div>
                        </div>
                        <div className="space-y-2 w-full md:w-auto">
                          {(projectAnalytics.taskStatusDistribution || []).map((entry) => (
                            <div key={entry.status} className="flex items-center justify-between gap-4 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_COLORS[entry.status] || "#cbd5e1" }} />
                                <span className="font-medium text-slate-700">{entry.status}</span>
                              </div>
                              <span className="font-semibold text-slate-900">{entry.count} ({(entry.percentage ?? 0).toFixed(1)}%)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Project Issue Distribution */}
                <Card className="border border-slate-100 shadow-sm bg-white">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold text-slate-600">Issue Status Distribution</CardTitle>
                    <CardDescription>Actual status of issues in project {projectAnalytics.projectName}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    {(!projectAnalytics?.issueStatusDistribution || projectAnalytics.issueStatusDistribution.length === 0) ? (
                      <div className="py-12 text-center text-slate-400 text-xs">No issue data available</div>
                    ) : (
                      <div className="w-full flex flex-col md:flex-row items-center justify-around gap-6">
                        <div className="h-[200px] w-[200px] relative">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={(projectAnalytics.issueStatusDistribution || []) as any}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={3}
                                dataKey="count"
                                nameKey="status"
                              >
                                {(projectAnalytics.issueStatusDistribution || []).map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || "#cbd5e1"} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-extrabold text-slate-800">{projectAnalytics.totalIssues}</span>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Issues</span>
                          </div>
                        </div>
                        <div className="space-y-2 w-full md:w-auto">
                          {(projectAnalytics.issueStatusDistribution || []).map((entry) => (
                            <div key={entry.status} className="flex items-center justify-between gap-4 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_COLORS[entry.status] || "#cbd5e1" }} />
                                <span className="font-medium text-slate-700">{entry.status}</span>
                              </div>
                              <span className="font-semibold text-slate-900">{entry.count} ({(entry.percentage ?? 0).toFixed(1)}%)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* Trends & Timeline Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Graph */}
        <Card className="lg:col-span-2 border border-slate-100 shadow-sm bg-white">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                Trend Chart
              </CardTitle>
              <CardDescription>Track quantity of new vs completed tasks/issues</CardDescription>
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {/* Time Range */}
              <div className="flex border border-slate-200 rounded-lg p-0.5 bg-slate-50 text-xs">
                {(["7d", "30d", "90d"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTimeRange(r)}
                    className={`px-3 py-1 rounded-md font-medium transition-all ${
                      timeRange === r ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {r === "7d" ? "7 days" : r === "30d" ? "30 days" : "90 days"}
                  </button>
                ))}
              </div>

              {/* Granularity */}
              <Select 
                value={granularity} 
                onValueChange={(val: any) => setGranularity(val)}
              >
                <SelectTrigger className="w-[110px] h-8 text-xs bg-white border-slate-200">
                  <SelectValue placeholder="Granularity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAILY" className="text-xs">Daily</SelectItem>
                  <SelectItem value="MONTHLY" className="text-xs">Monthly</SelectItem>
                  <SelectItem value="YEARLY" className="text-xs">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent className="relative min-h-[300px]">
            {trendLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mr-2" />
                <span className="text-sm text-slate-500 font-medium">Drawing chart...</span>
              </div>
            ) : null}
            
            {combinedTrendData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-slate-400">
                <Activity className="h-10 w-10 mb-2 text-slate-300" />
                <p className="text-xs">No trend data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={combinedTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="label" 
                    stroke="#94a3b8" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => {
                      try {
                        if (granularity === "DAILY") {
                          // Format: YYYY-MM-DD to DD/MM
                          const parts = val.split("-")
                          if (parts.length === 3) return `${parts[2]}/${parts[1]}`
                        }
                      } catch {}
                      return val
                    }}
                  />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      fontSize: "12px"
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", paddingTop: "15px" }} />
                  <Area type="monotone" dataKey="completedTasks" name="Completed Tasks" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCompleted)" />
                  <Area type="monotone" dataKey="createdTasks" name="New Tasks" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorCreated)" />
                  <Line type="monotone" dataKey="completedIssues" name="Resolved Issues" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="createdIssues" name="New Issues" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Priority distributions side column */}
        <div className="space-y-6">
          {/* Tasks Priority Pie */}
          <Card className="border border-slate-100 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                <PieChartIcon className="h-4 w-4 text-indigo-500" />
                Task Priority
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(!summary?.taskPriorityDistribution || summary.taskPriorityDistribution.length === 0) ? (
                <div className="py-12 text-center text-slate-400 text-xs">No priority data available</div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="h-[140px] w-[140px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={(summary.taskPriorityDistribution || []) as any}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={60}
                          paddingAngle={2}
                          dataKey="count"
                          nameKey="priority"
                        >
                          {(summary.taskPriorityDistribution || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.priority] || "#cbd5e1"} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-bold text-slate-800">{summary?.totalTasks}</span>
                      <span className="text-[8px] uppercase tracking-wider text-slate-400">Priority</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 w-full mt-4 text-[10px]">
                    {(summary.taskPriorityDistribution || []).map((entry) => (
                      <div key={entry.priority} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PRIORITY_COLORS[entry.priority] || "#cbd5e1" }} />
                          <span className="font-semibold text-slate-600">{entry.priority}</span>
                        </div>
                        <span className="text-slate-900 font-bold">{entry.count} ({(entry.percentage ?? 0).toFixed(0)}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Issues Priority Pie */}
          <Card className="border border-slate-100 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                <PieChartIcon className="h-4 w-4 text-orange-500" />
                Issue Priority
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(!summary?.issuePriorityDistribution || summary.issuePriorityDistribution.length === 0) ? (
                <div className="py-12 text-center text-slate-400 text-xs">No priority data available</div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="h-[140px] w-[140px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={(summary.issuePriorityDistribution || []) as any}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={60}
                          paddingAngle={2}
                          dataKey="count"
                          nameKey="priority"
                        >
                          {(summary.issuePriorityDistribution || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.priority] || "#cbd5e1"} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-bold text-slate-800">{summary?.totalIssues}</span>
                      <span className="text-[8px] uppercase tracking-wider text-slate-400">Priority</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 w-full mt-4 text-[10px]">
                    {(summary.issuePriorityDistribution || []).map((entry) => (
                      <div key={entry.priority} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PRIORITY_COLORS[entry.priority] || "#cbd5e1" }} />
                          <span className="font-semibold text-slate-600">{entry.priority}</span>
                        </div>
                        <span className="text-slate-900 font-bold">{entry.count} ({(entry.percentage ?? 0).toFixed(0)}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Global Status Distributions (Tasks vs Issues) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task Status */}
        <Card className="border border-slate-100 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">System-wide Task Status Distribution</CardTitle>
            <CardDescription>Count and percentage of tasks by status</CardDescription>
          </CardHeader>
          <CardContent>
            {(!summary?.taskStatusDistribution || summary.taskStatusDistribution.length === 0) ? (
              <div className="py-12 text-center text-slate-400 text-sm">No status data available</div>
            ) : (
              <div className="space-y-4">
                {(summary.taskStatusDistribution || []).map((item) => (
                  <div key={item.status} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_COLORS[item.status] || "#cbd5e1" }} />
                        <span className="text-slate-700">{item.status}</span>
                      </div>
                      <span className="text-slate-900">{item.count} ({(item.percentage ?? 0).toFixed(1)}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ 
                          width: `${item.percentage}%`,
                          backgroundColor: STATUS_COLORS[item.status] || "#cbd5e1" 
                        }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Issue Status */}
        <Card className="border border-slate-100 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">System-wide Issue Status Distribution</CardTitle>
            <CardDescription>Count and percentage of issues by status</CardDescription>
          </CardHeader>
          <CardContent>
            {(!summary?.issueStatusDistribution || summary.issueStatusDistribution.length === 0) ? (
              <div className="py-12 text-center text-slate-400 text-sm">No status data available</div>
            ) : (
              <div className="space-y-4">
                {(summary.issueStatusDistribution || []).map((item) => (
                  <div key={item.status} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_COLORS[item.status] || "#cbd5e1" }} />
                        <span className="text-slate-700">{item.status}</span>
                      </div>
                      <span className="text-slate-900">{item.count} ({(item.percentage ?? 0).toFixed(1)}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ 
                          width: `${item.percentage}%`,
                          backgroundColor: STATUS_COLORS[item.status] || "#cbd5e1" 
                        }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
