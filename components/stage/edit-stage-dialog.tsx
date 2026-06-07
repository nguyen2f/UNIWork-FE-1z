"use client"

import type React from "react"
import { useEffect } from "react"
import { Modal, Form, Input, message, Button, Space } from "antd"
import dayjs from "dayjs"
import DateRangePicker from "@/components/ui/DateRangePicker"
import { stageService } from "@/services/stage.service"
import { StageType, StageStatus } from "@/types/stage.types"

const { TextArea } = Input

interface EditStageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: number
  stageId: number
  initialData: any
  onSuccess?: () => void
}

export function EditStageDialog({ open, onOpenChange, projectId, stageId, initialData, onSuccess }: EditStageDialogProps) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (open && initialData) {
      form.setFieldsValue({
        name: initialData.name,
        description: initialData.description ?? "",
        goal: initialData.goal ?? "",
        dateRange: initialData.startDate && initialData.endDate 
          ? [dayjs(initialData.startDate), dayjs(initialData.endDate)]
          : null
      })
    }
  }, [open, initialData, form])

  const handleSubmit = async (values: any) => {
    try {
      const { dateRange, name, description, goal } = values
      const formData = {
        name,
        description: description || null,
        goal: goal || null,
        startDate: dateRange?.[0] ? dayjs(dateRange[0]).format("YYYY-MM-DD HH:mm:ss") : null,
        endDate: dateRange?.[1] ? dayjs(dateRange[1]).format("YYYY-MM-DD HH:mm:ss") : null,
      }

      await stageService.update(projectId, stageId, formData as any)
      message.success(`Stage updated successfully!`)
      onOpenChange(false)
      form.resetFields()
      if (onSuccess) onSuccess()
    } catch (error) {
      message.error("Failed to update stage")
    }
  }

  return (
    <Modal
      open={open}
      onCancel={() => onOpenChange(false)}
      title="Edit Stage"
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter a name!' }]}
        >
          <Input placeholder="Enter stage name" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
        >
          <TextArea 
            placeholder="Enter stage description" 
            rows={3}
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item
          label="Goal"
          name="goal"
        >
          <TextArea 
            placeholder="Enter stage goal" 
            rows={2}
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item
          label="Date Range"
          name="dateRange"
          rules={[{ required: true, message: 'Please select a date range!' }]}
        >
          <DateRangePicker />
        </Form.Item>

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
