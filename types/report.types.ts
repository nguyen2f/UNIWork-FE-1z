// Report module types

export interface MemberKpiDTO {
  userId: number
  userName: string
  totalCompletedTasks: number
  totalHoursSpent: number
  kpiScore: number
}

export interface SingleProjectReportDTO {
  projectId: number
  projectName: string
  projectStatus: string
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  doingTasks: number
  reviewingTasks: number
  totalIssues: number
  openIssues: number
  resolvedIssues: number
  totalStages: number
  completedStages: number
  activeStages: number
  totalMembers: number
  progressPercent: number
}

export interface MemberWorkloadDTO {
  userId: number
  userName: string
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  doingTasks: number
  totalIssues: number
  resolvedIssues: number
  openIssues: number
  projectCount: number
}

export interface OverdueItemDTO {
  itemId: number
  itemType: "TASK" | "ISSUE"
  title: string
  projectId: number
  projectName: string
  status: string
  priority: string
  dueDate: string
  daysOverdue: number
  assigneeName: string | null
}

export interface StageReportDTO {
  stageId: number
  stageName: string
  stageStatus: string
  startDate: string
  endDate: string
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  doingTasks: number
  totalIssues: number
  openIssues: number
  resolvedIssues: number
  progressPercent: number
}

export interface StatusDistributionDTO {
  status: string
  count: number
  percentage: number
}

export interface PriorityDistributionDTO {
  priority: string
  count: number
  percentage: number
}

export interface TimeSeriesDataPoint {
  label: string
  tasks: number
  issues: number
}

export interface CompletionTrendDTO {
  granularity: string
  from: string
  to: string
  totalTasksCompleted: number
  totalIssuesCompleted: number
  dataPoints: TimeSeriesDataPoint[]
}

export interface CreationTrendDTO {
  granularity: string
  from: string
  to: string
  totalTasksCreated: number
  totalIssuesCreated: number
  dataPoints: TimeSeriesDataPoint[]
}

export interface AnalyticsSummaryDTO {
  totalTasks: number
  totalIssues: number
  totalProjects: number
  completedTasks: number
  completedIssues: number
  taskCompletionRate: number
  issueCompletionRate: number
  overdueTasks: number
  overdueIssues: number
  overdueRate: number
  avgTaskCompletionDays: number
  avgIssueResolutionDays: number
  taskStatusDistribution: StatusDistributionDTO[]
  issueStatusDistribution: StatusDistributionDTO[]
  taskPriorityDistribution: PriorityDistributionDTO[]
  issuePriorityDistribution: PriorityDistributionDTO[]
}

export interface ProjectAnalyticsDTO {
  projectId: number
  projectName: string
  totalTasks: number
  completedTasks: number
  taskCompletionRate: number
  totalIssues: number
  resolvedIssues: number
  issueResolutionRate: number
  tasksCompletedThisWeek: number
  tasksCompletedThisMonth: number
  issuesResolvedThisWeek: number
  issuesResolvedThisMonth: number
  projectStartDate: string
  projectEndDate: string
  daysRemaining: number
  dailyTaskVelocity: number
  taskStatusDistribution: StatusDistributionDTO[]
  issueStatusDistribution: StatusDistributionDTO[]
}
