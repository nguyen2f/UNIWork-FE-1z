"use client"

import type React from "react"
import { Modal } from "antd"
import { ProjectMembers } from "./project-members"

interface ManageMembersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: number
}

export function ManageMembersDialog({ open, onOpenChange, projectId }: ManageMembersDialogProps) {
  return (
    <Modal
      open={open}
      onCancel={() => onOpenChange(false)}
      width={800}
      title="Manage Project Members"
      footer={null}
      destroyOnClose
    >
      <ProjectMembers projectId={projectId} members={[]} />
    </Modal>
  )
}
