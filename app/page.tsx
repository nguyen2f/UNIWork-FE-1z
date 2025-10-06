"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Users, AlertTriangle, DollarSign, Target } from "lucide-react"

export default function Dashboard() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    } else {
      router.push("/auth/signin")
    }
  }, [isAuthenticated, router])

  const [projects] = useState([
    {
      id: 1,
      name: "Enterprise CRM Migration",
      description: "Migration of legacy CRM system to Salesforce with data integration and user training",
      progress: 78,
      dueDate: "2024-03-15",
      status: "On Track",
      priority: "Critical",
      team: ["JD", "SM", "AL", "RK", "MH"],
      tasks: { completed: 24, total: 31 },
      budget: { allocated: 250000, spent: 195000 },
      client: "Acme Corporation",
      department: "IT Operations",
    },
    {
      id: 2,
      name: "Digital Transformation Initiative",
      description: "Company-wide digital transformation including process automation and cloud migration",
      progress: 45,
      dueDate: "2024-06-30",
      status: "In Progress",
      priority: "High",
      team: ["RW", "KL", "MJ", "TH", "NK", "LS"],
      tasks: { completed: 18, total: 40 },
      budget: { allocated: 500000, spent: 225000 },
      client: "Internal",
      department: "Digital Strategy",
    },
    {
      id: 3,
      name: "Security Compliance Audit",
      description: "SOC 2 Type II compliance audit and implementation of security controls",
      progress: 92,
      dueDate: "2024-02-28",
      status: "Nearly Complete",
      priority: "Critical",
      team: ["DK", "PL", "AM"],
      tasks: { completed: 23, total: 25 },
      budget: { allocated: 150000, spent: 138000 },
      client: "Internal",
      department: "Security & Compliance",
    },
  ])

  const [recentActivities] = useState([
    {
      id: 1,
      title: "Security audit documentation completed",
      project: "Security Compliance Audit",
      priority: "Critical",
      time: "2 hours ago",
      user: "David Kim",
      type: "milestone",
    },
    {
      id: 2,
      title: "CRM data migration phase 2 started",
      project: "Enterprise CRM Migration",
      priority: "High",
      time: "4 hours ago",
      user: "Sarah Miller",
      type: "update",
    },
    {
      id: 3,
      title: "Budget approval received for Q2 initiatives",
      project: "Digital Transformation",
      priority: "Medium",
      time: "6 hours ago",
      user: "John Doe",
      type: "approval",
    },
    {
      id: 4,
      title: "Stakeholder review meeting scheduled",
      project: "Enterprise CRM Migration",
      priority: "High",
      time: "8 hours ago",
      user: "Rachel Wong",
      type: "meeting",
    },
  ])

  const stats = [
    {
      title: "Active Projects",
      value: "18",
      icon: Target,
      change: "+3 from last quarter",
      trend: "up",
      color: "blue",
    },
    {
      title: "Total Budget",
      value: "$2.4M",
      icon: DollarSign,
      change: "15% of annual budget",
      trend: "neutral",
      color: "green",
    },
    {
      title: "Team Utilization",
      value: "87%",
      icon: Users,
      change: "+5% from last month",
      trend: "up",
      color: "purple",
    },
    {
      title: "At Risk Projects",
      value: "2",
      icon: AlertTriangle,
      change: "-1 from last week",
      trend: "down",
      color: "red",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Track":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Nearly Complete":
        return "bg-purple-100 text-purple-800"
      case "At Risk":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    </div>
  )
}
