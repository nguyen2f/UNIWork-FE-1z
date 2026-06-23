"use client"

import { useState, useEffect } from "react"
import { Modal, Form, Select, Button, message } from "antd"
import { userService } from "@/services/user.service"
import { projectService } from "@/services/project.service"
import { User } from "@/types"

interface AddProjectMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: number
  onSuccess: () => void
}

export function AddProjectMemberDialog({ open, onOpenChange, projectId, onSuccess }: AddProjectMemberDialogProps) {
  const [form] = Form.useForm()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchingUsers, setFetchingUsers] = useState(false)

  useEffect(() => {
    if (open) {
      fetchUsers()
    } else {
      form.resetFields()
    }
  }, [open])

  const fetchUsers = async () => {
    setFetchingUsers(true)
    try {
      const response = await userService.getAll()
      // @ts-ignore
      setUsers(response.data || response || [])
    } catch (error) {
      message.error("Failed to fetch users")
    } finally {
      setFetchingUsers(false)
    }
  }

  const handleSubmit = async (values: { userId: number; role: string }) => {
    setLoading(true)
    try {
      await projectService.assignMember(projectId, {
        userId: values.userId,
        role: values.role,
      })
      message.success("Member added successfully")
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to add member")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="Add Team Member to Project"
      open={open}
      onCancel={() => onOpenChange(false)}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
        <Form.Item
          name="userId"
          label="Member"
          rules={[{ required: true, message: "Please select a member" }]}
        >
          <Select
            showSearch
            placeholder="Select a member"
            loading={fetchingUsers}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={users.map((user) => ({
              value: user.userId,
              label: `${user.name} (${user.email})`,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <Select placeholder="Select a role">
            <Select.Option value="PROJECT_MANAGER">Project Manager (PROJECT_MANAGER)</Select.Option>
            <Select.Option value="MEMBER">Member (MEMBER)</Select.Option>
          </Select>
        </Form.Item>

        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading} className="bg-blue-600">
            Add Member
          </Button>
        </div>
      </Form>
    </Modal>
  )
}
