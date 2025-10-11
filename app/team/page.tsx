"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { UserProfileDialog } from "@/components/user-profile-dialog"
import { Mail, MoreVertical, Search, UserPlus, Eye } from "lucide-react"
import { toast } from "sonner"

export default function TeamPage() {
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const teamMembers = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.j@company.com",
      phone: "+1 (555) 123-4567",
      role: "Senior Designer",
      department: "Design",
      location: "San Francisco, CA",
      joinDate: "Jan 15, 2022",
      avatar: "/placeholder-user.jpg",
      bio: "Passionate designer with 8+ years of experience in creating user-centered digital experiences. Specializes in UI/UX design and design systems.",
      skills: ["UI/UX Design", "Figma", "Design Systems", "Prototyping", "User Research"],
      projects: [
        { name: "Website Redesign", role: "Lead Designer" },
        { name: "Mobile App", role: "UI Designer" },
      ],
      stats: {
        projectsCompleted: 24,
        tasksCompleted: 156,
        hoursLogged: 1240,
      },
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael.c@company.com",
      phone: "+1 (555) 234-5678",
      role: "Full Stack Developer",
      department: "Engineering",
      location: "New York, NY",
      joinDate: "Mar 10, 2021",
      avatar: "/placeholder-user.jpg",
      bio: "Full-stack developer specializing in modern web technologies. Experienced in building scalable applications and leading technical teams.",
      skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
      projects: [
        { name: "Mobile App Development", role: "Lead Developer" },
        { name: "API Platform", role: "Backend Engineer" },
      ],
      stats: {
        projectsCompleted: 32,
        tasksCompleted: 201,
        hoursLogged: 1680,
      },
    },
    {
      id: "3",
      name: "Emma Wilson",
      email: "emma.w@company.com",
      phone: "+1 (555) 345-6789",
      role: "Project Manager",
      department: "Management",
      location: "Austin, TX",
      joinDate: "Jul 20, 2020",
      avatar: "/placeholder-user.jpg",
      bio: "Experienced project manager with a track record of delivering complex projects on time and within budget. Agile certified and team-oriented.",
      skills: ["Project Management", "Agile", "Scrum", "Stakeholder Management", "Risk Management"],
      projects: [
        { name: "Marketing Campaign", role: "Project Manager" },
        { name: "Enterprise Platform", role: "Program Manager" },
      ],
      stats: {
        projectsCompleted: 45,
        tasksCompleted: 312,
        hoursLogged: 2150,
      },
    },
    {
      id: "4",
      name: "David Brown",
      email: "david.b@company.com",
      phone: "+1 (555) 456-7890",
      role: "Frontend Developer",
      department: "Engineering",
      location: "Seattle, WA",
      joinDate: "Nov 5, 2022",
      avatar: "/placeholder-user.jpg",
      bio: "Frontend developer passionate about creating beautiful and performant web applications. Specializes in React and modern CSS.",
      skills: ["React", "Next.js", "Tailwind CSS", "TypeScript", "Performance Optimization"],
      projects: [
        { name: "Website Redesign", role: "Frontend Developer" },
        { name: "Dashboard App", role: "Frontend Lead" },
      ],
      stats: {
        projectsCompleted: 18,
        tasksCompleted: 142,
        hoursLogged: 980,
      },
    },
  ]

  const handleViewProfile = (member: any) => {
    setSelectedUser(member)
    setProfileDialogOpen(true)
  }

  const handleSendMessage = (memberId: string) => {
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
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-lg">{member.name[0]}</AvatarFallback>
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
                        <DropdownMenuItem onClick={() => handleSendMessage(member.id)}>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Message
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
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

                    <div className="grid grid-cols-3 gap-2 pt-4 border-t">
                      <div className="text-center">
                        <div className="font-bold text-blue-600">{member.stats.projectsCompleted}</div>
                        <div className="text-xs text-muted-foreground">Projects</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-green-600">{member.stats.tasksCompleted}</div>
                        <div className="text-xs text-muted-foreground">Tasks</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-purple-600">{member.stats.hoursLogged}</div>
                        <div className="text-xs text-muted-foreground">Hours</div>
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
