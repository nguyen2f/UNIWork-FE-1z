"use client"

import { useState, useEffect } from "react"
import { projectService } from "@/services/project.service"
import { toast } from "sonner"

export function useProjects() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const data = await projectService.getAll()
      setProjects(data)
      setError(null)
    } catch (err: any) {
      setError(err.message)
      toast.error("Failed to load projects list")
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (projectData: any) => {
    try {
      const newProject = await projectService.create(projectData)
      setProjects((prev) => [...prev, newProject])
      toast.success("Project created successfully")
      return newProject
    } catch (err: any) {
      toast.error(err.message || "Failed to create project")
      throw err
    }
  }

  const updateProject = async (id: string, projectData: any) => {
    try {
      const updatedProject = await projectService.update(id as any, projectData)
      setProjects((prev) => prev.map((p) => (p.id === id ? updatedProject : p)))
      toast.success("Project updated successfully")
      return updatedProject
    } catch (err: any) {
      toast.error(err.message || "Failed to update project")
      throw err
    }
  }

  const deleteProject = async (id: string) => {
    try {
      await projectService.delete(id as any)
      setProjects((prev) => prev.filter((p) => p.id !== id))
      toast.success("Project deleted successfully")
    } catch (err: any) {
      toast.error(err.message || "Failed to delete project")
      throw err
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  }
}

export function useProject(id: string) {
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProject = async () => {
    try {
      setLoading(true)
      const data = await projectService.getById(id as any)
      setProject(data)
      setError(null)
    } catch (err: any) {
      setError(err.message)
      toast.error("Failed to load project details")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchProject()
    }
  }, [id])

  return {
    project,
    loading,
    error,
    fetchProject,
    setProject,
  }
}
