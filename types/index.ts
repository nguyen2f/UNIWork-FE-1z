export interface User {
  userId: number
  email: string
  name: string
  department?: string
  avatar?: string
  createdAt?: string
}

export interface Project {
    projectId: number
    name: string
    description: string
    status: "PLANNING" | "IN_PROGRESS" | "ON_HOLD" | "COMPLETED" | "CANCELLED"
    priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
    startDate: string
    endDate: string
    budget: number
    progress: number
    client: string            // Khách hàng (ví dụ: SFIN JSC)
    department: string        // Phòng ban phụ trách (ví dụ: IT Department)
    riskLevel: "Low" | "Medium" | "High" // Mức độ rủi ro
    ownerId: number           // ID người sở hữu dự án
    createdBy: string
    members: ProjectMember[]
    tasks: Task[]
    createdAt: string
    updatedAt: string | null  // Cho phép null nếu chưa cập nhật
}

export interface ProjectMember {
  userId: string
  projectId: string
  role: "owner" | "manager" | "member" | "viewer"
  joinedAt: string
  user: User
}

export interface Task {
  taskId: number
  title: string
  description: string
  status: "PENDING" | "DOING" | "REVIEWING" | "COMPLETED" | "CANCELLED"
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  assigneeId: string
  projectId: number
  dueDate: string
  createdBy: string
    createdDate: string
  updatedDate: string
  assignee: User
}

export interface Message {
  messageId: number
  content: string
  senderId: number
  projectId?: number
  receiverId?: number
  type: "direct" | "project"
  createdAt: string
  sender: User
}

export interface Notification {
  notificationId: number
  title: string
  message: string
  type: "task" | "project" | "message" | "system"
  userId: number
  isRead: boolean
  createdAt: string
  data?: any
}

export interface Event {
  eventId: number
  title: string
  projectId: number
  date: string
  duration: string
  type: string
  location: string
  priority: string
  createdBy: number
}
