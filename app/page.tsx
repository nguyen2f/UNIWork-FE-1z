"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Building2, ArrowRight, CheckCircle, Users, BarChart3, Calendar } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">ProManage</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Đăng nhập</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Đăng ký</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900">
              Quản lý dự án
              <br />
              <span className="text-primary">chuyên nghiệp</span>
            </h1>
            <p className="text-xl text-gray-600">
              Nền tảng quản lý dự án và cộng tác toàn diện cho doanh nghiệp hiện đại
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="gap-2">
                  Bắt đầu ngay <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline">
                  Đăng nhập
                </Button>
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <CheckCircle className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Quản lý Task</h3>
                <p className="text-sm text-gray-600">Theo dõi tiến độ công việc dễ dàng</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Users className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Cộng tác nhóm</h3>
                <p className="text-sm text-gray-600">Làm việc nhóm hiệu quả hơn</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <BarChart3 className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Báo cáo chi tiết</h3>
                <p className="text-sm text-gray-600">Phân tích dữ liệu thời gian thực</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Calendar className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Lịch trình</h3>
                <p className="text-sm text-gray-600">Quản lý deadline hiệu quả</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
