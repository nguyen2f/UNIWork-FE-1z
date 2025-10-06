"use client"

import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { LogOut, User, Key } from "lucide-react"

export default function DashboardPage() {
  const { user, token, userId, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={logout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Đăng xuất
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin tài khoản</CardTitle>
            <CardDescription>Thông tin chi tiết về tài khoản của bạn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Tên</p>
                <p className="font-medium">{user?.name || "Đang tải..."}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user?.email || "Đang tải..."}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Key className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">User ID</p>
                <p className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{userId}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Key className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Access Token</p>
                <p className="font-mono text-xs bg-gray-100 px-2 py-1 rounded break-all">
                  {token?.substring(0, 50)}...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chào mừng đến với hệ thống quản lý dự án</CardTitle>
            <CardDescription>Hệ thống đang được kết nối với Spring Boot backend</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Token và userId được tự động thêm vào header cho mọi API request.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
