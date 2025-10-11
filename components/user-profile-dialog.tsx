"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, MapPin, Calendar, Briefcase, Award } from "lucide-react"

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  role: string
  department: string
  location: string
  joinDate: string
  avatar: string
  bio: string
  skills: string[]
  projects: Array<{ name: string; role: string }>
  stats: {
    projectsCompleted: number
    tasksCompleted: number
    hoursLogged: number
  }
}

interface UserProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserProfile | null
}

export function UserProfileDialog({ open, onOpenChange, user }: UserProfileDialogProps) {
  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Team Member Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div>
                <h3 className="text-2xl font-bold">{user.name}</h3>
                <p className="text-muted-foreground">{user.role}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{user.department}</Badge>
                <Badge variant="outline">{user.location}</Badge>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Send Message
            </Button>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="font-semibold">Contact Information</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{user.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {user.joinDate}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Bio */}
          <div className="space-y-3">
            <h4 className="font-semibold">About</h4>
            <p className="text-sm text-muted-foreground">{user.bio}</p>
          </div>

          <Separator />

          {/* Skills */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Award className="h-4 w-4" />
              Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Statistics */}
          <div className="space-y-3">
            <h4 className="font-semibold">Statistics</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">{user.stats.projectsCompleted}</div>
                <div className="text-xs text-muted-foreground">Projects Completed</div>
              </div>
              <div className="text-center p-4 rounded-lg border">
                <div className="text-2xl font-bold text-green-600">{user.stats.tasksCompleted}</div>
                <div className="text-xs text-muted-foreground">Tasks Completed</div>
              </div>
              <div className="text-center p-4 rounded-lg border">
                <div className="text-2xl font-bold text-purple-600">{user.stats.hoursLogged}</div>
                <div className="text-xs text-muted-foreground">Hours Logged</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Current Projects */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Current Projects
            </h4>
            <div className="space-y-2">
              {user.projects.map((project, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium text-sm">{project.name}</p>
                    <p className="text-xs text-muted-foreground">{project.role}</p>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
