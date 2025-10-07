"use client"

import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, User, Mail, Key } from "lucide-react"

export default function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={logout} variant="outline">
            <LogOut size={18} className="mr-2" />
            Đăng xuất
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin người dùng</CardTitle>
            <CardDescription>Thông tin tài khoản của bạn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="text-muted-foreground" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Họ và tên</p>
                <p className="font-medium">{user?.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="text-muted-foreground" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Key className="text-muted-foreground" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">User ID</p>
                <p className="font-mono text-sm">{user?.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin kết nối</CardTitle>
            <CardDescription>Token đang sử dụng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm text-muted-foreground mb-2">Token:</p>
              <p className="font-mono text-xs break-all">
                {typeof window !== "undefined" && localStorage.getItem("token")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
