"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Building2, ArrowRight } from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="h-20 w-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            ProManage Enterprise
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12">
            Hệ thống quản lý dự án toàn diện cho doanh nghiệp
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6" onClick={() => router.push("/auth/login")}>
              Đăng nhập
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 bg-transparent"
              onClick={() => router.push("/auth/signup")}
            >
              Đăng ký ngay
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-md">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Quản lý dự án</h3>
              <p className="text-muted-foreground">Theo dõi tiến độ và quản lý tài nguyên hiệu quả</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">Cộng tác nhóm</h3>
              <p className="text-muted-foreground">Làm việc nhóm mượt mà với các công cụ hiện đại</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Báo cáo chi tiết</h3>
              <p className="text-muted-foreground">Phân tích dữ liệu và ra quyết định thông minh</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
