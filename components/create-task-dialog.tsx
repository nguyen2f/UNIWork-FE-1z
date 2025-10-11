"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import { toast } from "sonner"

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const projects = [
  { id: "1", name: "Website Redesign" },
  { id: "2", name: "Mobile App Development" },
  { id: "3", name: "Marketing Campaign" },
]

const teamMembers = [
  { id: "1", name: "Sarah Johnson", role: "Designer", avatar: "/placeholder-user.jpg" },
  { id: "2", name: "Michael Chen", role: "Developer", avatar: "/placeholder-user.jpg" },
  { id: "3", name: "Emma Wilson", role: "Manager", avatar: "/placeholder-user.jpg" },
  { id: "4", name: "David Brown", role: "Developer", avatar: "/placeholder-user.jpg" },
]

export function CreateTaskDialog({ open, onOpenChange }: CreateTaskDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
    assignedTo: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    toast.success("Task created successfully!", {
      description: `${formData.title} has been added to your tasks.`,
    })

    onOpenChange(false)
    setFormData({
      title: "",
      description: "",
      project: "",
      status: "todo",
      priority: "medium",
      dueDate: "",
      assignedTo: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter task description"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Select value={formData.project} onValueChange={(value) => setFormData({ ...formData, project: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">In Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <div className="relative">
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
                <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Assign To</Label>
              <div className="grid grid-cols-2 gap-2">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => setFormData({ ...formData, assignedTo: member.id })}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      formData.assignedTo === member.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                    {formData.assignedTo === member.id && (
                      <Badge variant="secondary" className="ml-auto">
                        ✓
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
