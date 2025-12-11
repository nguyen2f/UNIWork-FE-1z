"use client"

import React, {useEffect} from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import { toast } from "sonner"
import { default as dayjs} from "dayjs"
import {Drawer, Form, message, Select, Row, Col, DatePicker, Input, Space, Tag, Modal} from "antd";
import {createProject, getAllProjects} from "@/app/services/projectService";
import {UserOutlined} from "@ant-design/icons";
import {createTask} from "@/app/services/taskService";
import {getAllMember} from "@/app/services/userService";
import {Project} from "@/types";
import {User} from "@/types";

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTaskDialog({ open, onOpenChange }: CreateTaskDialogProps) {
  const [form] = Form.useForm()
  const [assignedTo, setAssignedTo] = useState<string>()
  const [allMembers, setAllMembers] = useState<User[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  useEffect(() => {
      fetchAllMember();
      fetchAllProject();
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      const { dateRange, ...rest } = values
      const formData = {
        ...rest,
          dueDate: values.dueDate
              ? dayjs(values.dueDate).format("YYYY-MM-DD HH:mm:ss")
              : null,
      }

      const response = await createTask(formData)

      message.success("Task created successfully!", 3)
      onOpenChange(false)
      form.resetFields()
      setAssignedTo(undefined)
    } catch (error) {
      message.error("Failed to create task")
    }
  }

  const fetchAllMember = async () => {
    try {
      const response = await getAllMember();
      setAllMembers(response.data);
    } catch (error) {
      message.error("Failed to fetch team members");
    }
  };

  const fetchAllProject = async () => {
    try {
      const response = await getAllProjects();
      setAllProjects(response.data);
    } catch (error) {
      message.error("Failed to fetch projects");
    }
  };

  return (
      <Modal
          open={open}
          onCancel={() => onOpenChange(false)}
          width={800}
          title="Create New Task"
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
            <Select
                placeholder="Select a project"
                showSearch
                // filterOption={(input, option) =>
                //     (option?.children?.toLowerCase() ?? '').includes(input.toLowerCase())
                // }
            >
              {allProjects?.map((project) => (
                  <Select.Option key={project.projectId} value={project.projectId}>
                    {project.name}
                  </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                  label="Status"
                  name="status"
              >
                <Select placeholder="Select Status">
                  <Select.Option value={1}>To Do</Select.Option>
                  <Select.Option value={2}>In Progress</Select.Option>
                  <Select.Option value={3}>In Review</Select.Option>
                  <Select.Option value={4}>Done</Select.Option>
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
                mode="multiple"
                placeholder="Select team members"
                showSearch
                // filterOption={(input, option) =>
                //     (option?.children?.toLowerCase() ?? '').includes(input.toLowerCase())
                // }
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
              <Button onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Create Task
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
  )

}
