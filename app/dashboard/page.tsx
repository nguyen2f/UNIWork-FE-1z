"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, Pie, PieChart } from 'recharts';
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
  MapPin, ChevronLeft, ChevronRight,
} from "lucide-react"
import { useEffect, useState } from "react"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { InviteMemberToProjectDialog } from "@/components/invite-team-member-dialog"

import {
  fetchProjectReport,
  fetchTaskReport,
  fetchPendingTasks,
  fetchTasksPerformance,
  fetchUpcomingEvents,
} from "@/lib/api"
import { ProjectReport, TaskPerformance } from "@/types/response";
import { Task, Event } from "@/types";

export default function DashboardPage() {
  const [projectPage, setProjectPage] = useState(0); // Backend dùng 0-indexed
  const [projectPagination, setProjectPagination] = useState({
    currentPage: 0,
    pageSize: 5,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false
  });

  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [taskPagination, setTaskPagination] = useState({
    currentPage: 0,
    pageSize: 6,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  });

  const [tasksPerformance, setTasksPerformance] = useState<TaskPerformance>();
  const [projectReport, setProjectReport] = useState<ProjectReport[]>();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [createProjectOpen, setCreateProjectOpen] = useState(false)
  const [createTaskOpen, setCreateTaskOpen] = useState(false)
  const [inviteTeamOpen, setInviteTeamOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null);
  const data = [
    { name: "Done", value: tasksPerformance?.doneTasks || 0 },
    { name: "Remaining", value: tasksPerformance?.remainingTasks || 0 },
  ];
  const Pagination = ({ currentPage, totalPages, onPageChange, hasNext, hasPrevious }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    hasNext: boolean;
    hasPrevious: boolean;
  }) => {
    return (
      <div className="flex items-center justify-between pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          Page {currentPage + 1} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}  // ← Đúng rồi
            disabled={!hasPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}  // ← Đúng rồi
            disabled={!hasNext}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

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
    fetchProjects(projectPage);
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

  const fetchProjects = async (page: number = 0) => {
    try {
      setLoading(true);
      const result = await fetchProjectReport(page, 5);

      if (result.data) {
        setProjectReport(result.data);
        if (result.pagination) {
          setProjectPagination(result.pagination);
        }
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };


  const fetchUpcomingTasks = async (page: number = 0) => {
    try {
      setLoading(true);
      const result = await fetchPendingTasks(page, 6); // API trả về { data, pagination }

      if (result.data) {
        setPendingTasks(result.data); // đây là mảng tasks
      }
      if (result.pagination) {
        setTaskPagination(result.pagination); // đây là object pagination
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching tasks:', err);
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

  const handleProjectPageChange = (newPage: number) => {
    if (newPage < 0 || newPage >= projectPagination.totalPages) return;
    setProjectPage(newPage);
    fetchProjects(newPage);
  };

  const handleTaskPageChange = (page: number) => {
    fetchUpcomingTasks(page);
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
                    <p className="text-3xl font-bold text-primary">
                      {tasksPerformance?.performance?.toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Done / Total</p>
                    <p className="text-xl font-semibold">
                      {tasksPerformance?.doneTasks} / {tasksPerformance?.totalTasks}
                    </p>
                  </div>
                </div>
                {/* Pie Chart */}
                <div className="w-full h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Completed", value: tasksPerformance?.doneTasks || 0 },
                          { name: "Remaining", value: tasksPerformance?.remainingTasks || 0 }
                        ]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        <Cell fill="#cf0837" /> {/* green for completed */}
                        <Cell fill="#1616f9" /> {/* orange for remaining */}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

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
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {tasksPerformance?.remainingTasks}
                    </p>
                    <p className="text-sm text-muted-foreground">Remaining</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>


          <div className="grid gap-6 lg:grid-cols-2 mb-6">
            {/* Recent Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderKanban className="h-5 w-5" />
                  Recent Projects
                  {/* ✅ THÊM: Badge hiển thị tổng số */}
                  <Badge variant="secondary" className="ml-auto">
                    {projectPagination.totalElements} total
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectReport?.map((project) => (
                    <div key={project.project?.projectId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{project.project?.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span>{project.countMember} members</span>
                            <Calendar className="h-3 w-3 ml-2" />
                            <span>Due {project.project?.endDate}</span>
                          </div>
                        </div>
                        <Badge variant={getStatusColor(project.project?.status || "")}>
                          {project.project?.status}
                        </Badge>
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
                </div>

                {/* ✅ THÊM: Pagination cho projects */}
                {projectPagination.totalPages > 1 && (
                  <Pagination
                    currentPage={projectPagination.currentPage}
                    totalPages={projectPagination.totalPages}
                    hasNext={projectPagination.hasNext}
                    hasPrevious={projectPagination.hasPrevious}
                    onPageChange={handleProjectPageChange}
                  />
                )}
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListTodo className="h-5 w-5" />
                  Upcoming Tasks
                  {/* ✅ Badge hiển thị tổng số */}
                  <Badge variant="secondary" className="ml-auto">
                    {taskPagination.totalElements} total
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingTasks.map((task) => (
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

                {taskPagination.totalPages > 1 && (
                  <Pagination
                    currentPage={taskPagination.currentPage}
                    totalPages={taskPagination.totalPages}
                    hasNext={taskPagination.hasNext}
                    hasPrevious={taskPagination.hasPrevious}
                    onPageChange={handleTaskPageChange}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Team Activity & Performance */}
          {/*<div className="grid gap-6 lg:grid-cols-2">*/}
          {/*  /!* Team Activity *!/*/}
          {/*  <Card>*/}
          {/*    <CardHeader>*/}
          {/*      <CardTitle className="flex items-center gap-2">*/}
          {/*        <Calendar className="h-5 w-5" />*/}
          {/*        Upcoming Events*/}
          {/*      </CardTitle>*/}
          {/*    </CardHeader>*/}
          {/*    <CardContent className="space-y-4">*/}
          {/*      {upcomingEvents.length === 0 ? (*/}
          {/*          <div className="text-center py-8 text-muted-foreground">*/}
          {/*            No upcoming events*/}
          {/*          </div>*/}
          {/*      ) : (*/}
          {/*          upcomingEvents.map((event) => (*/}
          {/*              <div*/}
          {/*                  key={event.eventId}*/}
          {/*                  className="flex flex-col gap-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors"*/}
          {/*              >*/}
          {/*                <div className="flex items-start justify-between gap-2">*/}
          {/*                  <div className="flex-1">*/}
          {/*                    <h4 className="font-semibold text-sm mb-1">{event.title}</h4>*/}
          {/*                    <div className="flex flex-wrap gap-2 mb-2">*/}
          {/*                      <Badge*/}
          {/*                          variant={getPriorityColor(event.priority)}*/}
          {/*                          className="text-xs"*/}
          {/*                      >*/}
          {/*                        {event.priority}*/}
          {/*                      </Badge>*/}
          {/*                      <span className={`text-xs px-2 py-1 rounded-md ${getTypeColor(event.type)}`}>*/}
          {/*            {event.type}*/}
          {/*          </span>*/}
          {/*                    </div>*/}
          {/*                  </div>*/}
          {/*                </div>*/}

          {/*                <div className="space-y-2 text-sm text-muted-foreground">*/}
          {/*                  <div className="flex items-center gap-2">*/}
          {/*                    <Calendar className="h-4 w-4" />*/}
          {/*                    <span>{event.date}</span>*/}
          {/*                  </div>*/}

          {/*                  <div className="flex items-center gap-2">*/}
          {/*                    <Clock className="h-4 w-4" />*/}
          {/*                    <span>{event.duration}</span>*/}
          {/*                  </div>*/}

          {/*                  {event.location && (*/}
          {/*                      <div className="flex items-center gap-2">*/}
          {/*                        <MapPin className="h-4 w-4" />*/}
          {/*                        <span>{event.location}</span>*/}
          {/*                      </div>*/}
          {/*                  )}*/}
          {/*                </div>*/}
          {/*              </div>*/}
          {/*          ))*/}
          {/*      )}*/}
          {/*    </CardContent>*/}
          {/*  </Card>*/}



          {/*</div>*/}
        </main>
      </div>

      <CreateProjectDialog open={createProjectOpen} onOpenChange={setCreateProjectOpen} />
      <CreateTaskDialog open={createTaskOpen} onOpenChange={setCreateTaskOpen} />
      <InviteMemberToProjectDialog open={inviteTeamOpen} onOpenChange={setInviteTeamOpen} />
    </div>
  )
}
