"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { issueService } from "@/services/issue.service"
import { projectService } from "@/services/project.service"
import type { IssueDTO, IssueRequest } from "@/types/issue.types"

interface IssueDialogProps {
  taskId: number
  projectId?: number
  issue?: IssueDTO | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function IssueDialog({ taskId, projectId, issue, open, onOpenChange, onSuccess }: IssueDialogProps) {
  const [loading, setLoading] = useState(false)
  const [members, setMembers] = useState<any[]>([])
  const [formData, setFormData] = useState<Partial<IssueRequest>>({
    title: "",
    description: "",
    status: "OPEN",
    issueType: "BUG",
    assignedTo: null,
  })

  useEffect(() => {
    if (open && projectId) {
      fetchMembers()
    }
  }, [open, projectId])

  const fetchMembers = async () => {
    try {
      if (!projectId) return;
      const res: any = await projectService.getMembers(projectId)
      setMembers(res.data || res || [])
    } catch (error) {
      console.error("Failed to fetch project members:", error)
    }
  }

  useEffect(() => {
    if (open) {
      if (issue) {
        setFormData({
          title: issue.title,
          description: issue.description,
          status: issue.status,
          issueType: issue.issueType || issue.type,
          priority: issue.priority || "MEDIUM",
          assignedTo: issue.assignedTo,
        })
      } else {
        setFormData({
          title: "",
          description: "",
          status: "OPEN",
          issueType: "BUG",
          priority: "MEDIUM",
          assignedTo: null,
        })
      }
    }
  }, [open, issue])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title?.trim()) {
      toast.error("Title is required")
      return
    }

    try {
      setLoading(true)
      
      const statusInt = typeof formData.status === 'string' && issueStatusMap[formData.status] !== undefined 
        ? issueStatusMap[formData.status] 
        : formData.status;

      const typeInt = typeof formData.issueType === 'string' && issueTypeMap[formData.issueType] !== undefined 
        ? issueTypeMap[formData.issueType] 
        : formData.issueType;

      const priorityInt = typeof formData.priority === 'string' && issuePriorityMap[formData.priority] !== undefined
        ? issuePriorityMap[formData.priority]
        : formData.priority;

      const payload = {
        title: formData.title,
        description: formData.description,
        assignedTo: formData.assignedTo,
        status: statusInt,
        type: typeInt,
        priority: priorityInt,
        taskId,
        projectId: projectId || (issue?.projectId),
      } as IssueRequest

      if (issue) {
        await issueService.update(issue.issueId, payload)
        toast.success("Issue updated successfully")
      } else {
        await issueService.create(payload)
        toast.success("Issue created successfully")
      }
      
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to save issue:", error)
      toast.error(issue ? "Failed to update issue" : "Failed to create issue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{issue ? "Edit Issue" : "Create New Issue"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter issue title"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={
                  typeof formData.issueType === "number"
                    ? Object.keys(issueTypeMap).find(key => issueTypeMap[key] === formData.issueType) || "BUG"
                    : String(formData.issueType || "BUG")
                }
                onValueChange={(val) => setFormData({ ...formData, issueType: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BUG">Bug</SelectItem>
                  <SelectItem value="IMPROVEMENT">Improvement</SelectItem>
                  <SelectItem value="QUESTION">Question</SelectItem>
                  <SelectItem value="DOCUMENTATION">Documentation</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={
                  typeof formData.status === "number"
                    ? Object.keys(issueStatusMap).find(key => issueStatusMap[key] === formData.status) || "OPEN"
                    : String(formData.status || "OPEN")
                }
                onValueChange={(val) => setFormData({ ...formData, status: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                  <SelectItem value="REOPENED">Reopened</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={
                  typeof formData.priority === "number"
                    ? Object.keys(issuePriorityMap).find(key => issuePriorityMap[key] === formData.priority) || "MEDIUM"
                    : String(formData.priority || "MEDIUM")
                }
                onValueChange={(val) => setFormData({ ...formData, priority: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Assignee</Label>
            <Select
              value={formData.assignedTo ? String(formData.assignedTo) : "unassigned"}
              onValueChange={(val) => setFormData({ ...formData, assignedTo: val === "unassigned" ? null : Number(val) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {members.map(member => (
                  <SelectItem key={member.userId || member.pmId} value={String(member.userId || member.pmId)}>
                    {member.userName || member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the issue"
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : (issue ? "Update Issue" : "Create Issue")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

