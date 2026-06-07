"use client"

import { useState, useEffect } from "react"
import { Users, Settings, Shield, Database, Activity, Plus, Search, MoreHorizontal, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { adminService } from "@/services/admin.service"
import { SystemRole } from "@/types/user.types"
import { toast } from "sonner"
import type { User, Department } from "@/types/user.types"


export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isCreateDepartmentModalOpen, setIsCreateDepartmentModalOpen] = useState(false)
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0
  })
  const [searchQuery, setSearchQuery] = useState("")

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    systemRole: SystemRole.EMPLOYEE,
    departmentId: 0
  })
  const [newDepartment, setNewDepartment] = useState({
    departmentName: "",
    location: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmittingDept, setIsSubmittingDept] = useState(false)
  const [visiblePasswords, setVisiblePasswords] = useState<Record<number, boolean>>({})

  const togglePasswordVisibility = (userId: number) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }))
  }

  const fetchUsers = async (page = 0) => {
    setLoading(true)
    try {
      const response: any = await adminService.getAllUsers(page, pagination.size)
      if (response && response.data) {
        setUsers(response.data)
        if (response.pagination) {
          setPagination(prev => ({
            ...prev,
            page: response.pagination.currentPage,
            totalElements: response.pagination.totalElements,
            size: response.pagination.pageSize
          }))
        }
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
      toast.error("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const fetchDepartments = async () => {
    try {
      const response: any = await adminService.getDepartments()
      const deps = Array.isArray(response) ? response : response?.data || []
      setDepartments(deps)
      if (deps.length > 0 && newUser.departmentId === 0) {
        setNewUser(prev => ({ ...prev, departmentId: deps[0].departmentId }))
      }
    } catch (error) {
      console.error("Failed to fetch departments:", error)
      toast.error("Failed to load departments")
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchDepartments()
  }, [])

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const payload: any = { ...newUser }
      if (!payload.departmentId) delete payload.departmentId
      
      await adminService.createUser(payload)
      toast.success("User created successfully")
      setIsCreateModalOpen(false)
      setNewUser({ name: "", email: "", password: "", systemRole: SystemRole.EMPLOYEE, departmentId: 0 })
      fetchUsers(0)
    } catch (error) {
      console.error("Failed to create user:", error)
      toast.error("Failed to create user")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingDept(true)
    try {
      await adminService.createDepartment(newDepartment)
      toast.success("Department created successfully")
      setIsCreateDepartmentModalOpen(false)
      setNewDepartment({ departmentName: "", location: "" })
      fetchDepartments()
    } catch (error) {
      console.error("Failed to create department:", error)
      toast.error("Failed to create department")
    } finally {
      setIsSubmittingDept(false)
    }
  }



  return (
    <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">System Administration</h1>
                <p className="text-gray-600 mt-2">Manage users, system settings, and monitor platform activity</p>
              </div>
              <div className="flex gap-2">
                <Dialog open={isCreateDepartmentModalOpen} onOpenChange={setIsCreateDepartmentModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="bg-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Department
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Department</DialogTitle>
                      <DialogDescription>
                        Create a new department in the organization.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateDepartment} className="space-y-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="deptName" className="text-right">Name</Label>
                        <Input
                          id="deptName"
                          value={newDepartment.departmentName}
                          onChange={(e) => setNewDepartment({ ...newDepartment, departmentName: e.target.value })}
                          className="col-span-3"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="location" className="text-right">Location</Label>
                        <Input
                          id="location"
                          value={newDepartment.location}
                          onChange={(e) => setNewDepartment({ ...newDepartment, location: e.target.value })}
                          className="col-span-3"
                          required
                        />
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={isSubmittingDept}>
                          {isSubmittingDept && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Create Department
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                      Create a new account for the system. Fill in all required details.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateUser} className="space-y-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">Name</Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="password" className="text-right">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="role" className="text-right">Role</Label>
                      <Select
                        value={newUser.systemRole}
                        onValueChange={(value) => setNewUser({ ...newUser, systemRole: value as SystemRole })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={SystemRole.SUPER_ADMIN}>Super Admin</SelectItem>
                          <SelectItem value={SystemRole.ADMIN}>Admin</SelectItem>
                          <SelectItem value={SystemRole.MANAGER}>Manager</SelectItem>
                          <SelectItem value={SystemRole.EMPLOYEE}>Employee</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="department" className="text-right">Department</Label>
                      <Select
                        value={newUser.departmentId ? newUser.departmentId.toString() : ""}
                        onValueChange={(value) => setNewUser({ ...newUser, departmentId: parseInt(value) })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.departmentId} value={dept.departmentId.toString()}>
                              {dept.departmentName} ({dept.location})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Account
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

            {/* User Management List */}
            <div className="mt-8">
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
                      {loading ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        </div>
                      ) : (
                        <>
                          {users.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">No users found</div>
                          ) : (
                            users.filter(u => 
                              u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              u.email.toLowerCase().includes(searchQuery.toLowerCase())
                            ).map((user) => (
                              <div key={user.userId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                                <div className="flex items-center space-x-4">
                                  <Avatar className="h-12 w-12">
                                    <AvatarFallback className="bg-blue-100 text-blue-700">
                                      {user.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h4 className="font-medium">{user.name}</h4>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                    <p className="text-sm text-gray-500">{user.systemRole} • {(user.department as any)?.departmentName || user.department || "N/A"}</p>
                                    
                                    {/* Password mask toggle */}
                                    <div className="mt-1 flex items-center text-xs text-gray-500">
                                      <span className="mr-2">Password:</span>
                                      <span 
                                        onClick={() => togglePasswordVisibility(user.userId)}
                                        className="cursor-pointer font-mono bg-gray-100 px-2 py-0.5 rounded hover:bg-gray-200 transition-colors"
                                        title="Click to toggle visibility"
                                      >
                                        {visiblePasswords[user.userId] ? user.password : "••••••••••••••••"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                  <div className="text-right">
                                    <Badge className="bg-green-100 text-green-800">
                                      Active
                                    </Badge>
                                    <p className="text-xs text-gray-500 mt-1">ID: {user.userId}</p>
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
                            ))
                          )}
                          
                          {/* Pagination */}
                          <div className="flex items-center justify-between pt-4">
                            <p className="text-sm text-gray-500">
                              Showing {users.length} of {pagination.totalElements} users
                            </p>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => fetchUsers(pagination.page - 1)}
                                disabled={pagination.page === 0}
                              >
                                Previous
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => fetchUsers(pagination.page + 1)}
                                disabled={(pagination.page + 1) * pagination.size >= pagination.totalElements}
                              >
                                Next
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
              </Card>
            </div>
          </div>
  )
}
