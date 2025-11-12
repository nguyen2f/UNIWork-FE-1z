"use client"

import { useState } from "react"
import { Form, Input, Select, Avatar, Tag, Button, Space, Row, Col, message, Drawer, DatePicker } from "antd"
import { UserOutlined } from "@ant-design/icons"
import dayjs from "dayjs"
import { createProject } from "@/app/services/projectService"
import type { CreateProject } from "@/types/projectType"

interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ProjectStatus = {
  PLANNING: 0,
  IN_PROGRESS: 1,
  ON_HOLD: 2,
  COMPLETED: 3,
  CANCELLED: 4,
} as const

const Priority = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
} as const

const RiskLevel = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
} as const

const teamMembers = [
  { id: "1", name: "Sarah Johnson", role: "Designer", avatar: "/placeholder-user.jpg" },
  { id: "2", name: "Michael Chen", role: "Developer", avatar: "/placeholder-user.jpg" },
  { id: "3", name: "Emma Wilson", role: "Manager", avatar: "/placeholder-user.jpg" },
  { id: "4", name: "David Brown", role: "Developer", avatar: "/placeholder-user.jpg" },
]

export function CreateProjectDialog({ open, onOpenChange }: CreateProjectDialogProps) {
  const [form] = Form.useForm()
  const [assignedTo, setAssignedTo] = useState<string>()

  const handleSubmit = async (values: any) => {
    try {
      const formData: CreateProject = {
        name: values.name,
        description: values.description || "",
        status: values.status || ProjectStatus.PLANNING,
        startDate: values.startDate ? dayjs(values.startDate).format("YYYY-MM-DD") : "",
        endDate: values.endDate ? dayjs(values.endDate).format("YYYY-MM-DD") : "",
        priority: values.priority || Priority.MEDIUM,
        category: values.category || "",
        client: values.client || "",
        department: values.department || "",
        riskLevel: values.riskLevel || RiskLevel.MEDIUM,
      }

      const response = await createProject(formData)

      message.success("Project created successfully!", 3)
      onOpenChange(false)
      form.resetFields()
      setAssignedTo(undefined)
    } catch (error) {
      message.error("Failed to create project")
      console.error(error)
    }
  }

  const toggleMember = (memberId: string) => {
    setAssignedTo(memberId)
  }

  return (
    <Drawer open={open} onClose={() => onOpenChange(false)} width={800} title="Create Project">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: ProjectStatus.PLANNING,
          priority: Priority.MEDIUM,
          riskLevel: RiskLevel.MEDIUM,
        }}
      >
        <Form.Item label="Project Name" name="name" rules={[{ required: true, message: "Please enter project name!" }]}>
          <Input placeholder="Enter project name" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea placeholder="Enter project description" rows={4} />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Status" name="status">
              <Select placeholder="Select Status">
                <Select.Option value={ProjectStatus.PLANNING}>Planning</Select.Option>
                <Select.Option value={ProjectStatus.IN_PROGRESS}>In Progress</Select.Option>
                <Select.Option value={ProjectStatus.ON_HOLD}>On Hold</Select.Option>
                <Select.Option value={ProjectStatus.COMPLETED}>Completed</Select.Option>
                <Select.Option value={ProjectStatus.CANCELLED}>Cancelled</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Priority" name="priority">
              <Select placeholder="Select Priority">
                <Select.Option value={Priority.LOW}>Low</Select.Option>
                <Select.Option value={Priority.MEDIUM}>Medium</Select.Option>
                <Select.Option value={Priority.HIGH}>High</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Start Date" name="startDate">
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="End Date" name="endDate">
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Category" name="category">
          <Select placeholder="Select Category">
            <Select.Option value="Web Development">Web Development</Select.Option>
            <Select.Option value="Mobile Development">Mobile Development</Select.Option>
            <Select.Option value="UI/UX Design">UI/UX Design</Select.Option>
            <Select.Option value="SEO">SEO</Select.Option>
            <Select.Option value="Digital Marketing">Digital Marketing</Select.Option>
            <Select.Option value="Content Writing">Content Writing</Select.Option>
            <Select.Option value="Graphic Design">Graphic Design</Select.Option>
            <Select.Option value="Video Editing">Video Editing</Select.Option>
            <Select.Option value="Social Media Management">Social Media Management</Select.Option>
          </Select>
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Client" name="client">
              <Input placeholder="Enter client name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Department" name="department">
              <Select placeholder="Select Department">
                <Select.Option value="IT">IT</Select.Option>
                <Select.Option value="HR">HR</Select.Option>
                <Select.Option value="Finance">Finance</Select.Option>
                <Select.Option value="Marketing">Marketing</Select.Option>
                <Select.Option value="Sales">Sales</Select.Option>
                <Select.Option value="Customer Service">Customer Service</Select.Option>
                <Select.Option value="Engineering">Engineering</Select.Option>
                <Select.Option value="Design">Design</Select.Option>
                <Select.Option value="Legal">Legal</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Risk Level" name="riskLevel">
          <Select placeholder="Select Risk Level">
            <Select.Option value={RiskLevel.LOW}>Low</Select.Option>
            <Select.Option value={RiskLevel.MEDIUM}>Medium</Select.Option>
            <Select.Option value={RiskLevel.HIGH}>High</Select.Option>
            <Select.Option value={RiskLevel.CRITICAL}>Critical</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Assign Team Members">
          <Row gutter={[8, 8]}>
            {teamMembers.map((member) => (
              <Col span={12} key={member.id}>
                <div
                  onClick={() => toggleMember(member?.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: 12,
                    borderRadius: 8,
                    border: "1px solid #d9d9d9",
                    cursor: "pointer",
                    backgroundColor: assignedTo === member.id ? "#e6f7ff" : "#fff",
                    borderColor: assignedTo === member.id ? "#1890ff" : "#d9d9d9",
                    transition: "all 0.3s",
                  }}
                >
                  <Avatar size={32} src={member.avatar} icon={<UserOutlined />} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{member.name}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>{member.role}</div>
                  </div>
                  {assignedTo === member.id && <Tag color="blue">✓</Tag>}
                </div>
              </Col>
            ))}
          </Row>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
          <Space>
            <Button onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Create Project
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
