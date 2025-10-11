"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, UserPlus } from "lucide-react"
import { toast } from "sonner"

interface InviteTeamMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InviteTeamMemberDialog({ open, onOpenChange }: InviteTeamMemberDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "member",
    department: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    toast.success("Invitation sent successfully!", {
      description: `An invitation has been sent to ${formData.email}.`,
    })

    onOpenChange(false)
    setFormData({
      name: "",
      email: "",
      role: "member",
      department: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite Team Member
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              value={formData.department}
              onValueChange={(value) => setFormData({ ...formData, department: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="support">Support</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Send Invitation</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
