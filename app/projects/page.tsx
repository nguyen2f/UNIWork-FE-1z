"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { CreateProjectDialog } from "@/components/project/create-project-dialog"
import { EditProjectDialog } from "@/components/project/edit-project-dialog"
import {
  Calendar, MoreVertical, Plus, Search, Users, FolderKanban, Edit, Trash2,
  Eye, ChevronLeft, ChevronRight, Target, Zap, CheckCircle2, AlertCircle,
  Play, LayoutGrid, List, TrendingUp, Flag
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import type { ProjectParams, ProjectReport } from "@/types/project.types"
import { fetchProjectReport } from "@/services/report.service"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

const StatusCfg: Record<string, { label: string; dot: string; bg: string }> = {
  PLANNING: { label: "Planning", dot: "bg-amber-400", bg: "bg-amber-50 text-amber-700 border-amber-200" },
  IN_PROGRESS: { label: "In Progress", dot: "bg-blue-500", bg: "bg-blue-50 text-blue-700 border-blue-200" },
  ACTIVE: { label: "Active", dot: "bg-emerald-500", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  ON_HOLD: { label: "On Hold", dot: "bg-red-400", bg: "bg-red-50 text-red-700 border-red-200" },
  COMPLETED: { label: "Completed", dot: "bg-indigo-500", bg: "bg-indigo-50 text-indigo-700 border-indigo-200" },
}

const PriorityCfg: Record<string, { label: string; color: string }> = {
  LOW: { label: "Low", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  MEDIUM: { label: "Medium", color: "text-amber-600 bg-amber-50 border-amber-200" },
  HIGH: { label: "High", color: "text-orange-600 bg-orange-50 border-orange-200" },
  CRITICAL: { label: "Critical", color: "text-red-600 bg-red-50 border-red-200" },
}

export default function ProjectsPage() {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [projects, setProjects] = useState<ProjectReport[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null)
  const [projectPage, setProjectPage] = useState(0)
  const [projectPagination, setProjectPagination] = useState({
    currentPage: 0, pageSize: 6, totalElements: 0, totalPages: 0, hasNext: false, hasPrevious: false,
  })

  useEffect(() => { fetchProjects(projectPage) }, [])

  const fetchProjects = async (page = 0) => {
    try {
      setLoading(true)
      const result = await fetchProjectReport(page, 6)
      if (result.data) {
        setProjects(result.data)
        if (result.pagination) setProjectPagination(result.pagination)
      }
    } catch (err: any) {
      console.error("Error fetching projects:", err)
    } finally { setLoading(false) }
  }

  const handleProjectPageChange = (newPage: number) => {
    if (newPage < 0 || newPage >= projectPagination.totalPages) return
    setProjectPage(newPage)
    fetchProjects(newPage)
  }

  const handleEdit = (project: any) => { setSelectedProject(project); setEditDialogOpen(true) }
  const handleDelete = (projectId: number) => { toast.success("Project deleted") }

  const filteredProjects = projects.filter((p) => {
    if (!p.project) return false
    if (statusFilter && p.project.status !== statusFilter) return false
    if (priorityFilter && p.project.priority !== priorityFilter) return false
    return true
  })

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6">
          {/* Header */}
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
                <p className="text-sm text-slate-500 mt-1">Manage and track all your projects</p>
              </div>
              <Button onClick={() => setCreateDialogOpen(true)} className="gap-1.5 shadow-sm">
                <Plus className="h-4 w-4" /> New Project
              </Button>
            </div>

            {/* Filters */}
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex gap-3 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input placeholder="Search projects..." className="pl-9 bg-white border-slate-200" />
                </div>
                <Select onValueChange={(v) => setStatusFilter(v === "CLEAR" ? null : v)}>
                  <SelectTrigger className="w-[150px] bg-white"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLEAR">All Status</SelectItem>
                    <SelectItem value="PLANNING">Planning</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="ON_HOLD">On Hold</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select onValueChange={(v) => setPriorityFilter(v === "CLEAR" ? null : v)}>
                  <SelectTrigger className="w-[150px] bg-white"><SelectValue placeholder="Priority" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLEAR">All Priority</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
                <Button variant={view === "grid" ? "default" : "ghost"} size="sm" onClick={() => setView("grid")} className="h-7 w-7 p-0">
                  <LayoutGrid className="h-3.5 w-3.5" />
                </Button>
                <Button variant={view === "list" ? "default" : "ghost"} size="sm" onClick={() => setView("list")} className="h-7 w-7 p-0">
                  <List className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Grid View */}
            {view === "grid" && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => {
                  const status = StatusCfg[project.project?.status || ""] || StatusCfg.PLANNING
                  const priority = PriorityCfg[project.project?.priority || ""] || PriorityCfg.MEDIUM
                  return (
                    <Link key={project.project?.projectId} href={`/projects/${project.project?.projectId}`}>
                      <Card className="group hover:shadow-lg hover:border-blue-200/80 transition-all duration-300 cursor-pointer h-full">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                              <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 flex-shrink-0">
                                <FolderKanban className="h-4 w-4 text-white" />
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">{project.project?.name}</h3>
                                <p className="text-xs text-slate-400 truncate">{project.project?.description}</p>
                              </div>
                            </div>
                            {/* <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={(e) => e.preventDefault()}>
                                  <MoreVertical className="h-3.5 w-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => { e.preventDefault(); handleEdit(project) }}>
                                  <Edit className="h-4 w-4 mr-2" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => { e.preventDefault(); project.project?.projectId && handleDelete(project.project.projectId) }} className="text-destructive">
                                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu> */}
                          </div>

                          <div className="flex gap-1.5 mb-4">
                            <Badge variant="outline" className={`text-xs border ${status.bg}`}>
                              <div className={`w-1.5 h-1.5 rounded-full mr-1 ${status.dot}`} />{status.label}
                            </Badge>
                            <Badge variant="outline" className={`text-xs border ${priority.color}`}>
                              <Flag className="h-2.5 w-2.5 mr-1" />{priority.label}
                            </Badge>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-500">Progress</span>
                              <span className="font-semibold text-slate-900">{project.completedPercent}%</span>
                            </div>
                            <Progress value={project.completedPercent} className="h-1.5" />
                          </div>

                          <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-1"><Users className="h-3 w-3" />{project.countMember} members</div>
                            <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />{project.project?.endDate}</div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            )}

            {/* List View */}
            {view === "list" && (
              <div className="space-y-2">
                {filteredProjects.map((project) => {
                  const status = StatusCfg[project.project?.status || ""] || StatusCfg.PLANNING
                  const priority = PriorityCfg[project.project?.priority || ""] || PriorityCfg.MEDIUM
                  return (
                    <Link key={project.project?.projectId} href={`/projects/${project.project?.projectId}`}>
                      <Card className="group hover:shadow-md hover:border-blue-200/80 transition-all duration-200 cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 flex-shrink-0">
                              <FolderKanban className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{project.project?.name}</h3>
                              <p className="text-xs text-slate-400 truncate">{project.project?.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={`text-xs border ${status.bg}`}>
                                <div className={`w-1.5 h-1.5 rounded-full mr-1 ${status.dot}`} />{status.label}
                              </Badge>
                              <Badge variant="outline" className={`text-xs border ${priority.color}`}>
                                <Flag className="h-2.5 w-2.5 mr-1" />{priority.label}
                              </Badge>
                            </div>
                            <div className="w-24 flex-shrink-0">
                              <div className="flex justify-between text-xs text-slate-500 mb-1">
                                <span>{project.completedPercent}%</span>
                              </div>
                              <Progress value={project.completedPercent} className="h-1.5" />
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 flex-shrink-0">
                              <span className="flex items-center gap-1"><Users className="h-3 w-3" />{project.countMember}</span>
                              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{project.project?.endDate}</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            )}

            {/* Pagination */}
            {projectPagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200">
                <p className="text-sm text-slate-500">Page {projectPagination.currentPage + 1} of {projectPagination.totalPages}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleProjectPageChange(projectPagination.currentPage - 1)} disabled={!projectPagination.hasPrevious}>
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleProjectPageChange(projectPagination.currentPage + 1)} disabled={!projectPagination.hasNext}>
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <CreateProjectDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      <EditProjectDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} project={selectedProject} />
    </div>
  )
}
