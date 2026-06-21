"use client"

import React, { useEffect, useState } from "react"
import { Modal, Form, Input, Select, Row, Col, DatePicker, Button, Space, message } from "antd"
import dayjs from "dayjs"
import { taskService } from "@/services/task.service"
import { getAllProjects } from "@/services/project.service"
import { getAllMember } from "@/services/user.service"
import { stageService } from "@/services/stage.service"
import { Project } from "@/types/project.types"
import { User } from "@/types/user.types"
import { Stage } from "@/types/stage.types"

interface EditTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: any
  onSuccess?: () => void
}

export function EditTaskDialog({ open, onOpenChange, task, onSuccess }: EditTaskDialogProps) {
  const [form] = Form.useForm()
  const [allMembers, setAllMembers] = useState<User[]>([])
  const [allProjects, setAllProjects] = useState<Project[]>([])
  const [stages, setStages] = useState<Stage[]>([])
  const selectedProjectId = Form.useWatch('projectId', form)

  useEffect(() => {
    if (open) {
      fetchAllMember()
      fetchAllProject()
    }
  }, [open])

  useEffect(() => {
    if (open && task) {
      let mappedPriority = task.priority;
      if (typeof task.priority === "string") {
        const priorityUpper = task.priority.toUpperCase();
        if (priorityUpper === "LOW") mappedPriority = 0;
        else if (priorityUpper === "MEDIUM") mappedPriority = 1;
        else if (priorityUpper === "HIGH") mappedPriority = 2;
        else if (priorityUpper === "CRITICAL") mappedPriority = 3;
      }

      let mappedStatus = task.status;
      if (typeof task.status === "string") {
        const statusUpper = task.status.toUpperCase();
        if (statusUpper === "PENDING") mappedStatus = 0;
        else if (statusUpper === "DOING") mappedStatus = 1;
        else if (statusUpper === "REVIEWING") mappedStatus = 2;
        else if (statusUpper === "COMPLETED") mappedStatus = 3;
        else if (statusUpper === "CANCELLED") mappedStatus = 4;
      }

      form.setFieldsValue({
        ...task,
        priority: mappedPriority,
        status: mappedStatus,
        dueDate: task.dueDate ? dayjs(task.dueDate) : null,
      })
      if (task.projectId) {
        fetchStages(task.projectId)
      }
    }
  }, [open, task, form])

  useEffect(() => {
    if (selectedProjectId) {
      fetchStages(selectedProjectId)
    } else {
      setStages([])
    }
  }, [selectedProjectId])

  const fetchStages = (pid: number) => {
    stageService.getByProject(pid).then((res: any) => {
      if (Array.isArray(res)) setStages(res)
      else if (res?.data && Array.isArray(res.data)) setStages(res.data)
    }).catch(() => setStages([]))
  }

  const fetchAllMember = async () => {
    try {
      const response = await getAllMember()
      setAllMembers(response.data)
    } catch (error) {
      console.error("Failed to fetch team members")
    }
  }

  const fetchAllProject = async () => {
    try {
      const response = await getAllProjects()
      setAllProjects((response as any).data || response || [])
    } catch (error) {
      console.error("Failed to fetch projects")
    }
  }

  const handleSubmit = async (values: any) => {
    try {
      const formData = {
        ...values,
        dueDate: values.dueDate ? dayjs(values.dueDate).format("YYYY-MM-DD HH:mm:ss") : null,
      }

      await taskService.update(task.taskId, formData)
      message.success("Task updated successfully!")
      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (error) {
      message.error("Failed to update task")
    }
  }

  return (
    <Modal
      open={open}
      onCancel={() => onOpenChange(false)}
      width={800}
      title="Edit Task"
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Task Title"
          name="title"
          rules={[{ required: true, message: 'Please enter task title!' }]}
        >
          <Input placeholder="Enter task title" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
        >
          <Input.TextArea
            placeholder="Enter task description"
            rows={4}
          />
        </Form.Item>

        <Form.Item
          label="Project"
          name="projectId"
          rules={[{ required: true, message: 'Please select a project!' }]}
        >
          <Select placeholder="Select a project" showSearch>
            {allProjects?.filter(p => p && p.projectId).map((project) => (
              <Select.Option key={project.projectId} value={project.projectId}>
                {project.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Stage"
          name="stageId"
          rules={[{ required: true, message: 'Please select a stage!' }]}
        >
          <Select placeholder="Select a stage" disabled={!selectedProjectId}>
            {stages.map((stage) => (
              <Select.Option key={stage.stageId} value={stage.stageId}>
                {stage.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Status" name="status">
              <Select placeholder="Select Status">
                <Select.Option value={0}>To Do</Select.Option>
                <Select.Option value={1}>In Progress</Select.Option>
                <Select.Option value={2}>In Review</Select.Option>
                <Select.Option value={3}>Done</Select.Option>
                <Select.Option value={4}>Cancelled</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Priority" name="priority">
              <Select>
                <Select.Option value={0}>Low</Select.Option>
                <Select.Option value={1}>Medium</Select.Option>
                <Select.Option value={2}>High</Select.Option>
                <Select.Option value={3}>Critical</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Due Date" name="dueDate">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Assign To" name="assignedTo">
          <Select
            mode="multiple"
            placeholder="Select team members"
            showSearch
            maxTagCount="responsive"
          >
            {allMembers.map((member) => (
              <Select.Option key={member.userId} value={member.userId}>
                {member.name} - {member.department}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">Save Changes</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}
