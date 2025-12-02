"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { EditProjectDialog } from "@/components/edit-project-dialog"
import { ViewLayoutToggle } from "@/components/view-layout-toggle"
import {
    Calendar,
    DollarSign,
    MoreVertical,
    Plus,
    Search,
    Users,
    FolderKanban,
    Edit,
    Trash2,
    Eye,
    ChevronLeft, ChevronRight
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { getAllProjects } from "../services/projectService"
import { Project } from "@/types"
import { ProjectParams } from "@/types/projectType"
import {fetchProjectReport} from "@/lib/api";
import {ProjectReport} from "@/types/response";

export default function ProjectsPage() {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [projects, setProjects] = useState<ProjectReport[]>([])
  const [params, setParams] = useState<ProjectParams>({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null);
  useEffect(() => {
    fetchProjects(projectPage)
  }, [])

    const [projectPage, setProjectPage] = useState(0); // Backend dùng 0-indexed
    const [projectPagination, setProjectPagination] = useState({
        currentPage: 0,
        pageSize: 6,
        totalElements: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false
    });

    const handleProjectPageChange = (newPage: number) => {
        if (newPage < 0 || newPage >= projectPagination.totalPages) return;
        setProjectPage(newPage);
        fetchProjects(newPage);
    };



    const fetchProjects = async (page: number = 0) => {
        try {
            setLoading(true);
            const result = await fetchProjectReport(page, 6);

            if (result.data) {
                setProjects(result.data);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLANNING":
        return "secondary"
      case "IN_PROGRESS":
        return "default"
      case "ON_HOLD":
        return "outline"
      case "COMPLETED":
        return "default"
      default:
        return "secondary"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "destructive"
      case "HIGH":
        return "destructive"
      case "MEDIUM":
        return "default"
      case "Low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const handleEdit = (project: any) => {
    setSelectedProject(project)
    setEditDialogOpen(true)
  }

  const handleDelete = (projectId: number) => {
    toast.success("Project deleted", {
      description: "The project has been deleted successfully.",
    })
  }

  console.log(projects)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Projects</h1>
              <p className="text-muted-foreground">Manage and track all your projects</p>
            </div>
            <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </div>

          {/* Filters and View Toggle */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search projects..." className="pl-9" />
            </div>
            <ViewLayoutToggle view={view} onViewChange={setView} />
          </div>

          {/* Grid View */}
          {view === "grid" && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects?.map((project) => (
                <Card key={project.project.projectId} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <FolderKanban className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">{project.project.name}</CardTitle>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/projects/${project.project.projectId}`} className="cursor-pointer">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(project)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(project.project.projectId)} className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.project.description}</p>

                    <div className="flex gap-2">
                        <Badge variant={project.project.status}>
                            {project.project.status}
                        </Badge>
                        <Badge variant={project.project.priority}>
                            {project.project.priority}
                        </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{project.completedPercent}%</span>
                      </div>
                      <Progress value={project.completedPercent} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{project.countMember} members</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {project.project.startDate} - {project.project.endDate}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {/* List View */}
          {view === "list" && (
            <div className="space-y-3">
              {projects.map((project) => (
                <Card key={project.project.projectId} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                          <FolderKanban className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{project.project.name}</h3>
                            <p className="text-sm text-muted-foreground">{project.project.description}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/projects/${project.project.projectId}`} className="cursor-pointer">
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(project)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(project.project.projectId)} className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex gap-2">
                              <Badge variant={project.project.status}>
                                  {project.project.status}
                              </Badge>
                              <Badge variant={project.project.priority}>
                                  {project.project.priority}
                              </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {/*<div className="flex items-center gap-1">*/}
                            {/*  <Users className="h-4 w-4" />*/}
                            {/*  <span>{5}</span>*/}
                            {/*</div>*/}
                            {/*<div className="flex items-center gap-1">*/}
                            {/*  <DollarSign className="h-4 w-4" />*/}
                            {/*  <span>${project.budget}</span>*/}
                            {/*</div>*/}
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {project.project.startDate} - {project.project.endDate}
                              </span>
                            </div>
                          </div>

                          {/*<div className="flex items-center gap-3 ml-auto">*/}
                          {/*  <div className="w-32">*/}
                          {/*    <Progress value={project.progress} />*/}
                          {/*  </div>*/}
                          {/*  <span className="text-sm font-medium w-12">{project.progress}%</span>*/}
                          {/*</div>*/}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
            {projectPagination.totalPages > 1 && (
                <Pagination
                    currentPage={projectPagination.currentPage}
                    totalPages={projectPagination.totalPages}
                    hasNext={projectPagination.hasNext}
                    hasPrevious={projectPagination.hasPrevious}
                    onPageChange={handleProjectPageChange}
                />
            )}
        </main>
      </div>

      <CreateProjectDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      <EditProjectDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} project={selectedProject} />
    </div>
  )
}
