import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Vui lòng điền đầy đủ thông tin" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Mật khẩu phải có ít nhất 6 ký tự" }, { status: 400 })
    }

    // Check if user already exists (trong thực tế sẽ check database)
    // Giả lập check email đã tồn tại
    if (email === "admin@company.com" || email === "manager@company.com") {
      return NextResponse.json({ message: "Email đã được sử dụng" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user (trong thực tế sẽ lưu vào database)
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      role: role || "member",
      avatar: name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase(),
      createdAt: new Date().toISOString(),
    }

    // Return success (không trả về password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        message: "Tài khoản đã được tạo thành công",
        user: userWithoutPassword,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Đã xảy ra lỗi server" }, { status: 500 })
  }
}
