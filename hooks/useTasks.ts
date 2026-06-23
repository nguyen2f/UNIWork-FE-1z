"use client"

import { useState, useEffect } from "react"
import { taskService } from "@/services/task.service"
import { toast } from "sonner"

export function useTasks(projectId?: string) {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async () => {
    if (!projectId) return

    try {
      setLoading(true)
      const data = await taskService.getByProject(projectId as any)
      setTasks(data)
      setError(null)
    } catch (err: any) {
      setError(err.message)
      toast.error("Failed to load tasks list")
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (taskData: any) => {
    try {
      const newTask = await taskService.create(taskData)
      setTasks((prev) => [...prev, newTask])
      toast.success("Task created successfully")
      return newTask
    } catch (err: any) {
      toast.error(err.message || "Failed to create task")
      throw err
    }
  }

  const updateTask = async (id: string, taskData: any) => {
    try {
      const updatedTask = await taskService.update(id as any, taskData)
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)))
      toast.success("Task updated successfully")
      return updatedTask
    } catch (err: any) {
      toast.error(err.message || "Failed to update task")
      throw err
    }
  }

  const updateTaskStatus = async (id: string, status: string) => {
    try {
      const updatedTask = await taskService.updateStatus(id as any, id as any, id as any, { status: status as any })
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)))
      toast.success("Task status updated successfully")
      return updatedTask
    } catch (err: any) {
      toast.error(err.message || "Failed to update task status")
      throw err
    }
  }

  const deleteTask = async (id: string) => {
    try {
      await taskService.delete(id as any)
      setTasks((prev) => prev.filter((t) => t.id !== id))
      toast.success("Task deleted successfully")
    } catch (err: any) {
      toast.error(err.message || "Failed to delete task")
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
