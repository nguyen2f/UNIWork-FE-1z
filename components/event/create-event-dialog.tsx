"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { createEvent } from "@/services/event.service"
import type { Event } from "@/types/event.types"
// import {Project} from "@/types";
import {getAllProjects} from "@/services/project.service";
import {message} from "antd";

interface CreateEventDialogProps {
    selectedDate?: Date
    onEventCreated?: (event: Event) => void
}

interface Project {
    projectId: number
    name: string
}

export function CreateEventDialog({
                                      selectedDate,
                                      onEventCreated,
                                  }: CreateEventDialogProps) {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        title: "",
        projectId: "",
        date: "",
        time: "",
        duration: "",
        type: "meeting",
        location: "",
        priority: "2", // MEDIUM
    })

    // sync selectedDate
    useEffect(() => {
        if (selectedDate) {
            setFormData((prev) => ({
                ...prev,
                date: formatDateLocal(selectedDate),
            }))
        }
    }, [selectedDate])


    const formatDateLocal = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        return `${year}-${month}-${day}`
    }


    const handleChange = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const time = formData.time ? formData.time : "00:00"
            const dateTime = `${formData.date} ${time}:00`

            const payload = {
                title: formData.title,
                projectId: Number(formData.projectId),
                date: dateTime,
                duration: formData.duration,
                type: formData.type,
                location: formData.location,
                priority: Number(formData.priority),
                createdBy: Number(window.localStorage.getItem("userId"))
            }

            const res = await createEvent(payload)

            console.log(res)
            // onEventCreated?.(res.title)

            toast.success("Event created successfully")
            setOpen(false)

            setFormData({
                title: "",
                projectId: "",
                date: "",
                time: "",
                duration: "",
                type: "meeting",
                location: "",
                priority: "2",
            })
        } catch (err) {
            console.error(err)
            toast.error("Failed to create event")
        } finally {
            setIsSubmitting(false)
        }
    }

    const [allProjects, setAllProjects] = useState<Project[]>([]);
    useEffect(() => {fetchAllProject();}, []);
    const fetchAllProject = async () => {
        try {
            const response = await getAllProjects();
            setAllProjects((response as any).data || response || []);
        } catch (error) {
            message.error("Failed to fetch projects");
        }
    };

    useEffect(() => {
        if (allProjects.length === 1) {
            handleChange("projectId", String(allProjects[0].projectId))
        }
    }, [allProjects])


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button onClick={() => setOpen(true)}>Create Event</Button>

            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <Input
                        placeholder="Event title"
                        value={formData.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        required
                    />

                    {/* Project */}
                    <Select
                        value={formData.projectId}
                        onValueChange={(value) => handleChange("projectId", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select project" />
                        </SelectTrigger>

                        <SelectContent>
                            {allProjects
                                .filter((project) => project !== null)
                                .map((project) => (
                                    <SelectItem
                                        key={project.projectId}
                                        value={String(project.projectId)}
                                    >
                                        {project.name}
                                    </SelectItem>
                                ))}
                        </SelectContent>

                    </Select>


                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            type="date"
                            value={formData.date}
                            onChange={(e) => handleChange("date", e.target.value)}
                            required
                        />
                        <Input
                            type="time"
                            value={formData.time}
                            onChange={(e) => handleChange("time", e.target.value)}
                        />
                    </div>

                    {/* Duration */}
                    <Input
                        placeholder="Duration (e.g. 2h)"
                        value={formData.duration}
                        onChange={(e) => handleChange("duration", e.target.value)}
                    />

                    {/* Type */}
                    <Select
                        value={formData.type}
                        onValueChange={(v) => handleChange("type", v)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Event type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="meeting">Meeting</SelectItem>
                            <SelectItem value="review">Review</SelectItem>
                            <SelectItem value="workshop">Workshop</SelectItem>
                            <SelectItem value="milestone">Milestone</SelectItem>
                            <SelectItem value="deadline">Deadline</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Priority */}
                    <Select
                        value={formData.priority}
                        onValueChange={(v) => handleChange("priority", v)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">Critical</SelectItem>
                            <SelectItem value="2">High</SelectItem>
                            <SelectItem value="3">Medium</SelectItem>
                            <SelectItem value="4">Low</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Location */}
                    <Input
                        placeholder="Location"
                        value={formData.location}
                        onChange={(e) => handleChange("location", e.target.value)}
                    />

                    {/* Submit */}
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create Event"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
