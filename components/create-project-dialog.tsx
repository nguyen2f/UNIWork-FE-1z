"use client"

import type React from "react"

import { useState } from "react"
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Avatar,
  Tag,
  Button,
  Space,
  Row,
  Col,
  message,
  Drawer
} from "antd"
import { CalendarOutlined, UserOutlined } from "@ant-design/icons"
import dayjs from "dayjs"
import DateRangePicker from "@/components/ui/DateRangePicker"
import { createProject } from "@/app/services/projectService"
interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

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
      const { dateRange, ...rest } = values
      const formData = {
        ...rest,
          startDate: dateRange?.[0] ? dayjs(dateRange[0]).format("YYYY-MM-DD HH:mm:ss") : null,
          endDate:   dateRange?.[1] ? dayjs(dateRange[1]).format("YYYY-MM-DD HH:mm:ss") : null,
          assignedTo: teamMembers?.find((member) => member.id === assignedTo)?.name,
      }

      const response = await createProject(formData)

      message.success("Project created successfully!", 3)
      onOpenChange(false)
      form.resetFields()
      setAssignedTo(undefined)
    } catch (error) {
      message.error("Failed to create project")
    }
  }

  const toggleMember = (memberId: string) => {
    // setAssignedTo(prev =>
    //   prev.includes(memberId)
    //     ? prev.filter((id) => id !== memberId)
    //     : [...prev, memberId]
    // )
    setAssignedTo(memberId)
  }

  return (
    <Modal
      open={open}
      onCancel={() => onOpenChange(false)}
      width={800}
      title="Create Project"
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: 1,
          priority: 2,
        }}
      >
        <Form.Item
          label="Project Name"
          name="name"
          rules={[{ required: true, message: 'Please enter project name!' }]}
        >
          <Input placeholder="Enter project name" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
        >
          <Input.TextArea
            placeholder="Enter project description"
            rows={4}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Status"
              name="status"
            >
              <Select placeholder="Select Status">
                <Select.Option value={0}>Planning</Select.Option>
                <Select.Option value={1}>In Progress</Select.Option>
                <Select.Option value={2}>On Hold</Select.Option>
                <Select.Option value={3}>Completed</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Priority"
              name="priority"
            >
              <Select>
                <Select.Option value={1}>Low</Select.Option>
                <Select.Option value={2}>Medium</Select.Option>
                <Select.Option value={3}>High</Select.Option>
                <Select.Option value={4}>Critical</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Select Date Range"
          name="dateRange"
        >
          <DateRangePicker />
        </Form.Item>
        <Form.Item
          label="Category"
          name="category"
          initialValue="Web Development"
        >
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
            <Form.Item
              label="Department"
              name="department"
              initialValue="IT"
            >
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
          <Col span={12}>
            <Form.Item
              label="Risk Level"
              name="riskLevel"
            >
              <Select placeholder="Select Risk Level">
                <Select.Option value="Low">Low</Select.Option>
                <Select.Option value="Medium">Medium</Select.Option>
                <Select.Option value="High">High</Select.Option>
                <Select.Option value="Critical">Critical</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        {/*<Form.Item label="Assign Team Members">*/}
        {/*  <Row gutter={[8, 8]}>*/}
        {/*    {teamMembers.map((member) => (*/}
        {/*      <Col span={12} key={member.id}>*/}
        {/*        <div*/}
        {/*          onClick={() => toggleMember(member?.id)}*/}
        {/*          style={{*/}
        {/*            display: 'flex',*/}
        {/*            alignItems: 'center',*/}
        {/*            gap: 12,*/}
        {/*            padding: 12,*/}
        {/*            borderRadius: 8,*/}
        {/*            border: '1px solid #d9d9d9',*/}
        {/*            cursor: 'pointer',*/}
        {/*            backgroundColor: assignedTo === member.id ? '#e6f7ff' : '#fff',*/}
        {/*            borderColor: assignedTo === member.id ? '#1890ff' : '#d9d9d9',*/}
        {/*            transition: 'all 0.3s'*/}
        {/*          }}*/}
        {/*        >*/}
        {/*          <Avatar*/}
        {/*            size={32}*/}
        {/*            src={member.avatar}*/}
        {/*            icon={<UserOutlined />}*/}
        {/*          />*/}
        {/*          <div style={{ flex: 1, minWidth: 0 }}>*/}
        {/*            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>*/}
        {/*              {member.name}*/}
        {/*            </div>*/}
        {/*            <div style={{ fontSize: 12, color: '#666' }}>*/}
        {/*              {member.role}*/}
        {/*            </div>*/}
        {/*          </div>*/}
        {/*          {assignedTo === member.id && (*/}
        {/*            <Tag color="blue">✓</Tag>*/}
        {/*          )}*/}
        {/*        </div>*/}
        {/*      </Col>*/}
        {/*    ))}*/}
        {/*  </Row>*/}
        {/*</Form.Item>*/}

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Create Project
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}
