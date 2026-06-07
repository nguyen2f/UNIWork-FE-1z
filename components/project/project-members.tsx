"use client"

import {useEffect, useState} from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Mail, Calendar } from "lucide-react"
import {ProjectMemberDTO, User} from "@/types"
import {message} from "antd";
import {projectService} from "@/services/project.service";
import { AddProjectMemberDialog } from "./add-project-member-dialog"

interface ProjectMembersProps {
  projectId: number
  members: ProjectMemberDTO[]
}

export function ProjectMembers({ projectId, members }: ProjectMembersProps) {
  const [allMembers, setAllMembers] = useState<User[]>([]);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const numericProjectId = Number(projectId);

  useEffect(() => {
    fetchAllMember()
  }, []);
  
  const fetchAllMember = async () => {
    try {
      const response = await projectService.getMembers(numericProjectId);
      setAllMembers((response as any).data || response || []);
    } catch (error) {
      message.error("Failed to fetch team members");
    }
  };


  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-purple-100 text-purple-800"
      case "manager":
      case "PROJECT_MANAGER":
        return "bg-blue-100 text-blue-800"
      case "member":
      case "MEMBER":
        return "bg-green-100 text-green-800"
      case "viewer":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case "owner":
        return "Chủ sở hữu"
      case "manager":
      case "PROJECT_MANAGER":
        return "Quản lý"
      case "member":
      case "MEMBER":
        return "Thành viên"
      case "viewer":
        return "Người xem"
      default:
        return role
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Thành viên dự án</CardTitle>
          <Button onClick={() => setIsAddMemberOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm thành viên
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allMembers?.map((member: any) => (
              <div
                key={member.userId || member.pmId}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  {/*<Avatar className="h-12 w-12">*/}
                  {/*  <AvatarFallback className="bg-blue-100 text-blue-700">{member.user.avatar}</AvatarFallback>*/}
                  {/*</Avatar>*/}
                  <div>
                    <h4 className="font-medium">{member.name || member.userName}</h4>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {member.email}
                    </p>
                    {/*<p className="text-sm text-gray-500 flex items-center mt-1">*/}
                    {/*  <Calendar className="h-4 w-4 mr-1" />*/}
                    {/*  Tham gia: {new Date(member.joinedAt).toLocaleDateString("vi-VN")}*/}
                    {/*</p>*/}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getRoleColor(member.role || member.department || "")}>{getRoleText(member.role || member.department || "")}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Thay đổi vai trò</DropdownMenuItem>
                      <DropdownMenuItem>Gửi tin nhắn</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Xóa khỏi dự án</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}

            {allMembers?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Chưa có thành viên nào</p>
                <Button className="mt-4" onClick={() => setIsAddMemberOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm thành viên đầu tiên
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AddProjectMemberDialog
        open={isAddMemberOpen}
        onOpenChange={setIsAddMemberOpen}
        projectId={numericProjectId}
        onSuccess={fetchAllMember}
      />
    </>
  )
}
