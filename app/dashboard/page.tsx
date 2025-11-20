"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  FolderKanban,
  ListTodo,
  Plus,
  TrendingUp,
  Users,
  UserPlus,
    MapPin,
} from "lucide-react"
import { useEffect, useState } from "react"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { InviteTeamMemberDialog } from "@/components/invite-team-member-dialog"

import {
  fetchProjectReport,
  fetchTaskReport,
  fetchPendingTasks,
  fetchTasksPerformance,
  fetchUpcomingEvents,
} from "@/lib/api"
import {ProjectReport, TaskPerformance} from "@/types/response";
import { Task, Event } from "@/types";

export default function DashboardPage() {
  const [projectReport, setProjectReport] = useState<ProjectReport[]>([]);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([])
  const [tasksPerformance, setTasksPerformance] = useState<TaskPerformance>();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [createProjectOpen, setCreateProjectOpen] = useState(false)
  const [createTaskOpen, setCreateTaskOpen] = useState(false)
  const [inviteTeamOpen, setInviteTeamOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null);


  const stats = [
    {
      title: "Active Projects",
      value: "12",
      change: "+2 this month",
      icon: FolderKanban,
      color: "text-blue-600",
    },
    {
      title: "Tasks Completed",
      value: "147",
      change: "+23 this week",
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      title: "Team Members",
      value: "28",
      change: "+4 new",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Pending Tasks",
      value: "34",
      change: "-8 from last week",
      icon: Clock,
      color: "text-orange-600",
    },
  ]


  const getStatusColor = (status: string) => {
    switch (status) {
      case "HIGH":
        return "destructive"
      case "MEDIUM":
        return "default"
      case "LOW":
        return "secondary"
      default:
        return "default"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'destructive';
      case 'HIGH':
        return 'default';
      case 'MEDIUM':
        return 'secondary';
      case 'LOW':
        return 'outline';
      default:
        return 'secondary';
    }
  };


  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'MEETING': 'bg-blue-100 text-blue-700',
      'DEADLINE': 'bg-red-100 text-red-700',
      'REVIEW': 'bg-purple-100 text-purple-700',
      'PRESENTATION': 'bg-green-100 text-green-700',
      'WORKSHOP': 'bg-orange-100 text-orange-700',
    };
    return colors[type.toUpperCase()] || 'bg-gray-100 text-gray-700';
  };

  useEffect(() => {
    fetchProjects();
    fetchUpcomingTasks();
    fetchPerformance();
    fetchEvents();
  }, []);

  const chartData = [
    {
      name: 'Total Tasks',
      value: tasksPerformance?.totalTasks,
      fill: '#8884d8'
    },
    {
      name: 'Done',
      value: tasksPerformance?.doneTasks,
      fill: '#22c55e'
    }
  ];

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const result = await fetchProjectReport();

      if (result.data) {
        setProjectReport(result.data);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingTasks = async () => {
    try {
      setLoading(true);
      const result = await fetchPendingTasks();

      if (result.data) {
        setPendingTasks(result.data);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformance = async () => {
    try {
      setLoading(true);
      const result = await fetchTasksPerformance();

      if (result.data) {
        setTasksPerformance(result.data);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching tasks performance:', err);
    }
  };

  const fetchEvents = async () => {
    try {
        setLoading(true);
        const result = await fetchUpcomingEvents();

        if (result.data) {
            setUpcomingEvents(result.data);
        }

    } catch (err: any) {
        setError(err.message);
        console.error('Error fetching upcoming events:', err);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {/* Quick Actions */}
          <div className="mb-6 flex gap-3">
            <Button onClick={() => setCreateProjectOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
            <Button onClick={() => setCreateTaskOpen(true)} variant="outline" className="gap-2">
              <ListTodo className="h-4 w-4" />
              Create Task
            </Button>
            <Button onClick={() => setInviteTeamOpen(true)} variant="outline" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Invite Team Member
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2 mb-6">
            {/* Recent Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderKanban className="h-5 w-5" />
                  Recent Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {projectReport?.map((project) => (
                  <div key={project.project.projectId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{project.project.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>{project.countMember} members</span>
                          <Calendar className="h-3 w-3 ml-2" />
                          <span>Due {project.project.endDate}</span>
                        </div>
                      </div>
                      <Badge variant={getStatusColor(project.project.status)}>{project.project.status}</Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{project.completedPercent}%</span>
                      </div>
                      <Progress value={project.completedPercent} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListTodo className="h-5 w-5" />
                  Upcoming Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingTasks?.map((task) => (
                  <div key={task.taskId} className="flex items-start justify-between p-3 rounded-lg border">
                    <div className="space-y-1">
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">{task.projectId}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant={getStatusColor(task.status)}>{task.status}</Badge>
                      <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Team Activity & Performance */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Team Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No upcoming events
                    </div>
                ) : (
                    upcomingEvents.map((event) => (
                        <div
                            key={event.eventId}
                            className="flex flex-col gap-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm mb-1">{event.title}</h4>
                              <div className="flex flex-wrap gap-2 mb-2">
                                <Badge
                                    variant={getPriorityColor(event.priority)}
                                    className="text-xs"
                                >
                                  {event.priority}
                                </Badge>
                                <span className={`text-xs px-2 py-1 rounded-md ${getTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{event.date}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{event.duration}</span>
                            </div>

                            {event.location && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>{event.location}</span>
                                </div>
                            )}
                          </div>
                        </div>
                    ))
                )}
              </CardContent>
            </Card>

            {/* Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Performance percentage */}
                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Completion Rate</p>
                      <p className="text-3xl font-bold text-primary">{tasksPerformance?.performance.toFixed(1)}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Done / Total</p>
                      <p className="text-xl font-semibold">
                        {tasksPerformance?.doneTasks} / {tasksPerformance?.totalTasks}
                      </p>
                    </div>
                  </div>

                  {/* Bar Chart */}
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {tasksPerformance?.totalTasks}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Tasks</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {tasksPerformance?.doneTasks}
                      </p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                    {/*<div className="text-center">*/}
                    {/*  <p className="text-2xl font-bold text-orange-600">*/}
                    {/*    {tasksPerformance?.totalTasks - tasksPerformance?.doneTasks}*/}
                    {/*  </p>*/}
                    {/*  <p className="text-sm text-muted-foreground">In Progress</p>*/}
                    {/*</div>*/}
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </main>
      </div>

      <CreateProjectDialog open={createProjectOpen} onOpenChange={setCreateProjectOpen} />
      <CreateTaskDialog open={createTaskOpen} onOpenChange={setCreateTaskOpen} />
      <InviteTeamMemberDialog open={inviteTeamOpen} onOpenChange={setInviteTeamOpen} />
    </div>
  )
}
