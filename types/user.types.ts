// User module types

export interface Department {
  departmentId: number;
  departmentName: string;
  location: string;
  isDeleted?: boolean;
}

export interface User {
  userId: number
  email: string
  name: string
  password?: string
  department?: string
  departmentId?: number
  avatar?: string
  createdAt?: string
  systemRole?: string
  phone?: string
}

export enum SystemRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  EMPLOYEE = "EMPLOYEE",
}

export interface AdminCreateUserRequest {
  name: string
  email: string
  password: string
  systemRole: SystemRole
  departmentId?: number
}

export interface AdminCreateDepartmentRequest {
  departmentName: string
  location: string
}

export interface UpdateProfileRequest {
  name: string
  email: string
  password: string
  address: string
  phone: string
  department: string
}

export interface AssignMemberRequest {
  projectId: number
  userId: number
  role: string
}

export interface RemoveMemberRequest {
  projectId: number
  memberId: number
}
