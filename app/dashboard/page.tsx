"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, Pie, PieChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
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
import { useRouter } from "next/navigation"
import { CreateProjectDialog } from "@/components/project/create-project-dialog"
import { CreateTaskDialog } from "@/components/task/create-task-dialog"
import { InviteMemberToProjectDialog } from "@/components/user/invite-team-member-dialog"

import {
  fetchProjectReport,
  fetchPendingTasks,
  fetchPendingIssues,
  fetchTaskReport,
  fetchTasksPerformance,
  fetchUpcomingEvents,
} from "@/services/report.service"
import { ProjectReport } from "@/types/project.types";
import { TaskPerformance } from "@/types/task.types";
import { IssueDTO } from "@/types/issue.types";
import { Task } from "@/types/task.types";
import { Event } from "@/types/event.types";

interface OverallReport {
  task: TaskPerformance;
  issue: {
    totalIssues: number;
    doneIssues: number;
    performance: number;
    remainingIssues: number;
  };
}

export default function DashboardPage() {
  const router = useRouter()
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

  const [pendingIssues, setPendingIssues] = useState<IssueDTO[]>([]);
  const [issuePagination, setIssuePagination] = useState({
    currentPage: 0,
    pageSize: 6,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  });

  const [overallReport, setOverallReport] = useState<OverallReport>();

  const [projectReport, setProjectReport] = useState<ProjectReport[]>();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [createProjectOpen, setCreateProjectOpen] = useState(false)
  const [createTaskOpen, setCreateTaskOpen] = useState(false)
  const [inviteTeamOpen, setInviteTeamOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null);
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
      value: projectPagination.totalElements.toString(),
      change: "Across all teams",
      icon: FolderKanban,
      color: "text-blue-600",
    },
    {
      title: "Tasks Done",
      value: (overallReport?.task?.doneTasks || 0).toString(),
      change: `${overallReport?.task?.performance?.toFixed(1) || 0}% complete`,
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      title: "Issues Resolved",
      value: (overallReport?.issue?.doneIssues || 0).toString(),
      change: `${overallReport?.issue?.performance?.toFixed(1) || 0}% fixed`,
      icon: TrendingUp,
      color: "text-orange-600",
    },
    {
      title: "Pending Items",
      value: ((overallReport?.task?.remainingTasks || 0) + (overallReport?.issue?.remainingIssues || 0)).toString(),
      change: "Tasks + Issues",
      icon: Clock,
      color: "text-purple-600",
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
    fetchUpcomingIssues();
    fetchOverview();
    fetchEvents();
  }, []);

  const chartData = [
    {
      name: 'Total Tasks',
      value: overallReport?.task?.totalTasks,
      fill: '#8884d8'
    },
    {
      name: 'Done',
      value: overallReport?.task?.doneTasks,
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

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const result = await fetchTaskReport();
      if (result.data) {
        setOverallReport(result.data);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching overview report:', err);
    }
  };

  const fetchUpcomingIssues = async (page: number = 0) => {
    try {
      setLoading(true);
      const result = await fetchPendingIssues(page, 6);
      if (result.data) {
        setPendingIssues(result.data);
      }
      if (result.pagination) {
        setIssuePagination(result.pagination);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching issues:', err);
    } finally {
      setLoading(false);
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

  const handleIssuePageChange = (page: number) => {
    fetchUpcomingIssues(page);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {/* Quick Actions */}
          {/* <div className="mb-6 flex gap-3">
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
          </div> */}



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
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Overall Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Task Performance */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600" />
                    <h3 className="font-semibold">User Tasks</h3>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">Completion Rate</p>
                      <p className="text-3xl font-bold text-blue-700">
                        {overallReport?.task?.performance?.toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">Done / Total</p>
                      <p className="text-xl font-semibold text-blue-900">
                        {overallReport?.task?.doneTasks} / {overallReport?.task?.totalTasks}
                      </p>
                    </div>
                  </div>
                  <div className="w-full h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Completed", value: overallReport?.task?.doneTasks || 0 },
                            { name: "Remaining", value: overallReport?.task?.remainingTasks || 0 }
                          ]}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          innerRadius={40}
                          paddingAngle={5}
                        >
                          <Cell fill="#2563eb" />
                          <Cell fill="#e2e8f0" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Issue Performance */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-600" />
                    <h3 className="font-semibold">Bugs / Issues</h3>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                    <div>
                      <p className="text-xs text-orange-600 font-medium uppercase tracking-wider">Resolution Rate</p>
                      <p className="text-3xl font-bold text-orange-700">
                        {overallReport?.issue?.performance?.toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-orange-600 font-medium uppercase tracking-wider">Done / Total</p>
                      <p className="text-xl font-semibold text-orange-900">
                        {overallReport?.issue?.doneIssues} / {overallReport?.issue?.totalIssues}
                      </p>
                    </div>
                  </div>
                  <div className="w-full h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Resolved", value: overallReport?.issue?.doneIssues || 0 },
                            { name: "Remaining", value: overallReport?.issue?.remainingIssues || 0 }
                          ]}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          innerRadius={40}
                          paddingAngle={5}
                        >
                          <Cell fill="#ea580c" />
                          <Cell fill="#e2e8f0" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Projects */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5" />
                Recent Projects
                <Badge variant="secondary" className="ml-auto">
                  {projectPagination.totalElements} total
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectReport?.map((project) => (
                  <div key={project.project?.projectId} className="p-4 rounded-xl border bg-card hover:shadow-md transition-shadow space-y-3 cursor-pointer" onClick={() => project.project?.projectId && router.push(`/projects/${project.project.projectId}`)}>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-blue-900">{project.project?.name}</p>
                      <Badge variant={getStatusColor(project.project?.status || "")}>
                        {project.project?.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{project.countMember}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{project.project?.endDate}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground font-medium">{project.completedPercent}% Complete</span>
                      </div>
                      <Progress value={project.completedPercent} className="h-1.5" />
                    </div>
                  </div>
                ))}
              </div>

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

          <div className="grid gap-6 lg:grid-cols-2 mb-6">
            {/* Pending User Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <ListTodo className="h-5 w-5" />
                  Pending Tasks
                  <Badge variant="secondary" className="ml-auto">
                    {taskPagination.totalElements} total
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingTasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">No pending user tasks</div>
                ) : (
                  pendingTasks.map((task) => (
                    <div key={task.taskId} className="flex items-start justify-between p-3 rounded-lg border bg-white hover:border-blue-200 transition-colors cursor-pointer" onClick={() => router.push(`/tasks/${task.taskId}`)}>
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{task.title}</p>
                        <p className="text-xs text-muted-foreground">Stage: {task.stageName || 'Unassigned'}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant={getStatusColor(task.status)} className="text-[10px] h-5">{task.status}</Badge>
                        <span className="text-[10px] text-muted-foreground">{task.dueDate}</span>
                      </div>
                    </div>
                  ))
                )}

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

            {/* Pending Issues/Bugs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <TrendingUp className="h-5 w-5" />
                  Pending Bugs & Issues
                  <Badge variant="secondary" className="ml-auto">
                    {issuePagination.totalElements} total
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingIssues.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">No pending bugs or issues</div>
                ) : (
                  pendingIssues.map((issue) => (
                    <div key={issue.issueId} className="flex items-start justify-between p-3 rounded-lg border bg-white hover:border-orange-200 transition-colors cursor-pointer" onClick={() => router.push(`/issues/${issue.issueId}`)}>
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{issue.title}</p>
                        <p className="text-xs text-muted-foreground">Type: {issue.type}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant={getStatusColor(issue.status)} className="text-[10px] h-5">{issue.status}</Badge>
                        <span className="text-[10px] text-muted-foreground">{issue.dueDate || 'No due date'}</span>
                      </div>
                    </div>
                  ))
                )}

                {issuePagination.totalPages > 1 && (
                  <Pagination
                    currentPage={issuePagination.currentPage}
                    totalPages={issuePagination.totalPages}
                    hasNext={issuePagination.hasNext}
                    hasPrevious={issuePagination.hasPrevious}
                    onPageChange={handleIssuePageChange}
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

      {/* <CreateProjectDialog open={createProjectOpen} onOpenChange={setCreateProjectOpen} /> */}
      {/* <CreateTaskDialog open={createTaskOpen} onOpenChange={setCreateTaskOpen} />
      <InviteMemberToProjectDialog open={inviteTeamOpen} onOpenChange={setInviteTeamOpen} /> */}
    </div>
  )
}
