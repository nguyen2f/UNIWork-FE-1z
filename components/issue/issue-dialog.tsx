"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { default as dayjs } from "dayjs"
import { Form, message, Select, Row, Col, DatePicker, Input, Space, Modal } from "antd"
import { getAllProjects } from "@/services/project.service"
import { issueService } from "@/services/issue.service"
import { taskService } from "@/services/task.service"
import { getAllMember } from "@/services/user.service"
import { stageService } from "@/services/stage.service"
import type { IssueDTO, IssueRequest } from "@/types/issue.types"
import type { Project } from "@/types/project.types"
import type { User } from "@/types/user.types"
import type { Stage } from "@/types/stage.types"
import type { TaskDTO } from "@/types/task.types"

interface IssueDialogProps {
  taskId?: number
  projectId?: number
  issue?: IssueDTO | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function IssueDialog({ taskId, projectId, issue, open, onOpenChange, onSuccess }: IssueDialogProps) {
  const [form] = Form.useForm()
  const [allMembers, setAllMembers] = useState<User[]>([])
  const [allProjects, setAllProjects] = useState<Project[]>([])
  const [stages, setStages] = useState<Stage[]>([])
  const [tasks, setTasks] = useState<TaskDTO[]>([])

  const selectedProjectId = Form.useWatch('projectId', form) || projectId
  const selectedStageId = Form.useWatch('stageId', form)

  useEffect(() => {
    if (open) {
      fetchAllMember()
      fetchAllProject()
    }
  }, [open])

  // Load stages when project changes
  useEffect(() => {
    if (selectedProjectId) {
      stageService.getByProject(selectedProjectId).then((res: any) => {
        if (Array.isArray(res)) setStages(res)
        else if (res?.data && Array.isArray(res.data)) setStages(res.data)
      }).catch(() => setStages([]))
    } else {
      setStages([])
      setTasks([])
    }
  }, [selectedProjectId])

  // Load tasks when stage changes
  useEffect(() => {
    if (selectedStageId) {
      taskService.getByStage(selectedStageId).then((res: any) => {
        let taskList: TaskDTO[] = []
        if (Array.isArray(res)) taskList = res
        else if (res?.data && Array.isArray(res.data)) taskList = res.data
        setTasks(taskList)
      }).catch(() => setTasks([]))
    } else if (selectedProjectId && !selectedStageId) {
      // Also try to load all tasks for the project if no stage selected
      loadAllProjectTasks(selectedProjectId)
    } else {
      setTasks([])
    }
  }, [selectedStageId, selectedProjectId])

  const loadAllProjectTasks = async (pid: number) => {
    try {
      const stagesRes: any = await stageService.getByProject(pid)
      let fetchedStages: Stage[] = []
      if (Array.isArray(stagesRes)) fetchedStages = stagesRes
      else if (stagesRes?.data && Array.isArray(stagesRes.data)) fetchedStages = stagesRes.data

      let allTasks: TaskDTO[] = []
      for (const stage of fetchedStages) {
        try {
          const taskRes: any = await taskService.getByStage(stage.stageId)
          let st: TaskDTO[] = []
          if (Array.isArray(taskRes)) st = taskRes
          else if (taskRes?.data && Array.isArray(taskRes.data)) st = taskRes.data
          allTasks = [...allTasks, ...st]
        } catch (e) {
          // skip
        }
      }
      setTasks(allTasks)
    } catch {
      setTasks([])
    }
  }

  // Populate form when editing an existing issue
  useEffect(() => {
    if (open) {
      if (issue) {
        form.setFieldsValue({
          title: issue.title,
          description: issue.description,
          status: issueStatusToInt(issue.status),
          type: issueTypeToInt(issue.type || issue.issueType),
          priority: issuePriorityToInt(issue.priority),
          assignedTo: issue.assignedTo,
          projectId: issue.projectId || projectId,
          taskId: issue.taskId || taskId,
          dueDate: issue.dueDate ? dayjs(issue.dueDate) : null,
        })
      } else {
        form.resetFields()
        // Set defaults
        form.setFieldsValue({
          status: 0,
          priority: 1,
          type: 0,
          projectId: projectId || undefined,
          taskId: taskId || undefined,
        })
      }
    }
  }, [open, issue])

  // Maps for string -> int conversion
  const issueStatusMap: Record<string, number> = {
    OPEN: 0,
    IN_PROGRESS: 1,
    RESOLVED: 2,
    CLOSED: 3,
    REOPENED: 4,
  }

  const issueTypeMap: Record<string, number> = {
    BUG: 0,
    IMPROVEMENT: 1,
    QUESTION: 2,
    DOCUMENTATION: 3,
    OTHER: 4,
  }

  const issuePriorityMap: Record<string, number> = {
    LOW: 0,
    MEDIUM: 1,
    HIGH: 2,
    CRITICAL: 3,
  }

  const issueStatusToInt = (val: any): number => {
    if (typeof val === 'number') return val
    return issueStatusMap[val] ?? 0
  }
  const issueTypeToInt = (val: any): number => {
    if (typeof val === 'number') return val
    return issueTypeMap[val] ?? 0
  }
  const issuePriorityToInt = (val: any): number => {
    if (typeof val === 'number') return val
    return issuePriorityMap[val] ?? 1
  }

  const fetchAllMember = async () => {
    try {
      const response = await getAllMember()
      setAllMembers((response as any).data || response || [])
    } catch (error) {
      message.error("Failed to fetch team members")
    }
  }

  const fetchAllProject = async () => {
    try {
      const response = await getAllProjects()
      setAllProjects((response as any).data || response || [])
    } catch (error) {
      message.error("Failed to fetch projects")
    }
  }

  const handleSubmit = async (values: any) => {
    try {
      const payload: IssueRequest = {
        title: values.title,
        description: values.description || "",
        status: values.status,
        type: values.type,
        priority: values.priority,
        assignedTo: values.assignedTo || null,
        taskId: values.taskId || taskId,
        projectId: values.projectId || projectId || 0,
        dueDate: values.dueDate
          ? dayjs(values.dueDate).format("YYYY-MM-DD HH:mm:ss")
          : null,
      }

      if (issue) {
        await issueService.update(issue.issueId, payload)
        message.success("Issue updated successfully!", 3)
      } else {
        await issueService.create(payload)
        message.success("Issue created successfully!", 3)
      }

      onOpenChange(false)
      form.resetFields()
      onSuccess()
    } catch (error) {
      message.error(issue ? "Failed to update issue" : "Failed to create issue")
    }
  }

  return (
    <Modal
      open={open}
      onCancel={() => onOpenChange(false)}
      width={800}
      title={issue ? "Edit Issue" : "Create New Issue"}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: 0,
          priority: 1,
          type: 0,
        }}
      >
        <Form.Item
          label="Issue Title"
          name="title"
          rules={[{ required: true, message: 'Please enter issue title!' }]}
        >
          <Input placeholder="Enter issue title" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
        >
          <Input.TextArea
            placeholder="Describe the issue in detail"
            rows={4}
          />
        </Form.Item>

        <Form.Item
          label="Project"
          name="projectId"
          rules={[{ required: true, message: 'Please select a project!' }]}
        >
          <Select
            placeholder="Select a project"
            showSearch
            filterOption={(input, option) =>
              (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase()) ?? false
            }
          >
            {allProjects
              ?.filter((project) => project && project.projectId)
              .map((project) => (
                <Select.Option key={project.projectId} value={project.projectId}>
                  {project.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Stage"
              name="stageId"
            >
              <Select
                placeholder="Select a stage (optional)"
                disabled={!selectedProjectId}
                allowClear
                onChange={() => {
                  // Reset task selection when stage changes
                  form.setFieldValue('taskId', undefined)
                }}
              >
                {stages.map((stage) => (
                  <Select.Option key={stage.stageId} value={stage.stageId}>
                    {stage.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Related Task"
              name="taskId"
              rules={[{ required: true, message: 'Please select a task!' }]}
            >
              <Select
                placeholder="Select a task"
                disabled={!selectedProjectId}
                showSearch
                filterOption={(input, option) =>
                  (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase()) ?? false
                }
              >
                {tasks.map((task) => (
                  <Select.Option key={task.taskId} value={task.taskId}>
                    {task.title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Type"
              name="type"
            >
              <Select placeholder="Select type">
                <Select.Option value={0}>Bug</Select.Option>
                <Select.Option value={1}>Improvement</Select.Option>
                <Select.Option value={2}>Question</Select.Option>
                <Select.Option value={3}>Documentation</Select.Option>
                <Select.Option value={4}>Other</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Status"
              name="status"
            >
              <Select placeholder="Select status">
                <Select.Option value={0}>Open</Select.Option>
                <Select.Option value={1}>In Progress</Select.Option>
                <Select.Option value={2}>Resolved</Select.Option>
                <Select.Option value={3}>Closed</Select.Option>
                <Select.Option value={4}>Reopened</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Priority"
              name="priority"
            >
              <Select placeholder="Select priority">
                <Select.Option value={0}>Low</Select.Option>
                <Select.Option value={1}>Medium</Select.Option>
                <Select.Option value={2}>High</Select.Option>
                <Select.Option value={3}>Critical</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Due Date"
          name="dueDate"
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Assign To"
          name="assignedTo"
        >
          <Select
            placeholder="Select a team member"
            showSearch
            allowClear
            filterOption={(input, option) =>
              (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase()) ?? false
            }
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
            <Button onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {issue ? "Update Issue" : "Create Issue"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}
