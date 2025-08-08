"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, CheckSquare, FolderOpen, Home, Settings, Users, Calendar, MessageSquare, DollarSign, FileText, Shield, Briefcase } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Projects", href: "/projects", icon: FolderOpen, badge: "18" },
  { name: "Tasks", href: "/tasks", icon: CheckSquare, badge: "47" },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Team", href: "/team", icon: Users, badge: "24" },
  { name: "Budget", href: "/budget", icon: DollarSign },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Messages", href: "/messages", icon: MessageSquare, badge: "3" },
]

const adminNavigation = [
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Compliance", href: "/compliance", icon: Shield },
  { name: "Administration", href: "/admin", icon: Briefcase },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="flex items-center h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <span className="text-xl font-bold text-white">ProManage</span>
            <div className="text-xs text-blue-100">Enterprise</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        <div className="mb-6">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Main Navigation
          </h3>
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start mb-1 h-10",
                    isActive && "bg-blue-50 text-blue-700 hover:bg-blue-50 border-r-2 border-blue-600"
                  )}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  <span className="flex-1 text-left">{item.name}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            )
          })}
        </div>

        <div>
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Administration
          </h3>
          {adminNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start mb-1 h-10",
                    isActive && "bg-blue-50 text-blue-700 hover:bg-blue-50 border-r-2 border-blue-600"
                  )}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 mb-2">Current Plan</div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Enterprise Pro</span>
          <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
        </div>
      </div>
    </div>
  )
}
