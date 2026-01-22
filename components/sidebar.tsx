"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  MessageSquare,
  BarChart3,
  Calendar,
  Settings,
} from "lucide-react"

export const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Team", href: "/team", icon: Users },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center flex-shrink-0 px-4 py-5 border-b">
        <FolderKanban className="h-8 w-8 text-blue-600" />
        <span className="ml-2 text-xl font-bold text-gray-900">UNIWORK</span>
      </div>
      <div className="mt-4 flex-grow flex flex-col">
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onItemClick}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"
                    }`}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export function Sidebar() {
  return (
    <div className="hidden md:flex md:w-64 md:flex-col border-r h-full overflow-y-auto">
      <SidebarContent />
    </div>
  )
}
