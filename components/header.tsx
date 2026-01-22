"use client"

import { Search, Settings, LogOut, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useAuth } from "@/hooks/use-auth"
import { NotificationsPopover } from "./notifications-popover"
import { SidebarContent } from "./sidebar"
import Link from "next/link"
import { useEffect, useState } from "react";

export function Header() {
    const { user, logout } = useAuth()
    const [userName, setUserName] = useState<string>("")
    const [role, setUserRole] = useState<string>("")
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const storedUserName = localStorage.getItem("userName")
        const storedRole = localStorage.getItem("role")
        if (storedUserName) {
            setUserName(storedUserName)
        }
        if (storedRole) {
            setUserRole(storedRole)
        }
    }, [])

    const displayName = user?.name || userName || "User"
    const avatarLetter = displayName.charAt(0).toUpperCase()
    const displayRole = user?.systemRole || role || "MEMBER"

    return (
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                    {/* Mobile Menu Toggle */}
                    <Dialog open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent
                            className="fixed inset-y-0 left-0 z-50 h-full w-64 p-0 sm:max-w-sm translate-x-0 translate-y-0 top-0 rounded-none border-r"
                        >
                            <SidebarContent onItemClick={() => setIsMobileMenuOpen(false)} />
                        </DialogContent>
                    </Dialog>

                    {/* Search */}
                    <div className="flex-1 max-w-md hidden sm:block">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="search"
                                placeholder="Search projects..."
                                className="pl-10 bg-gray-50 h-9"
                            />
                        </div>
                    </div>
                </div>

                {/* Mobile Search Icon (only visible on small screens when search is hidden) */}
                <Button variant="ghost" size="icon" className="sm:hidden text-gray-400">
                    <Search className="h-5 w-5" />
                </Button>

                {/* Actions */}
                <div className="flex items-center space-x-2 md:space-x-4">
                    <NotificationsPopover />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center space-x-2 p-1 md:p-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage
                                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(avatarLetter)}`}
                                        alt={avatarLetter}
                                    />
                                    <AvatarFallback className="text-sm font-semibold">
                                        {avatarLetter?.[0]?.toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-left hidden md:block">
                                    <p className="text-sm font-medium leading-none">{displayName}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {displayRole}
                                    </p>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem asChild>
                                <Link href="/settings">
                                    <User className="mr-2 h-4 w-4" />
                                    Profile
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/settings">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Settings
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logout} className="text-red-600 font-medium">
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
