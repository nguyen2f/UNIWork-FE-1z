export interface IssueDTO {
  issueId: number
  taskId: number
  projectId: number
  title: string
  description: string
  status: string
  type: string
  issueType?: string // backward compat alias
  priority: string
  assignedTo: number | null
  assigneeName: string | null
  reportedBy: number | null
  reporterName: string
  dueDate: string | null
  createdDate: string
  updatedDate: string | null
  taskTitle: string | null
  // legacy aliases
  assignedToName?: string | null
  projectName?: string | null
}

export interface IssueRequest {
  taskId: number
  projectId: number
  title: string
  description: string
  status?: string | number
  type?: string | number
  issueType?: string | number
  priority?: string | number
  assignedTo: number | null
  dueDate?: string | null
}
