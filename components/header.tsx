"use client"

import { Bell, Search, User, Settings, HelpCircle, LogOut, Building2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search projects, tasks, team members..." 
            className="pl-10 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500" 
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Organization Info */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-gray-50 rounded-lg">
          <Building2 className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Acme Corp</span>
        </div>

        {/* Help */}
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
          <HelpCircle className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-gray-700">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 hover:bg-red-500">
                5
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end">
            <DropdownMenuLabel className="font-semibold">Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-64 overflow-y-auto">
              <DropdownMenuItem className="flex flex-col items-start p-3 hover:bg-gray-50">
                <div className="font-medium text-sm">Security Audit Completed</div>
                <div className="text-xs text-gray-500 mt-1">SOC 2 compliance documentation ready for review</div>
                <div className="text-xs text-gray-400 mt-1">2 hours ago</div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start p-3 hover:bg-gray-50">
                <div className="font-medium text-sm">Budget Alert</div>
                <div className="text-xs text-gray-500 mt-1">CRM Migration project at 78% budget utilization</div>
                <div className="text-xs text-gray-400 mt-1">4 hours ago</div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start p-3 hover:bg-gray-50">
                <div className="font-medium text-sm">Team Update</div>
                <div className="text-xs text-gray-500 mt-1">3 new team members added to Digital Transformation project</div>
                <div className="text-xs text-gray-400 mt-1">6 hours ago</div>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-blue-600 hover:text-blue-700">
              View All Notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-xs leading-none text-muted-foreground mt-1">Project Director</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  john.doe@acmecorp.com
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Account Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help & Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
