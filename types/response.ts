export interface LoginResponse {
    userId: string;
    token: string;
}

export interface ProjectReport {
    project: {
        projectId: number;
        name: string | null;
        description: string | null;
        priority: string;
        category: string | null;
        client: string | null;
        department: string | null;
        riskLevel: string | null;
        ownerId: number;
        startDate: string | null;
        endDate: string | null;
        status: string;
        createdDate: string;
        updatedDate: string | null;
    };
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    doingTasks: number;
    completedPercent: number;
    countMember: number;
}

export interface TaskPerformance {
    userId: number;
    totalTasks: number;
    doneTasks: number;
    performance: number;
}