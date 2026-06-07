"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  Space,
  message
} from "antd"
import dayjs from "dayjs"
import DateRangePicker from "@/components/ui/DateRangePicker"
import { projectService } from "@/services/project.service"
import { adminService } from "@/services/admin.service"
import type { Department } from "@/types/user.types"

interface EditProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: any
  onSuccess?: () => void
}

export function EditProjectDialog({ open, onOpenChange, project, onSuccess }: EditProjectDialogProps) {
  const [form] = Form.useForm()
  const [departments, setDepartments] = useState<Department[]>([])

  useEffect(() => {
    if (open) {
      adminService.getDepartments()
        .then((res: any) => {
          if (Array.isArray(res)) setDepartments(res)
          else if (res?.data && Array.isArray(res.data)) setDepartments(res.data)
        })
        .catch(err => console.error("Failed to load departments", err))
    }
  }, [open])

  useEffect(() => {
    if (open && project) {
      form.setFieldsValue({
        ...project,
        dateRange: project.startDate && project.endDate 
          ? [dayjs(project.startDate), dayjs(project.endDate)]
          : null
      })
    }
  }, [open, project, form])

  const handleSubmit = async (values: any) => {
    try {
      const { dateRange, ...rest } = values
      const formData = {
        ...rest,
        startDate: dateRange?.[0] ? dayjs(dateRange[0]).format("YYYY-MM-DD HH:mm:ss") : null,
        endDate:   dateRange?.[1] ? dayjs(dateRange[1]).format("YYYY-MM-DD HH:mm:ss") : null,
      }

      await projectService.update(project.projectId, formData)

      message.success("Project updated successfully!", 3)
      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (error) {
      message.error("Failed to update project")
    }
  }

  return (
    <Modal
      open={open}
      onCancel={() => onOpenChange(false)}
      width={800}
      title="Edit Project"
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
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
          <Col span={8}>
            <Form.Item
              label="Department"
              name="departmentId"
              rules={[{ required: true, message: 'Please select a department!' }]}
            >
              <Select placeholder="Select Department">
                {departments.map((dept) => (
                  <Select.Option key={dept.departmentId} value={dept.departmentId}>
                    {dept.departmentName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
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
          <Col span={8}>
            <Form.Item
              label="Method"
              name="method"
            >
              <Select placeholder="Select Method" disabled>
                <Select.Option value="STANDARD">Standard</Select.Option>
                <Select.Option value="AGILE">Agile</Select.Option>
                <Select.Option value="WATERFALL">Waterfall</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}
