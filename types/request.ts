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

export interface AddComment {
    taskId: number;
    posterId: number;
    authorId: number;
    content: string;
    createdDate: string;
    updatedDate?: string;
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
