// Report module types

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
