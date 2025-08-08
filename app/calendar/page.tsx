"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus, CalendarIcon, Clock, Users, MapPin } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sidebar } from "../../components/sidebar"
import { Header } from "../../components/header"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')

  const events = [
    {
      id: 1,
      title: "CRM Migration Kickoff",
      project: "Enterprise CRM Migration",
      date: "2024-02-15",
      time: "09:00 AM",
      duration: "2 hours",
      type: "meeting",
      attendees: ["JD", "SM", "AL"],
      location: "Conference Room A",
      priority: "High",
    },
    {
      id: 2,
      title: "Security Audit Review",
      project: "SOC 2 Compliance",
      date: "2024-02-16",
      time: "02:00 PM",
      duration: "1 hour",
      type: "review",
      attendees: ["DK", "PL"],
      location: "Virtual",
      priority: "Critical",
    },
    {
      id: 3,
      title: "Digital Transformation Planning",
      project: "Digital Transformation Initiative",
      date: "2024-02-17",
      time: "10:00 AM",
      duration: "3 hours",
      type: "workshop",
      attendees: ["RW", "KL", "MJ", "TH"],
      location: "Innovation Lab",
      priority: "High",
    },
    {
      id: 4,
      title: "Budget Review Meeting",
      project: "Q1 Budget Planning",
      date: "2024-02-18",
      time: "11:00 AM",
      duration: "1.5 hours",
      type: "meeting",
      attendees: ["JD", "SM", "LS"],
      location: "Executive Boardroom",
      priority: "Medium",
    },
    {
      id: 5,
      title: "ERP Phase 2 Milestone",
      project: "Global ERP Rollout",
      date: "2024-02-20",
      time: "All Day",
      duration: "All Day",
      type: "milestone",
      attendees: ["MR", "JB", "KW"],
      location: "Multiple Locations",
      priority: "High",
    },
  ]

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "review":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "workshop":
        return "bg-green-100 text-green-800 border-green-200"
      case "milestone":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-500"
      case "High":
        return "bg-orange-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Project Calendar</h1>
                <p className="text-gray-600 mt-2">Schedule and track project milestones, meetings, and deadlines</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Event
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Calendar Controls */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button variant="outline" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <h2 className="text-xl font-semibold">February 2024</h2>
                      <Button variant="outline" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant={view === 'month' ? 'default' : 'outline'} size="sm" onClick={() => setView('month')}>
                        Month
                      </Button>
                      <Button variant={view === 'week' ? 'default' : 'outline'} size="sm" onClick={() => setView('week')}>
                        Week
                      </Button>
                      <Button variant={view === 'day' ? 'default' : 'outline'} size="sm" onClick={() => setView('day')}>
                        Day
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 mb-4">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                          {day}
                        </div>
                      ))}
                      {Array.from({ length: 35 }, (_, i) => {
                        const day = i - 2 // Adjust for month start
                        const isCurrentMonth = day > 0 && day <= 29
                        const hasEvent = isCurrentMonth && [15, 16, 17, 18, 20].includes(day)
                        
                        return (
                          <div
                            key={i}
                            className={`p-2 h-20 border border-gray-200 ${
                              isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                            } cursor-pointer relative`}
                          >
                            {isCurrentMonth && (
                              <>
                                <span className={`text-sm ${day === 15 ? 'font-bold text-blue-600' : 'text-gray-900'}`}>
                                  {day}
                                </span>
                                {hasEvent && (
                                  <div className="mt-1">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mb-1"></div>
                                    {day === 16 && <div className="w-2 h-2 bg-red-500 rounded-full mb-1"></div>}
                                    {day === 17 && <div className="w-2 h-2 bg-green-500 rounded-full mb-1"></div>}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Events */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      Upcoming Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {events.slice(0, 4).map((event) => (
                        <div key={event.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm">{event.title}</h4>
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(event.priority)}`}></div>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{event.project}</p>
                          <div className="space-y-1 text-xs text-gray-500">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {event.time} ({event.duration})
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {event.location}
                            </div>
                            <div className="flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              {event.attendees.length} attendees
                            </div>
                          </div>
                          <div className="mt-2">
                            <Badge variant="outline" className={`text-xs ${getEventTypeColor(event.type)}`}>
                              {event.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      View All Events
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Today's Schedule */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Schedule - February 15, 2024</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.filter(event => event.date === "2024-02-15").map((event) => (
                      <div key={event.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className={`w-4 h-4 rounded-full ${getPriorityColor(event.priority)}`}></div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-gray-600">{event.project}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          <div className="flex items-center mb-1">
                            <Clock className="h-4 w-4 mr-1" />
                            {event.time}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {event.location}
                          </div>
                        </div>
                        <div className="flex -space-x-2">
                          {event.attendees.map((attendee, idx) => (
                            <Avatar key={idx} className="h-8 w-8 border-2 border-white">
                              <AvatarFallback className="text-xs bg-blue-100 text-blue-700">{attendee}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <Badge variant="outline" className={getEventTypeColor(event.type)}>
                          {event.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
