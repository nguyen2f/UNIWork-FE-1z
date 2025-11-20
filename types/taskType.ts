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
