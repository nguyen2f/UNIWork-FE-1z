export interface UpdateProfileRequest {
    name: string;
    email: string;
    password: string;
    address: string;
    phone: string;
    department: string;
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

