"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Calendar,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
  DollarSign,
  Shield,
  FileText,
  Bell,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Team", href: "/team", icon: Users },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Budget", href: "/budget", icon: DollarSign },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Compliance", href: "/compliance", icon: Shield },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Admin", href: "/admin", icon: User },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div
      className={cn("bg-gray-900 text-white transition-all duration-300 flex flex-col", collapsed ? "w-16" : "w-64")}
    >
      {/* Logo */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg">ProManage</h1>
              <p className="text-xs text-gray-400">Enterprise</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white hover:bg-gray-800"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                  isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white",
                  collapsed && "justify-center",
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-800">
          <div className="text-xs text-gray-400">Version 1.0.0</div>
        </div>
      )}
    </div>
  )
}
