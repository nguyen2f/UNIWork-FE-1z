"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "../../components/sidebar"
import { Header } from "../../components/header"
import { CreateEventDialog } from "../../components/create-event-dialog"
import { EventDetailDialog } from "../../components/event-detail-dialog"
import { getAllEvents } from "@/app/services/eventService"
import type { Event } from "@/app/services/eventService"

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showEventDetail, setShowEventDetail] = useState(false)
  const [view, setView] = useState<"month" | "week" | "day">("month")
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true)
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

        const beginTimestamp = monthStart.getTime()
        const endTimestamp = monthEnd.getTime()

        const res = await getAllEvents(beginTimestamp, endTimestamp, 0, 100)
        setEvents(res.data.content || res.data)
        if (res.data.totalPages) {
          setTotalPages(res.data.totalPages)
        }
      } catch (err) {
        console.error("Load events error:", err)
      } finally {
        setLoading(false)
      }
    }
    loadEvents()
  }, [currentDate])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek }
  }

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return events.filter((event) => event.date === dateStr)
  }

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(clickedDate)

    const dayEvents = getEventsForDate(clickedDate)
    if (dayEvents.length === 1) {
      setSelectedEvent(dayEvents[0])
      setShowEventDetail(true)
    }
  }

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    setShowEventDetail(true)
  }

  const handleEventCreated = (newEvent: Event) => {
    setEvents([...events, newEvent])
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate)
  const calendarDays = []

  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

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

  const today = new Date()
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Project Calendar</h1>
                <p className="text-gray-600 mt-2">Schedule and track project milestones, meetings, and deadlines</p>
              </div>
              <CreateEventDialog selectedDate={selectedDate || undefined} onEventCreated={handleEventCreated} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <h2 className="text-xl font-semibold">
                        {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                      </h2>
                      <Button variant="outline" size="icon" onClick={handleNextMonth}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant={view === "month" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setView("month")}
                      >
                        Month
                      </Button>
                      <Button
                        variant={view === "week" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setView("week")}
                      >
                        Week
                      </Button>
                      <Button variant={view === "day" ? "default" : "outline"} size="sm" onClick={() => setView("day")}>
                        Day
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loading && <div className="text-center text-sm text-gray-500 mb-4">Loading events...</div>}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {DAYS.map((day) => (
                        <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((day, index) => {
                        if (day === null) {
                          return <div key={`empty-${index}`} className="h-24 bg-gray-50" />
                        }

                        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                        const dayEvents = getEventsForDate(date)
                        const isTodayDate = isToday(day)

                        return (
                          <div
                            key={day}
                            className={`h-24 border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer relative transition-colors ${
                              isTodayDate ? "border-blue-500 border-2" : ""
                            }`}
                            onClick={() => handleDateClick(day)}
                          >
                            <div className="p-2 h-full flex flex-col">
                              <span
                                className={`text-sm font-medium ${isTodayDate ? "text-blue-600" : "text-gray-900"}`}
                              >
                                {day}
                              </span>
                              <div className="flex-1 mt-1 overflow-hidden">
                                {dayEvents.slice(0, 2).map((event) => (
                                  <div
                                    key={event.eventId}
                                    className="text-xs truncate mb-1 px-1 py-0.5 rounded"
                                    style={{
                                      backgroundColor:
                                        event.type === "meeting"
                                          ? "#DBEAFE"
                                          : event.type === "review"
                                            ? "#F3E8FF"
                                            : event.type === "workshop"
                                              ? "#D1FAE5"
                                              : event.type === "milestone"
                                                ? "#FED7AA"
                                                : "#FEE2E2",
                                      color:
                                        event.type === "meeting"
                                          ? "#1E40AF"
                                          : event.type === "review"
                                            ? "#6B21A8"
                                            : event.type === "workshop"
                                              ? "#065F46"
                                              : event.type === "milestone"
                                                ? "#9A3412"
                                                : "#991B1B",
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleEventClick(event)
                                    }}
                                  >
                                    <div className="flex items-center gap-1">
                                      <div className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(event.priority)}`} />
                                      <span className="truncate">{event.title}</span>
                                    </div>
                                  </div>
                                ))}
                                {dayEvents.length > 2 && (
                                  <div className="text-xs text-gray-500 px-1">+{dayEvents.length - 2} more</div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-base">Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {events
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .slice(0, 5)
                        .map((event) => (
                          <div
                            key={event.eventId}
                            className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow cursor-pointer"
                            onClick={() => handleEventClick(event)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-sm line-clamp-1">{event.title}</h4>
                              <div className={`w-2.5 h-2.5 rounded-full ${getPriorityColor(event.priority)}`} />
                            </div>
                            <p className="text-xs text-gray-600 mb-2 line-clamp-1">Project {event.projectId}</p>
                            <div className="space-y-1">
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="h-3 w-3 mr-1" />
                                {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <MapPin className="h-3 w-3 mr-1" />
                                {event.location}
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
                  </CardContent>
                </Card>

                {selectedDate && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="text-base">
                        {selectedDate.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {getEventsForDate(selectedDate).length === 0 ? (
                          <p className="text-sm text-gray-500 text-center py-4">No events scheduled</p>
                        ) : (
                          getEventsForDate(selectedDate).map((event) => (
                            <div
                              key={event.eventId}
                              className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow cursor-pointer"
                              onClick={() => handleEventClick(event)}
                            >
                              <div className="flex items-start justify-between mb-1">
                                <h4 className="font-medium text-sm">{event.title}</h4>
                                <Badge variant="outline" className={`text-xs ${getEventTypeColor(event.type)}`}>
                                  {event.type}
                                </Badge>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <EventDetailDialog event={selectedEvent} open={showEventDetail} onOpenChange={setShowEventDetail} />
    </div>
  )
}
