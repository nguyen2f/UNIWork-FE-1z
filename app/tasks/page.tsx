"use client"

import { useState } from "react"
import { Search, Filter, MoreHorizontal, Calendar, User, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "../../components/sidebar"
import { Header } from "../../components/header"
import { CreateTaskDialog } from "../../components/create-task-dialog"

export default function TasksPage() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Update homepage design",
      description: "Redesign the homepage layout with new branding guidelines",
      project: "Website Redesign",
      assignee: "SM",
      priority: "High",
      status: "In Progress",
      dueDate: "Today",
      completed: false,
      tags: ["Design", "Frontend"],
    },
    {
      id: 2,
      title: "Implement user authentication",
      description: "Add login and registration functionality with JWT tokens",
      project: "Mobile App",
      assignee: "RW",
      priority: "High",
      status: "In Progress",
      dueDate: "Tomorrow",
      completed: false,
      tags: ["Backend", "Security"],
    },
    {
      id: 3,
      title: "Database schema review",
      description: "Review and optimize database schema for performance",
      project: "Database Migration",
      assignee: "TH",
      priority: "Medium",
      status: "Review",
      dueDate: "Jan 28",
      completed: false,
      tags: ["Database", "Performance"],
    },
    {
      id: 4,
      title: "API integration testing",
      description: "Test all third-party API integrations and error handling",
      project: "Mobile App",
      assignee: "KL",
      priority: "High",
      status: "Testing",
      dueDate: "Jan 29",
      completed: false,
      tags: ["API", "Testing"],
    },
    {
      id: 5,
      title: "Create user documentation",
      description: "Write comprehensive user guide for new features",
      project: "Website Redesign",
      assignee: "AL",
      priority: "Low",
      status: "Todo",
      dueDate: "Feb 5",
      completed: false,
      tags: ["Documentation"],
    },
    {
      id: 6,
      title: "Setup monitoring dashboard",
      description: "Configure application monitoring and alerting system",
      project: "Database Migration",
      assignee: "NK",
      priority: "Medium",
      status: "Completed",
      dueDate: "Jan 20",
      completed: true,
      tags: ["Monitoring", "DevOps"],
    },
  ])

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed, status: !task.completed ? "Completed" : "Todo" }
          : task,
      ),
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive"
      case "Medium":
        return "default"
      case "Low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "default"
      case "In Progress":
        return "secondary"
      case "Review":
        return "outline"
      case "Testing":
        return "outline"
      case "Todo":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const filterTasks = (status: string) => {
    if (status === "all") return tasks
    if (status === "completed") return tasks.filter((task) => task.completed)
    if (status === "active") return tasks.filter((task) => !task.completed)
    return tasks.filter((task) => task.status.toLowerCase() === status)
  }

  const TaskCard = ({ task }: { task: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Checkbox checked={task.completed} onCheckedChange={() => toggleTaskCompletion(task.id)} className="mt-1" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className={`font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                  {task.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit Task</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem>Move to Project</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Badge variant={getStatusColor(task.status)}>{task.status}</Badge>
              <Badge variant={getPriorityColor(task.priority)}>
                <Flag className="h-3 w-3 mr-1" />
                {task.priority}
              </Badge>
              {task.tags.map((tag, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">{task.assignee}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {task.dueDate}
                </div>
              </div>
              <span className="text-xs text-gray-500">{task.project}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
                <p className="text-gray-600 mt-2">Manage and track all your tasks across projects</p>
              </div>
              <CreateTaskDialog />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search tasks..." className="pl-10" />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All Tasks</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="in progress">In Progress</TabsTrigger>
                <TabsTrigger value="review">Review</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              {["all", "active", "in progress", "review", "completed"].map((tab) => (
                <TabsContent key={tab} value={tab} className="mt-6">
                  <div className="space-y-4">
                    {filterTasks(tab).map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                    {filterTasks(tab).length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-gray-500">No tasks found in this category</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
