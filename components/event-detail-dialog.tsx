"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Calendar, Edit, Trash2 } from "lucide-react"

import type { Event } from "@/app/services/eventService"

interface EventDetailDialogProps {
    event: Event | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

// ---- helpers ----
const parseEventDate = (dateStr: string) => {
    // "YYYY-MM-DD HH:mm:ss" -> Date
    return new Date(dateStr.replace(" ", "T"))
}

export function EventDetailDialog({ event, open, onOpenChange }: EventDetailDialogProps) {
    if (!event) return null

    const eventDate = parseEventDate(event.date)

    const getEventTypeColor = (type: string) => {
        switch (type?.toLowerCase()) {
            case "meeting":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "review":
                return "bg-purple-100 text-purple-800 border-purple-200"
            case "workshop":
                return "bg-green-100 text-green-800 border-green-200"
            case "milestone":
                return "bg-orange-100 text-orange-800 border-orange-200"
            case "deadline":
                return "bg-red-100 text-red-800 border-red-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "CRITICAL":
                return "bg-red-500"
            case "HIGH":
                return "bg-orange-500"
            case "MEDIUM":
                return "bg-yellow-500"
            case "LOW":
                return "bg-green-500"
            default:
                return "bg-gray-500"
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <DialogTitle className="text-2xl">{event.title}</DialogTitle>
                            <DialogDescription className="mt-2 text-base">
                                Project ID: {event.projectId}
                            </DialogDescription>
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(event.priority)}`} />
                            <Badge variant="outline" className={getEventTypeColor(event.type)}>
                                {event.type}
                            </Badge>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Event Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Date */}
                        <div className="flex items-center space-x-3 text-gray-700">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Date</p>
                                <p className="font-medium">
                                    {eventDate.toLocaleDateString("en-US", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Time */}
                        <div className="flex items-center space-x-3 text-gray-700">
                            <Clock className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Time</p>
                                <p className="font-medium">
                                    {eventDate.toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center space-x-3 text-gray-700">
                            <MapPin className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Location</p>
                                <p className="font-medium">{event.location || "—"}</p>
                            </div>
                        </div>

                        {/* Priority */}
                        <div className="flex items-center space-x-3 text-gray-700">
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(event.priority)}`} />
                            <div>
                                <p className="text-sm text-gray-500">Priority</p>
                                <p className="font-medium">{event.priority}</p>
                            </div>
                        </div>
                    </div>

                    {/*/!* Description *!/*/}
                    {/*{event.description && (*/}
                    {/*    <div>*/}
                    {/*        <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>*/}
                    {/*        <p className="text-sm text-gray-600 whitespace-pre-wrap">*/}
                    {/*            {event.description}*/}
                    {/*        </p>*/}
                    {/*    </div>*/}
                    {/*)}*/}

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2 pt-4 border-t">
                        <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit Event
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete Event
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
