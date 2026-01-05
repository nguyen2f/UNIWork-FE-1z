"use client"

import {useEffect, useState} from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { UserProfileDialog } from "@/components/user-profile-dialog"
import {Mail, MoreVertical, Search, UserPlus, Eye, Phone} from "lucide-react"
import { toast } from "sonner"
import {User} from "@/types";
import {getAllMember} from "@/app/services/userService";
import {message} from "antd";

export default function TeamPage() {
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
    const [teamMembers, setMembers] = useState<User[]>([])

    useEffect(() => {
        loadTeamMembers();
    }, []);

    const loadTeamMembers = async () => {
        try {
            const response = await getAllMember();
            setMembers(response.data);
        } catch (error) {
            message.error("Failed to fetch team members");
        }
    }

  const handleViewProfile = (member: any) => {
    setSelectedUser(member)
    setProfileDialogOpen(true)
  }

  const handleSendMessage = (memberId: number) => {
    toast.success("Message sent", {
      description: "Your message has been sent successfully.",
    })
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Team</h1>
              <p className="text-muted-foreground">Manage your team members</p>
            </div>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search team members..." className="pl-9" />
            </div>
          </div>

          {/* Team Members Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <Card key={member.userId} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                      <Avatar className="h-16 w-16">
                          <AvatarImage
                              src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                                  member.name
                              )}&chars=1`}
                          />
                          <AvatarFallback className="text-lg">
                              {member.name?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                      </Avatar>

                      <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewProfile(member)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSendMessage(member.userId)}>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Message
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.systemRole}</p>
                    </div>

                    <div className="flex gap-2">
                      <Badge variant="secondary">{member.department}</Badge>
                    </div>

                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    </div>
                      <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="h-4 w-4" />
                              <span className="truncate">{member.phone}</span>
                          </div>
                      </div>

                    <Button
                      variant="outline"
                      className="w-full gap-2 bg-transparent"
                      onClick={() => handleViewProfile(member)}
                    >
                      <Eye className="h-4 w-4" />
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>

      <UserProfileDialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen} user={selectedUser} />
    </div>
  )
}
