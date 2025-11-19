export interface ProjectRequest {
    projectId?: number;
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
export interface ProjectParams {
    priority?: number
    status?: number
}
