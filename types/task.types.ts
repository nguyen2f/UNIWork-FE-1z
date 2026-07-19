import type { IssueDTO } from "./issue.types"

// Task module types

export interface TaskDTO {
  taskId: number
  projectId: number
  assignedTo: number
  createdBy: number
  managedBy?: number | null
  title: string
  description: string
  priority: string
  status: string
  completed: boolean
  dueDate: string
  createdDate: string
  updatedDate: string | null
  type: string
  assigneeName: string
  createdByName?: string | null
  managedByName?: string | null
  projectName?: string | null
  issueCount?: number
  taskParentId: number | null
  stageId: number
  stageName: string
}

export interface TaskDetailDTO {
  task: TaskDTO
  childTasks: TaskDTO[]
  comments: CommentDTO[]
  fileAttachments: FileAttachmentDTO[]
  issues?: IssueDTO[]
}

export interface TaskRequest {
  projectId: number
  stageId: number
  assignedTo: number[]
  title: string
  description: string
  priority: number
  status: number
  dueDate: string
  type: string
}

export interface CommentDTO {
  commentId: number
  taskId: number
  posterId: number
  authorId: number
  content: string
  createdDate: string
  updatedDate: string
  authorName: string
}

export interface AddComment {
  taskId: number
  posterId: number
  authorId: number
  content: string
  createdDate?: string
  updatedDate?: string
}

export interface FileAttachmentDTO {
  id: number
  taskId: number
  uploaderId: number
  fileName: string
  url: string
  fileType: string
  fileSize: number
  uploadDate: string
}

export type Task = TaskDTO;

export interface TaskPerformance {
  userId: number
  totalTasks: number
  doneTasks: number
  performance: number
  remainingTasks: number
}
