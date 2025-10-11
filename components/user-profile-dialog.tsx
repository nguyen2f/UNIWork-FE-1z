"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, Calendar, Briefcase, Award, Target } from "lucide-react"

interface User {
  id: number
  name: string
  email: string
  role: string
  department: string
  avatar: string
  status: string
  location: string
  joinDate: string
  projects: string[]
  tasksCompleted: number
  phone: string
}

interface UserProfileDialogProps {
  user: User
  trigger?: React.ReactNode
}

export function UserProfileDialog({ user, trigger }: UserProfileDialogProps) {
  const [open, setOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Online":
        return "bg-green-500"
      case "Away":
        return "bg-yellow-500"
      case "Offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || <Button variant="ghost">View Profile</Button>}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Thông tin thành viên</DialogTitle>
          <DialogDescription>Chi tiết về thông tin và hoạt động của thành viên</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="text-2xl">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div
                className={`absolute bottom-2 right-2 h-5 w-5 rounded-full border-4 border-white ${getStatusColor(user.status)}`}
              ></div>
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
              <p className="text-lg text-gray-600 mt-1">{user.role}</p>
              <div className="flex gap-2 mt-3">
                <Badge variant="secondary">{user.department}</Badge>
                <Badge variant="outline" className={user.status === "Online" ? "border-green-500 text-green-700" : ""}>
                  {user.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <h4 className="font-semibold text-gray-900 mb-3">Thông tin liên hệ</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-gray-500 text-xs">Email</p>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-gray-500 text-xs">Điện thoại</p>
                    <p className="text-gray-900">{user.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-gray-500 text-xs">Địa điểm</p>
                    <p className="text-gray-900">{user.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-gray-500 text-xs">Ngày tham gia</p>
                    <p className="text-gray-900">{user.joinDate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{user.tasksCompleted}</p>
                <p className="text-sm text-gray-600">Công việc hoàn thành</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Briefcase className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{user.projects.length}</p>
                <p className="text-sm text-gray-600">Dự án tham gia</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Award className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">98%</p>
                <p className="text-sm text-gray-600">Tỷ lệ hoàn thành</p>
              </CardContent>
            </Card>
          </div>

          {/* Current Projects */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Dự án hiện tại</h4>
              <div className="flex flex-wrap gap-2">
                {user.projects.map((project, idx) => (
                  <Badge key={idx} variant="outline" className="px-3 py-1">
                    {project}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Đóng
            </Button>
            <Button>
              <Mail className="mr-2 h-4 w-4" />
              Gửi tin nhắn
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
