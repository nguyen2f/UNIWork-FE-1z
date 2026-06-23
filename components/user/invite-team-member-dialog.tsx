"use client"

import React, { useEffect, useState } from "react"
import { Modal, Form, Select, Button, Space, message, Input } from "antd"
import { getAllProjects, projectService } from "@/services/project.service"
import { getAllMember } from "@/services/user.service"
import { Project } from "@/types/project.types"
import { User } from "@/types/user.types"

interface InviteMemberDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

/** Role enum khớp backend */
enum ProjectRole {
    PROJECT_MANAGER = "PROJECT_MANAGER",
    MOBILE_DEVELOPER = "MOBILE_DEVELOPER",
    TESTER = "TESTER",
    IOT_ENGINEER = "IOT_ENGINEER",
    BA = "BA",
    DATA_ENGINEER = "DATA_ENGINEER",
    BACKEND_DEVELOPER = "BACKEND_DEVELOPER",
    UIUX_DESIGNER = "UIUX_DESIGNER",
    AI_ENGINEER = "AI_ENGINEER",
    BI_ANALYST = "BI_ANALYST",
    FULLSTACK_DEVELOPER = "FULLSTACK_DEVELOPER",
    DEVOPS = "DEVOPS",
    FRONTEND_DEVELOPER = "FRONTEND_DEVELOPER",
}

export function InviteMemberToProjectDialog({
                                                open,
                                                onOpenChange,
                                            }: InviteMemberDialogProps) {
    const [form] = Form.useForm()
    const [allProjects, setAllProjects] = useState<Project[]>([])
    const [allUsers, setAllUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open) {
            fetchAllProjects()
            fetchAllUsers()
        }
    }, [open])

    const fetchAllProjects = async () => {
        try {
            const response = await getAllProjects()
            setAllProjects((response as any).data || response || [])
        } catch {
            message.error("Failed to fetch projects")
        }
    }

    const fetchAllUsers = async () => {
        try {
            const response = await getAllMember()
            setAllUsers(response.data)
        } catch {
            message.error("Failed to fetch users")
        }
    }

    /** Khi chọn user → auto fill email */
    const handleUserChange = (userId?: number) => {
        const user = allUsers.find((u) => u.userId === userId)
        if (user?.email) {
            form.setFieldsValue({ email: user.email })
        }
    }

    const handleSubmit = async (values: any) => {
        const { projectId, userId, role, email } = values

        /** 👉 LẤY projectName TỪ projectId */
        const project = allProjects.find(
            (p) => p.projectId === projectId
        )

        if (!project) {
            message.error("Project not found")
            return
        }

        try {
            setLoading(true)

            await projectService.assignMember(
                projectId,
                { userId, role, email } as any
            )

            const user = allUsers.find((u) => u.userId === userId)

            message.success(
                `${user?.name ?? email} has been invited to project ${project.name}`,
                3
            )

            form.resetFields()
            onOpenChange(false)
        } catch {
            message.error("Failed to invite member to project")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            open={open}
            onCancel={() => onOpenChange(false)}
            title="Invite Member to Project"
            footer={null}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                {/* Project */}
                <Form.Item
                    label="Project"
                    name="projectId"
                    rules={[{ required: true, message: "Please select a project" }]}
                >
                    <Select
                        placeholder="Select project"
                        showSearch
                        optionFilterProp="children"
                    >
                        {allProjects
                            .filter((project) => project !== null)
                            .map((project) => (
                                <Select.Option
                                    key={project.projectId}
                                    value={project.projectId}
                                >
                                    {project.name}
                                </Select.Option>
                            ))}
                    </Select>
                </Form.Item>


                {/* User */}
                <Form.Item label="User" name="userId">
                    <Select
                        placeholder="Select user (optional)"
                        showSearch
                        allowClear
                        optionFilterProp="children"
                        onChange={handleUserChange}
                    >
                        {allUsers.map((user) => (
                            <Select.Option key={user.userId} value={user.userId}>
                                {user.name} - {user.email}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Email */}
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Please enter email" },
                        { type: "email", message: "Invalid email format" },
                    ]}
                >
                    <Input placeholder="Enter email address" />
                </Form.Item>

                {/* Role */}
                <Form.Item
                    label="Role"
                    name="role"
                    rules={[{ required: true, message: "Please select a role" }]}
                >
                    <Select placeholder="Select role">
                        {Object.values(ProjectRole).map((role) => (
                            <Select.Option key={role} value={role}>
                                {role.replaceAll("_", " ")}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Footer */}
                <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
                    <Space>
                        <Button onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Invite
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    )
}
