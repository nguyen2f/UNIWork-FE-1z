import exp from "node:constants";

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    email: string
    name: string
    password: string
}

export interface UpdateProfileRequest {
    name: string;
    email: string;
    password: string;
    address: string;
    phone: string;
    department: string;
}

export interface ProjectRequest {
    projectId: number;
    name: string;
    description: string;
    status: number;
    startDate: string;
    endDate: string;
    priority: number;
    category: string;
    client: string;
    department: string;
    riskLevel: string;
}

export interface AssignMemberRequest {
    projectId: number;
    userId: number;
    role: string;
}

export interface RemoveMemberRequest {
    projectId: number;
    memberId: number;
}

export interface TaskRequest {
    taskId: number;
    projectId: number;
    assignedTo: number[];
    title: string;
    description: string;
    priority: number;
    status: number;
    dueDate: string;
    createdDate: string;
    updatedDate: string;
    tags: string;
}

export interface AddComment {
    taskId: number;
    posterId: number;
    authorId: number;
    content: string;
    createdDate: string;
    updatedDate: string;
}

export interface UploadFileAttachmentRequest {
    taskId: number;
    uploaderId: number;
    fileName: string;
    url: string;
    fileType: string;
    fileSize: number;
    uploadDate: string;
}

export interface CreateEventRequest {
    title: string;
    projectId: number;
    date: string;
    duration: string;
    type: string;
    location: string;
    priority: number;
    createdBy: number;
}
