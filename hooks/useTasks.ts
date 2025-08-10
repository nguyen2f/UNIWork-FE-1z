"use client"

import { useState, useEffect } from "react"
import { tasksApi } from "@/lib/api"
import { toast } from "sonner"

export function useTasks(projectId?: string) {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async () => {
    if (!projectId) return

    try {
      setLoading(true)
      const data = await tasksApi.getByProject(projectId)
      setTasks(data)
      setError(null)
    } catch (err: any) {
      setError(err.message)
      toast.error("Không thể tải danh sách công việc")
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (taskData: any) => {
    try {
      const newTask = await tasksApi.create(taskData)
      setTasks((prev) => [...prev, newTask])
      toast.success("Tạo công việc thành công")
      return newTask
    } catch (err: any) {
      toast.error(err.message || "Không thể tạo công việc")
      throw err
    }
  }

  const updateTask = async (id: string, taskData: any) => {
    try {
      const updatedTask = await tasksApi.update(id, taskData)
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)))
      toast.success("Cập nhật công việc thành công")
      return updatedTask
    } catch (err: any) {
      toast.error(err.message || "Không thể cập nhật công việc")
      throw err
    }
  }

  const updateTaskStatus = async (id: string, status: string) => {
    try {
      const updatedTask = await tasksApi.updateStatus(id, status)
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)))
      toast.success("Cập nhật trạng thái thành công")
      return updatedTask
    } catch (err: any) {
      toast.error(err.message || "Không thể cập nhật trạng thái")
      throw err
    }
  }

  const deleteTask = async (id: string) => {
    try {
      await tasksApi.delete(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
      toast.success("Xóa công việc thành công")
    } catch (err: any) {
      toast.error(err.message || "Không thể xóa công việc")
      throw err
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [projectId])

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
  }
}
