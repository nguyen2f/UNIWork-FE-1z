export interface User {
  userId: string
  email: string
  name: string
  department: string
  avatar: string
  createdAt: string
}

export interface Project {
  projectId: string
  name: string
  description: string
  status: "planning" | "active" | "completed" | "on-hold"
  priority: "low" | "medium" | "high" | "critical"
  startDate: string
  endDate: string
  budget: number
  progress: number
  createdBy: string
  members: ProjectMember[]
  tasks: Task[]
  createdAt: string
  updatedAt: string
}

export interface ProjectMember {
  userId: string
  projectId: string
  role: "owner" | "manager" | "member" | "viewer"
  joinedAt: string
  user: User
}

export interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "review" | "completed"
  priority: "low" | "medium" | "high" | "critical"
  assigneeId: string
  projectId: string
  dueDate: string
  createdBy: string
  createdAt: string
  updatedAt: string
  assignee: User
}

export interface Message {
  id: string
  content: string
  senderId: string
  projectId?: string
  receiverId?: string
  type: "direct" | "project"
  createdAt: string
  sender: User
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "task" | "project" | "message" | "system"
  userId: string
  isRead: boolean
  createdAt: string
  data?: any
}
