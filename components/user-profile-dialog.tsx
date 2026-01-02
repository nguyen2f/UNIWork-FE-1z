"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, Briefcase } from "lucide-react"
import {useRouter} from "next/navigation";

interface UserProfile {
    userId: number
    name: string
    email: string
    phone?: string | null
    department?: string | null
}

interface UserProfileDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: UserProfile | null
}

export function UserProfileDialog({
                                      open,
                                      onOpenChange,
                                      user,
                                  }: UserProfileDialogProps) {
    const router = useRouter()

    if (!user) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Team Member Profile</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarFallback className="text-xl font-semibold">
                                {user.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            <h3 className="text-xl font-bold">{user.name}</h3>
                            {user.department && (
                                <Badge variant="secondary" className="mt-1">
                                    {user.department}
                                </Badge>
                            )}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push("/messages")}
                        >
                            Send Message
                        </Button>

                    </div>

                    <Separator />

                    {/* Contact */}
                    <div className="space-y-3">
                        <h4 className="font-semibold">Contact Information</h4>

                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{user.email}</span>
                            </div>

                            {user.phone && (
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{user.phone}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Department */}
                    {user.department && (
                        <div className="space-y-3">
                            <h4 className="font-semibold flex items-center gap-2">
                                <Briefcase className="h-4 w-4" />
                                Department
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                {user.department}
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
