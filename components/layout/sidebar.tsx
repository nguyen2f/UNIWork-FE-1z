"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  AlertCircle,
  Users,
  BarChart3,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from "lucide-react"

export const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Issues", href: "/issues", icon: AlertCircle },
  { name: "Team", href: "/team", icon: Users },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
]

export const adminNavigation = [
  { name: "Admin Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
  { name: "Users", href: "/admin/users", icon: Users },
]

export function SidebarContent({
  onItemClick,
  isCollapsed = false,
}: {
  onItemClick?: () => void
  isCollapsed?: boolean
}) {
  const pathname = usePathname()
  const isAdminPath = pathname.startsWith("/admin")
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    const storedRole = localStorage.getItem("role")
    setRole(storedRole)
  }, [])

  const navItems = isAdminPath ? adminNavigation : navigation

  return (
    <div className="flex flex-col h-full bg-white">
      <div className={`flex items-center flex-shrink-0 px-4 py-5 border-b ${isCollapsed ? "justify-center" : "justify-between"}`}>
        {!isCollapsed ? (
          <div className="flex items-center">
            <FolderKanban className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">UNIWORK</span>
            {isAdminPath && (
              <span className="ml-2 px-2 py-1 text-xs font-bold bg-blue-100 text-blue-700 rounded">
                AD
              </span>
            )}
          </div>
        ) : (
          <FolderKanban className="h-8 w-8 text-blue-600" />
        )}
      </div>
      <div className="mt-4 flex-grow flex flex-col overflow-y-auto overflow-x-hidden">
        <nav className="flex-1 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onItemClick}
                title={isCollapsed ? item.name : undefined}
                className={`group flex items-center rounded-md transition-all duration-200 ${
                  isCollapsed ? "justify-center py-3 px-0 mx-1" : "px-3 py-2"
                } ${isActive ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <item.icon
                  className={`flex-shrink-0 h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${
                    isCollapsed ? "mr-0" : "mr-3"
                  } ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"
                    }`}
                />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const stored = localStorage.getItem("sidebar_collapsed")
    if (stored === "true") {
      setIsCollapsed(true)
    }
  }, [])

  const toggleSidebar = () => {
    const nextState = !isCollapsed
    setIsCollapsed(nextState)
    localStorage.setItem("sidebar_collapsed", nextState ? "true" : "false")
    window.dispatchEvent(new Event("sidebar-toggle"))
    
    // Dispatch resize event to force responsive charts to recalculate layout
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"))
    }, 300)
  }

  // To prevent layout shift or SSR hydration mismatches, we render a placeholder with the default width until mounted
  if (!isMounted) {
    return (
      <div className="hidden md:flex md:flex-col border-r h-full w-64 bg-white" />
    )
  }

  return (
    <div className={`relative hidden md:flex md:flex-col border-r h-full transition-all duration-300 ease-in-out bg-white z-40 ${
      isCollapsed ? "w-20" : "w-64"
    }`}>
      <SidebarContent isCollapsed={isCollapsed} />
      
      {/* Floating Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-6 -right-3 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-md hover:bg-gray-50 hover:text-gray-900 transition-all z-50 focus:outline-none"
        title={isCollapsed ? "Expand" : "Collapse"}
      >
        {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>
    </div>
  )
}
