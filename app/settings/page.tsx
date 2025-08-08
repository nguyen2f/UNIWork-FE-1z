"use client"

import { useState } from "react"
import { User, Bell, Shield, Palette, Globe, Save, Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "../../components/sidebar"
import { Header } from "../../components/header"

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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>Update your personal information and profile details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-20 w-20">
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">JD</AvatarFallback>
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
                        <Select value={profile.department} onValueChange={(value) => setProfile({ ...profile, department: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Management">Management</SelectItem>
                            <SelectItem value="Engineering">Engineering</SelectItem>
                            <SelectItem value="Design">Design</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Sales">Sales</SelectItem>
                          </SelectContent>
                        </Select>
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
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        rows={4}
                      />
                    </div>

                    <Button>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="h-5 w-5 mr-2" />
                      Notification Preferences
                    </CardTitle>
                    <CardDescription>Choose how you want to be notified about updates and activities</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-sm text-gray-600">Receive notifications via email</p>
                        </div>
                        <Switch
                          checked={notifications.emailNotifications}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Push Notifications</h4>
                          <p className="text-sm text-gray-600">Receive push notifications in your browser</p>
                        </div>
                        <Switch
                          checked={notifications.pushNotifications}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Project Updates</h4>
                          <p className="text-sm text-gray-600">Get notified when projects are updated</p>
                        </div>
                        <Switch
                          checked={notifications.projectUpdates}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, projectUpdates: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Task Assignments</h4>
                          <p className="text-sm text-gray-600">Get notified when tasks are assigned to you</p>
                        </div>
                        <Switch
                          checked={notifications.taskAssignments}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, taskAssignments: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Budget Alerts</h4>
                          <p className="text-sm text-gray-600">Get notified about budget thresholds and overruns</p>
                        </div>
                        <Switch
                          checked={notifications.budgetAlerts}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, budgetAlerts: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Weekly Reports</h4>
                          <p className="text-sm text-gray-600">Receive weekly summary reports</p>
                        </div>
                        <Switch
                          checked={notifications.weeklyReports}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">System Maintenance</h4>
                          <p className="text-sm text-gray-600">Get notified about system maintenance and updates</p>
                        </div>
                        <Switch
                          checked={notifications.systemMaintenance}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, systemMaintenance: checked })}
                        />
                      </div>
                    </div>

                    <Button>
                      <Save className="h-4 w-4 mr-2" />
                      Save Preferences
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        Security Settings
                      </CardTitle>
                      <CardDescription>Manage your account security and authentication</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input id="current-password" type="password" className="mt-2" />
                        </div>
                        <div>
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" type="password" className="mt-2" />
                        </div>
                        <div>
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input id="confirm-password" type="password" className="mt-2" />
                        </div>
                        <Button>Update Password</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Two-Factor Authentication</CardTitle>
                      <CardDescription>Add an extra layer of security to your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-600">Secure your account with 2FA using an authenticator app</p>
                        </div>
                        <Button variant="outline">Enable 2FA</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Active Sessions</CardTitle>
                      <CardDescription>Manage your active login sessions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div>
                            <h4 className="font-medium">Current Session</h4>
                            <p className="text-sm text-gray-600">Chrome on Windows • 192.168.1.100</p>
                            <p className="text-xs text-gray-500">Last active: Now</p>
                          </div>
                          <Button variant="outline" size="sm" disabled>Current</Button>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div>
                            <h4 className="font-medium">Mobile Session</h4>
                            <p className="text-sm text-gray-600">Safari on iPhone • 192.168.1.101</p>
                            <p className="text-xs text-gray-500">Last active: 2 hours ago</p>
                          </div>
                          <Button variant="outline" size="sm">Revoke</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="preferences" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Palette className="h-5 w-5 mr-2" />
                      Display & Preferences
                    </CardTitle>
                    <CardDescription>Customize your interface and display preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="theme">Theme</Label>
                        <Select value={preferences.theme} onValueChange={(value) => setPreferences({ ...preferences, theme: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select value={profile.language} onValueChange={(value) => setProfile({ ...profile, language: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="date-format">Date Format</Label>
                        <Select value={preferences.dateFormat} onValueChange={(value) => setPreferences({ ...preferences, dateFormat: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="time-format">Time Format</Label>
                        <Select value={preferences.timeFormat} onValueChange={(value) => setPreferences({ ...preferences, timeFormat: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12h">12 Hour</SelectItem>
                            <SelectItem value="24h">24 Hour</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select value={preferences.currency} onValueChange={(value) => setPreferences({ ...preferences, currency: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="GBP">GBP (£)</SelectItem>
                            <SelectItem value="JPY">JPY (¥)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="items-per-page">Items Per Page</Label>
                        <Select value={preferences.itemsPerPage} onValueChange={(value) => setPreferences({ ...preferences, itemsPerPage: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button>
                      <Save className="h-4 w-4 mr-2" />
                      Save Preferences
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="integrations" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Globe className="h-5 w-5 mr-2" />
                      Integrations
                    </CardTitle>
                    <CardDescription>Connect with external tools and services</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-sm">SF</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Salesforce</h4>
                            <p className="text-sm text-gray-600">Sync project data with Salesforce CRM</p>
                          </div>
                        </div>
                        <Button variant="outline">Connect</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-green-600 font-bold text-sm">SL</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Slack</h4>
                            <p className="text-sm text-gray-600">Get project notifications in Slack</p>
                          </div>
                        </div>
                        <Button>Connected</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-purple-600 font-bold text-sm">JI</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Jira</h4>
                            <p className="text-sm text-gray-600">Sync tasks and issues with Jira</p>
                          </div>
                        </div>
                        <Button variant="outline">Connect</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <span className="text-orange-600 font-bold text-sm">GD</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Google Drive</h4>
                            <p className="text-sm text-gray-600">Store and share project documents</p>
                          </div>
                        </div>
                        <Button>Connected</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
