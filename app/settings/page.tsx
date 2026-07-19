"use client"

import { useState, useEffect } from "react"
import { User, Bell, Shield, Palette, Globe, Save, Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { getUserProfile, updateUserProfile } from "@/services/user.service"
import { message } from "antd"

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@acmecorp.com",
    title: "Project Director",
    department: "Management",
    phone: "+1 (555) 123-4567",
    bio: "Experienced project director with 10+ years in enterprise software implementation and digital transformation initiatives.",
    timezone: "America/New_York",
    language: "en",
    address: "",
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    projectUpdates: true,
    taskAssignments: true,
    budgetAlerts: true,
    weeklyReports: false,
    systemMaintenance: true,
  })

  const [preferences, setPreferences] = useState({
    theme: "light",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    currency: "USD",
    defaultView: "dashboard",
    itemsPerPage: "25",
  })

  const [loadingProfile, setLoadingProfile] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false

    const fetchProfile = async () => {
      const userId = localStorage.getItem("userId")
      if (!userId) return

      try {
        setLoadingProfile(true)
        setProfileError(null)
        const res = await getUserProfile(userId)
        // api(...) interceptor returns response?.data by default, so res should be the payload directly
        // server returns { success, code, message, data: { ... } }, so extract inner `data`
        const data = (res && res.data) ? res.data : res
        setProfile((prev) => ({
          ...prev,
          name: data.name ?? prev.name,
          email: data.email ?? prev.email,
          phone: data.phone ?? prev.phone,
          bio: data.bio ?? prev.bio,
          address: data.address ?? prev.address,
          department: data.department ?? prev.department,
        }))
      } catch (err: any) {
        console.error("Failed to fetch profile", err)
        setProfileError(err?.message || "Failed to load profile")
      } finally {
        if (!cancelled) setLoadingProfile(false)
      }
    }

    fetchProfile()

    return () => {
      cancelled = true
    }
  }, [])

  const handleSave = async () => {
    const userId = localStorage.getItem("userId")
    if (!userId) {
      message.error("User not found. Please login again.")
      return
    }

    const body = {
      name: profile.name,
      phone: profile.phone,
      email: profile.email,
      bio: profile.bio,
      address: profile.address,
      department: profile.department,
    }

    try {
      setSaving(true)
      await updateUserProfile(userId, body)
      message.success("Profile updated successfully")
    } catch (err: any) {
      console.error("Failed to update profile", err)
      message.error(err?.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

    const displayName = profile?.name
    const avatarLetter = displayName.charAt(0).toUpperCase()

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
            </div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>Update your personal information and profile details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {profileError && (
                      <div className="text-sm text-red-600">{profileError}</div>
                    )}

                    {/* Profile Picture */}
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-8 w-8">
                            <AvatarImage
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(avatarLetter)}`}
                                alt={avatarLetter}
                            />
                            <AvatarFallback className="text-lg">
                                {avatarLetter?.[0]?.toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                      <div>
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Change Photo
                        </Button>
                        <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                      </div>
                    </div>

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title">Job Title</Label>
                        <Input
                          id="title"
                          value={profile.title}
                          onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={profile.department}
                          onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select value={profile.timezone} onValueChange={(value) => setProfile({ ...profile, timezone: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="America/New_York">Eastern Time</SelectItem>
                            <SelectItem value="America/Chicago">Central Time</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                      <div className="space-y-2">
                          <Label htmlFor="bio">Address</Label>
                          <Textarea
                              id="bio"
                              value={profile.address}
                              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                              rows={4}
                          />
                      </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        rows={5}
                      />
                    </div>

                    <Button disabled={loadingProfile || saving} onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Saving..." : loadingProfile ? "Loading..." : "Save Changes"}
                    </Button>
                  </CardContent>
                </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
