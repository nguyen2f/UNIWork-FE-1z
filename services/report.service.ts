import { api } from "./http-client"
import type {
  SingleProjectReportDTO,
  MemberWorkloadDTO,
  OverdueItemDTO,
  StageReportDTO,
  StatusDistributionDTO,
  PriorityDistributionDTO,
  CompletionTrendDTO,
  CreationTrendDTO,
  AnalyticsSummaryDTO,
  ProjectAnalyticsDTO,
} from "@/types/report.types"

export const reportService = {
  getProjectReport: (page?: number, size?: number) =>
    api({ method: "GET", url: "/reports/project-report", params: { page, size } }, true),

  getTaskReport: () =>
    api({ method: "GET", url: "/reports/task-report" }, true),

  getPendingTasks: (page?: number, size?: number) =>
    api({ method: "GET", url: "/reports/task-report/pending-tasks", params: { page, size } }, true),

  getTasksPerformance: () =>
    api({ method: "GET", url: "/reports/task-report/tasks-performance" }, true),

  getUpcomingEvents: () =>
    api({ method: "GET", url: "/reports/event-report/upcoming-events" }, true),

  getPendingIssues: (page?: number, size?: number) =>
    api({ method: "GET", url: "/reports/task-report/pending-issues", params: { page, size } }, true),

  // New Report APIs
  getSingleProjectReport: (projectId: number) =>
    api<SingleProjectReportDTO>({ method: "GET", url: `/reports/project-report/${projectId}` }),

  getMemberWorkload: () =>
    api<MemberWorkloadDTO[]>({ method: "GET", url: "/reports/member-workload" }),

  getOverdueItems: () =>
    api<OverdueItemDTO[]>({ method: "GET", url: "/reports/overdue-items" }),

  getStageReport: (projectId: number) =>
    api<StageReportDTO[]>({ method: "GET", url: `/reports/stage-report/${projectId}` }),

  // 8 Analytics Endpoints
  getAnalyticsSummary: () =>
    api<AnalyticsSummaryDTO>({ method: "GET", url: "/reports/analytics/summary" }),

  getCompletionTrend: (granularity?: string, from?: number, to?: number) =>
    api<CompletionTrendDTO>({ method: "GET", url: "/reports/analytics/completion-trend", params: { granularity, from, to } }),

  getCreationTrend: (granularity?: string, from?: number, to?: number) =>
    api<CreationTrendDTO>({ method: "GET", url: "/reports/analytics/creation-trend", params: { granularity, from, to } }),

  getProjectAnalytics: (projectId: number) =>
    api<ProjectAnalyticsDTO>({ method: "GET", url: `/reports/analytics/project/${projectId}` }),

  getTaskStatusDistribution: (projectId?: number) =>
    api<StatusDistributionDTO[]>({ method: "GET", url: "/reports/analytics/task-status-distribution", params: { projectId } }),

  getIssueStatusDistribution: (projectId?: number) =>
    api<StatusDistributionDTO[]>({ method: "GET", url: "/reports/analytics/issue-status-distribution", params: { projectId } }),

  getTaskPriorityDistribution: () =>
    api<PriorityDistributionDTO[]>({ method: "GET", url: "/reports/analytics/task-priority-distribution" }),

  getIssuePriorityDistribution: () =>
    api<PriorityDistributionDTO[]>({ method: "GET", url: "/reports/analytics/issue-priority-distribution" }),
}

// Backward-compatible aliases
export const fetchProjectReport = reportService.getProjectReport
export const fetchTaskReport = reportService.getTaskReport
export const fetchPendingTasks = reportService.getPendingTasks
export const fetchPendingIssues = reportService.getPendingIssues
export const fetchTasksPerformance = reportService.getTasksPerformance
export const fetchUpcomingEvents = reportService.getUpcomingEvents
export const fetchSingleProjectReport = reportService.getSingleProjectReport
export const fetchMemberWorkload = reportService.getMemberWorkload
export const fetchOverdueItems = reportService.getOverdueItems
export const fetchStageReport = reportService.getStageReport

// New Analytics API exports
export const fetchAnalyticsSummary = reportService.getAnalyticsSummary
export const fetchCompletionTrend = reportService.getCompletionTrend
export const fetchCreationTrend = reportService.getCreationTrend
export const fetchProjectAnalytics = reportService.getProjectAnalytics
export const fetchTaskStatusDistribution = reportService.getTaskStatusDistribution
export const fetchIssueStatusDistribution = reportService.getIssueStatusDistribution
export const fetchTaskPriorityDistribution = reportService.getTaskPriorityDistribution
export const fetchIssuePriorityDistribution = reportService.getIssuePriorityDistribution
