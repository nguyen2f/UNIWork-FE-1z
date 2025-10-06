"use client"

import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, User } from "lucide-react"

export default function DashboardPage() {
  const { user, logout, token } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">ProManage</h1>
          <Button onClick={logout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Thông tin tài khoản
              </CardTitle>
              <CardDescription>Thông tin đăng nhập của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Tên</p>
                <p className="text-lg font-semibold">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-lg font-semibold">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">User ID</p>
                <p className="text-sm font-mono bg-gray-100 p-2 rounded">{user?.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Token</p>
                <p className="text-sm font-mono bg-gray-100 p-2 rounded break-all">{token?.substring(0, 50)}...</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chào mừng đến với ProManage!</CardTitle>
              <CardDescription>Hệ thống quản lý dự án chuyên nghiệp</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Bạn đã đăng nhập thành công. Token và userId của bạn sẽ được tự động thêm vào header của mọi API
                request.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
