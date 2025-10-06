"use client"

import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, User } from "lucide-react"

export default function Dashboard() {
  const { user, token, logout } = useAuth()

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
            <CardTitle>Thông tin người dùng</CardTitle>
            <CardDescription>Thông tin tài khoản đang đăng nhập</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <p className="text-xs text-gray-400 mt-1">User ID: {user?.userId}</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-gray-700 mb-2">Token đang sử dụng:</p>
              <div className="bg-gray-100 p-3 rounded-md">
                <code className="text-xs text-gray-600 break-all">{token?.substring(0, 50)}...</code>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chào mừng đến với hệ thống quản lý dự án</CardTitle>
            <CardDescription>Hệ thống đã sẵn sàng kết nối với Spring Boot backend của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Tất cả API calls sẽ tự động include headers:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-600">
              <li>Authorization: Bearer {"{token}"}</li>
              <li>userId: {"{userId}"}</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
