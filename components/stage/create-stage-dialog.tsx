"use client"

import type React from "react"
import { Modal, Form, Input, DatePicker, message, Button, Space } from "antd"
import dayjs from "dayjs"
import DateRangePicker from "@/components/ui/DateRangePicker"
import { stageService } from "@/services/stage.service"
import { StageType, StageStatus } from "@/types/stage.types"

interface CreateStageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: number
  method: string
  onSuccess?: () => void
}

export function CreateStageDialog({ open, onOpenChange, projectId, method, onSuccess }: CreateStageDialogProps) {
  const [form] = Form.useForm()

  const getStageType = () => {
    switch (method) {
      case "AGILE":
        return StageType.SPRINT
      case "WATERFALL":
        return StageType.PHASE
      default:
        return StageType.DEFAULT
    }
  }

  const getTitle = () => {
    switch (method) {
      case "AGILE":
        return "Create New Sprint"
      case "WATERFALL":
        return "Create New Phase"
      default:
        return "Create New Stage"
    }
  }

  const handleSubmit = async (values: any) => {
    try {
      const { dateRange, name } = values
      const formData = {
        projectId,
        name,
        type: getStageType(),
        startDate: dateRange?.[0] ? dayjs(dateRange[0]).format("YYYY-MM-DD HH:mm:ss") : null,
        endDate: dateRange?.[1] ? dayjs(dateRange[1]).format("YYYY-MM-DD HH:mm:ss") : null,
        status: StageStatus.PLANNED,
      }

      await stageService.create(projectId, formData as any)
      message.success(`${getTitle().replace("Create New ", "")} created successfully!`)
      onOpenChange(false)
      form.resetFields()
      if (onSuccess) onSuccess()
    } catch (error) {
      message.error("Failed to create")
    }
  }

  return (
    <Modal
      open={open}
      onCancel={() => onOpenChange(false)}
      title={getTitle()}
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
          <Input placeholder={`Enter ${getTitle().replace("Create New ", "").toLowerCase()} name`} />
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
              Create
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}
