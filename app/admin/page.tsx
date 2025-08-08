"use client"

import { useState } from "react"
import { Users, Settings, Shield, Database, Activity, Plus, Search, MoreHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sidebar } from "../../components/sidebar"
import { Header } from "../../components/header"

export default function AdminPage() {
  const [users] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@acmecorp.com",
      role: "Project Director",
      department: "Management",
      status: "Active",
      lastLogin: "2024-02-14 09:30",
      permissions: ["Admin", "Projects", "Budget"],
      avatar: "JD",
    },
    {
      id: 2,
      name: "Sarah Miller",
      email: "sarah.miller@acmecorp.com",
      role: "Senior Designer",
      department: "Design",
      status: "Active",
      lastLogin: "2024-02-14 08:45",
      permissions: ["Projects", "Tasks"],
      avatar: "SM",
    },
    {
      id: 3,
      name: "David Kim",
      email: "david.kim@acmecorp.com",
      role: "Security Officer",
      department: "Security",
      status: "Active",
      lastLogin: "2024-02-14 07:20",
      permissions: ["Admin", "Compliance", "Security"],
      avatar: "DK",
    },
    {
      id: 4,
      name: "Michael Rodriguez",
      email: "michael.rodriguez@acmecorp.com",
      role: "Systems Manager",
      department: "IT",
      status: "Inactive",
      lastLogin: "2024-02-10 16:30",
      permissions: ["Projects", "Systems"],
      avatar: "MR",
    },
  ])

  const [systemSettings] = useState([
    { name: "Email Notifications", description: "Send email notifications for project updates", enabled: true },
    { name: "Auto Backup", description: "Automatically backup project data daily", enabled: true },
    { name: "Two-Factor Authentication", description: "Require 2FA for all admin users", enabled: true },
    { name: "API Access", description: "Allow external API access to project data", enabled: false },
    { name: "Guest Access", description: "Allow guest users to view public projects", enabled: false },
    { name: "Data Retention", description: "Automatically archive old project data", enabled: true },
  ])

  const [auditLogs] = useState([
    {
      id: 1,
      user: "John Doe",
      action: "Created new project",
      resource: "Enterprise CRM Migration",
      timestamp: "2024-02-14 10:30:00",
      ip: "192.168.1.100",
      status: "Success",
    },
    {
      id: 2,
      user: "Sarah Miller",
      action: "Updated project budget",
      resource: "Digital Transformation",
      timestamp: "2024-02-14 09:15:00",
      ip: "192.168.1.101",
      status: "Success",
    },
    {
      id: 3,
      user: "David Kim",
      action: "Modified user permissions",
      resource: "User: michael.rodriguez@acmecorp.com",
      timestamp: "2024-02-14 08:45:00",
      ip: "192.168.1.102",
      status: "Success",
    },
    {
      id: 4,
      user: "System",
      action: "Failed login attempt",
      resource: "admin@acmecorp.com",
      timestamp: "2024-02-14 07:30:00",
      ip: "203.0.113.1",
      status: "Failed",
    },
  ])

  const [systemStats] = useState({
    totalUsers: 24,
    activeUsers: 18,
    totalProjects: 18,
    systemUptime: "99.9%",
    storageUsed: "2.4 TB",
    apiCalls: "1.2M",
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Inactive":
        return "bg-red-100 text-red-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAuditStatusColor = (status: string) => {
    switch (status) {
      case "Success":
        return "text-green-600"
      case "Failed":
        return "text-red-600"
      case "Warning":
        return "text-yellow-600"
      default:
        return "text-gray-600"
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
                <h1 className="text-3xl font-bold text-gray-900">System Administration</h1>
                <p className="text-gray-600 mt-2">Manage users, system settings, and monitor platform activity</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>

            {/* System Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Users</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{systemStats.totalUsers}</p>
                      <p className="text-sm text-blue-600 mt-1">{systemStats.activeUsers} active</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">System Uptime</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{systemStats.systemUptime}</p>
                      <p className="text-sm text-green-600 mt-1">Last 30 days</p>
                    </div>
                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Activity className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Storage Used</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{systemStats.storageUsed}</p>
                      <p className="text-sm text-purple-600 mt-1">of 5 TB allocated</p>
                    </div>
                    <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Database className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="users" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="users">User Management</TabsTrigger>
                <TabsTrigger value="settings">System Settings</TabsTrigger>
                <TabsTrigger value="security">Security & Permissions</TabsTrigger>
                <TabsTrigger value="audit">Audit Logs</TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search users..." className="pl-10 w-64" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-blue-100 text-blue-700">{user.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{user.name}</h4>
                              <p className="text-sm text-gray-600">{user.email}</p>
                              <p className="text-sm text-gray-500">{user.role} • {user.department}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <Badge className={getStatusColor(user.status)}>
                                {user.status}
                              </Badge>
                              <p className="text-xs text-gray-500 mt-1">Last login: {user.lastLogin}</p>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {user.permissions.map((permission, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {permission}
                                </Badge>
                              ))}
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit User</DropdownMenuItem>
                                <DropdownMenuItem>Reset Password</DropdownMenuItem>
                                <DropdownMenuItem>Manage Permissions</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Settings</CardTitle>
                    <CardDescription>Configure system-wide settings and preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {systemSettings.map((setting, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{setting.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                          </div>
                          <Switch checked={setting.enabled} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        Security Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <span className="text-sm font-medium">Two-Factor Authentication</span>
                          <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <span className="text-sm font-medium">SSL Certificate</span>
                          <Badge className="bg-green-100 text-green-800">Valid</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                          <span className="text-sm font-medium">Password Policy</span>
                          <Badge className="bg-yellow-100 text-yellow-800">Standard</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <span className="text-sm font-medium">Data Encryption</span>
                          <Badge className="bg-green-100 text-green-800">AES-256</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Permission Roles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 border border-gray-200 rounded-lg">
                          <h4 className="font-medium">Administrator</h4>
                          <p className="text-sm text-gray-600">Full system access and user management</p>
                          <Badge variant="outline" className="mt-2">3 users</Badge>
                        </div>
                        <div className="p-3 border border-gray-200 rounded-lg">
                          <h4 className="font-medium">Project Manager</h4>
                          <p className="text-sm text-gray-600">Project creation and team management</p>
                          <Badge variant="outline" className="mt-2">8 users</Badge>
                        </div>
                        <div className="p-3 border border-gray-200 rounded-lg">
                          <h4 className="font-medium">Team Member</h4>
                          <p className="text-sm text-gray-600">Task management and project participation</p>
                          <Badge variant="outline" className="mt-2">13 users</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="audit" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Audit Logs</CardTitle>
                    <CardDescription>System activity and security events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {auditLogs.map((log) => (
                        <div key={log.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium">{log.user}</span>
                              <span className="text-sm text-gray-600">{log.action}</span>
                            </div>
                            <p className="text-sm text-gray-600">{log.resource}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {log.timestamp} • IP: {log.ip}
                            </p>
                          </div>
                          <Badge className={`${getAuditStatusColor(log.status)} bg-transparent border`}>
                            {log.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
