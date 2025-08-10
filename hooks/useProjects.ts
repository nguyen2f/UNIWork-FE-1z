"use client"

import { useState, useEffect } from "react"
import { projectsApi } from "@/lib/api"
import { toast } from "sonner"

export function useProjects() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const data = await projectsApi.getAll()
      setProjects(data)
      setError(null)
    } catch (err: any) {
      setError(err.message)
      toast.error("Không thể tải danh sách dự án")
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (projectData: any) => {
    try {
      const newProject = await projectsApi.create(projectData)
      setProjects((prev) => [...prev, newProject])
      toast.success("Tạo dự án thành công")
      return newProject
    } catch (err: any) {
      toast.error(err.message || "Không thể tạo dự án")
      throw err
    }
  }

  const updateProject = async (id: string, projectData: any) => {
    try {
      const updatedProject = await projectsApi.update(id, projectData)
      setProjects((prev) => prev.map((p) => (p.id === id ? updatedProject : p)))
      toast.success("Cập nhật dự án thành công")
      return updatedProject
    } catch (err: any) {
      toast.error(err.message || "Không thể cập nhật dự án")
      throw err
    }
  }

  const deleteProject = async (id: string) => {
    try {
      await projectsApi.delete(id)
      setProjects((prev) => prev.filter((p) => p.id !== id))
      toast.success("Xóa dự án thành công")
    } catch (err: any) {
      toast.error(err.message || "Không thể xóa dự án")
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
      const data = await projectsApi.getById(id)
      setProject(data)
      setError(null)
    } catch (err: any) {
      setError(err.message)
      toast.error("Không thể tải thông tin dự án")
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
