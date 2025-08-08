"use client"

import { useState } from "react"
import { Plus, Search, Mail, Phone, MoreHorizontal, MapPin, Calendar } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sidebar } from "../../components/sidebar"
import { Header } from "../../components/header"

export default function TeamPage() {
  const [teamMembers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@company.com",
      role: "Project Manager",
      department: "Management",
      avatar: "/placeholder-user.jpg",
      status: "Online",
      location: "New York, NY",
      joinDate: "Jan 2023",
      projects: ["Website Redesign", "Mobile App"],
      tasksCompleted: 45,
      phone: "+1 (555) 123-4567",
    },
    {
      id: 2,
      name: "Sarah Miller",
      email: "sarah.miller@company.com",
      role: "Senior Designer",
      department: "Design",
      avatar: "/placeholder-user.jpg",
      status: "Online",
      location: "San Francisco, CA",
      joinDate: "Mar 2022",
      projects: ["Website Redesign", "Marketing Campaign"],
      tasksCompleted: 38,
      phone: "+1 (555) 234-5678",
    },
    {
      id: 3,
      name: "Alex Johnson",
      email: "alex.johnson@company.com",
      role: "Full Stack Developer",
      department: "Engineering",
      avatar: "/placeholder-user.jpg",
      status: "Away",
      location: "Austin, TX",
      joinDate: "Jun 2022",
      projects: ["Mobile App", "API Integration"],
      tasksCompleted: 52,
      phone: "+1 (555) 345-6789",
    },
    {
      id: 4,
      name: "Rachel Wong",
      email: "rachel.wong@company.com",
      role: "Frontend Developer",
      department: "Engineering",
      avatar: "/placeholder-user.jpg",
      status: "Online",
      location: "Seattle, WA",
      joinDate: "Sep 2023",
      projects: ["Website Redesign", "Mobile App"],
      tasksCompleted: 29,
      phone: "+1 (555) 456-7890",
    },
    {
      id: 5,
      name: "Tom Harris",
      email: "tom.harris@company.com",
      role: "DevOps Engineer",
      department: "Engineering",
      avatar: "/placeholder-user.jpg",
      status: "Offline",
      location: "Denver, CO",
      joinDate: "Feb 2023",
      projects: ["Database Migration", "Security Audit"],
      tasksCompleted: 33,
      phone: "+1 (555) 567-8901",
    },
    {
      id: 6,
      name: "Nina Kumar",
      email: "nina.kumar@company.com",
      role: "Database Administrator",
      department: "Engineering",
      avatar: "/placeholder-user.jpg",
      status: "Online",
      location: "Chicago, IL",
      joinDate: "Nov 2022",
      projects: ["Database Migration"],
      tasksCompleted: 41,
      phone: "+1 (555) 678-9012",
    },
    {
      id: 7,
      name: "Lisa Smith",
      email: "lisa.smith@company.com",
      role: "Marketing Manager",
      department: "Marketing",
      avatar: "/placeholder-user.jpg",
      status: "Online",
      location: "Los Angeles, CA",
      joinDate: "Apr 2023",
      projects: ["Marketing Campaign"],
      tasksCompleted: 27,
      phone: "+1 (555) 789-0123",
    },
    {
      id: 8,
      name: "Mike Rodriguez",
      email: "mike.rodriguez@company.com",
      role: "QA Engineer",
      department: "Engineering",
      avatar: "/placeholder-user.jpg",
      status: "Away",
      location: "Miami, FL",
      joinDate: "Aug 2022",
      projects: ["Mobile App", "API Integration"],
      tasksCompleted: 35,
      phone: "+1 (555) 890-1234",
    },
  ])

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

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case "Engineering":
        return "default"
      case "Design":
        return "secondary"
      case "Marketing":
        return "outline"
      case "Management":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Team</h1>
                <p className="text-gray-600 mt-2">Manage your team members and their roles</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search team members..." className="pl-10" />
              </div>
            </div>

            {/* Team Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-gray-900">24</div>
                  <p className="text-sm text-gray-600">Total Members</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-green-600">18</div>
                  <p className="text-sm text-gray-600">Online Now</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-blue-600">6</div>
                  <p className="text-sm text-gray-600">Departments</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-purple-600">12</div>
                  <p className="text-sm text-gray-600">Active Projects</p>
                </CardContent>
              </Card>
            </div>

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {teamMembers.map((member) => (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`}
                          ></div>
                        </div>
                        <div>
                          <CardTitle className="text-lg">{member.name}</CardTitle>
                          <p className="text-sm text-gray-600">{member.role}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Send Message</DropdownMenuItem>
                          <DropdownMenuItem>Edit Role</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Department Badge */}
                    <Badge variant={getDepartmentColor(member.department)}>{member.department}</Badge>

                    {/* Contact Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {member.phone}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {member.location}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Joined {member.joinDate}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="pt-3 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tasks Completed</span>
                        <span className="font-medium">{member.tasksCompleted}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-600">Active Projects</span>
                        <span className="font-medium">{member.projects.length}</span>
                      </div>
                    </div>

                    {/* Projects */}
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Current Projects</p>
                      <div className="flex flex-wrap gap-1">
                        {member.projects.slice(0, 2).map((project, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {project}
                          </Badge>
                        ))}
                        {member.projects.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{member.projects.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
