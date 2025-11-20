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
  status: "PLANNING" | "IN_PROGRESS" | "ON_HOLD" | "COMPLETED" | "CANCELLED"
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
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
  taskId: string
  title: string
  description: string
  status: "PENDING" | "DOING" | "REVIEWING" | "COMPLETED" | "CANCELLED"
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  assigneeId: string
  projectId: string
  dueDate: string
  createdBy: string
  createdAt: string
  updatedAt: string
  assignee: User
}

export interface Message {
  messageId: string
  content: string
  senderId: string
  projectId?: string
  receiverId?: string
  type: "direct" | "project"
  createdAt: string
  sender: User
}

export interface Notification {
  notificationId: string
  title: string
  message: string
  type: "task" | "project" | "message" | "system"
  userId: string
  isRead: boolean
  createdAt: string
  data?: any
}

export interface Event {
  eventId: string
  title: string
  projectId: number
  date: string
  duration: string
  type: string
  location: string
  priority: string
  createdBy: number
}
