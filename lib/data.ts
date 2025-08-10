import type { Project, Task, User, Message, Notification } from "@/types"

// Mock data - trong thực tế sẽ lấy từ database
export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@company.com",
    name: "Admin User",
    role: "admin",
    avatar: "AU",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: "manager@company.com",
    name: "Project Manager",
    role: "manager",
    avatar: "PM",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    email: "developer@company.com",
    name: "Senior Developer",
    role: "member",
    avatar: "SD",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    email: "designer@company.com",
    name: "UI Designer",
    role: "member",
    avatar: "UD",
    createdAt: "2024-01-01T00:00:00Z",
  },
]

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Redesign company website with modern UI/UX",
    status: "active",
    priority: "high",
    startDate: "2024-02-01",
    endDate: "2024-04-30",
    budget: 50000,
    progress: 65,
    createdBy: "2",
    members: [],
    tasks: [],
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-15T00:00:00Z",
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "Develop mobile app for iOS and Android",
    status: "active",
    priority: "critical",
    startDate: "2024-01-15",
    endDate: "2024-06-15",
    budget: 100000,
    progress: 40,
    createdBy: "2",
    members: [],
    tasks: [],
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-02-15T00:00:00Z",
  },
]

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Design Homepage Layout",
    description: "Create wireframes and mockups for homepage",
    status: "completed",
    priority: "high",
    assigneeId: "4",
    projectId: "1",
    dueDate: "2024-02-20",
    createdBy: "2",
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-18T00:00:00Z",
    assignee: mockUsers[3],
  },
  {
    id: "2",
    title: "Implement User Authentication",
    description: "Add login/register functionality",
    status: "in-progress",
    priority: "critical",
    assigneeId: "3",
    projectId: "1",
    dueDate: "2024-02-25",
    createdBy: "2",
    createdAt: "2024-02-05T00:00:00Z",
    updatedAt: "2024-02-15T00:00:00Z",
    assignee: mockUsers[2],
  },
]

export const mockMessages: Message[] = [
  {
    id: "1",
    content: "Hey team, let's discuss the project timeline",
    senderId: "2",
    projectId: "1",
    type: "project",
    createdAt: "2024-02-15T10:00:00Z",
    sender: mockUsers[1],
  },
  {
    id: "2",
    content: "The design mockups are ready for review",
    senderId: "4",
    projectId: "1",
    type: "project",
    createdAt: "2024-02-15T11:00:00Z",
    sender: mockUsers[3],
  },
]

export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Task Assigned",
    message: "You have been assigned to 'Implement User Authentication'",
    type: "task",
    userId: "3",
    isRead: false,
    createdAt: "2024-02-15T09:00:00Z",
    data: { taskId: "2" },
  },
  {
    id: "2",
    title: "Project Updated",
    message: "Website Redesign project has been updated",
    type: "project",
    userId: "4",
    isRead: false,
    createdAt: "2024-02-15T08:00:00Z",
    data: { projectId: "1" },
  },
]
