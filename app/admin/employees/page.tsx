"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Plus } from "lucide-react"

const employees = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    role: "Project Manager",
    department: "Management",
    status: "Active",
    joinDate: "2023-01-15",
    avatar: "SJ",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@company.com",
    role: "Senior Developer",
    department: "Engineering",
    status: "Active",
    joinDate: "2022-08-20",
    avatar: "MC",
  },
  {
    id: 3,
    name: "Emma Davis",
    email: "emma.davis@company.com",
    role: "UX Designer",
    department: "Design",
    status: "Active",
    joinDate: "2023-03-10",
    avatar: "ED",
  },
  {
    id: 4,
    name: "James Wilson",
    email: "james.wilson@company.com",
    role: "Marketing Manager",
    department: "Marketing",
    status: "Active",
    joinDate: "2023-06-01",
    avatar: "JW",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    email: "lisa.anderson@company.com",
    role: "HR Specialist",
    department: "HR",
    status: "On Leave",
    joinDate: "2023-02-15",
    avatar: "LA",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800"
    case "On Leave":
      return "bg-yellow-100 text-yellow-800"
    case "Inactive":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDept, setFilterDept] = useState("all")

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesDept = filterDept === "all" || emp.department === filterDept
    return matchesSearch && matchesDept
  })

  const departments = ["all", ...new Set(employees.map((e) => e.department))]

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader
        title="Employee Management"
        description="Manage team members, roles, and permissions"
        actionLabel="Add Employee"
      />

      <div className="p-6 space-y-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Total Employees", value: employees.length },
            {
              label: "Active",
              value: employees.filter((e) => e.status === "Active").length,
            },
            {
              label: "On Leave",
              value: employees.filter((e) => e.status === "On Leave").length,
            },
          ].map((stat, idx) => (
            <Card key={idx}>
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Employees Table */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>View and manage employee information</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and Filter */}
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-3 py-2 border rounded-lg bg-background"
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === "all" ? "All Departments" : dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Employees List */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      Role
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      Department
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      Join Date
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="border-b hover:bg-accent transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-sm">
                              {emp.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{emp.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {emp.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{emp.role}</td>
                      <td className="p-4">{emp.department}</td>
                      <td className="p-4">
                        <Badge className={getStatusColor(emp.status)}>
                          {emp.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {emp.joinDate}
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Manage Permissions</DropdownMenuItem>
                            <DropdownMenuItem>Reset Password</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              Deactivate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
