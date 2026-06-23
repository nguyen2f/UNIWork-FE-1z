import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Please fill in all required fields" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Check if user already exists (trong thực tế sẽ check database)
    // Giả lập check email đã tồn tại
    if (email === "admin@company.com" || email === "manager@company.com") {
      return NextResponse.json({ message: "Email is already in use" }, { status: 400 })
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
        .map((n: string) => n[0])
        .join("")
        .toUpperCase(),
      createdAt: new Date().toISOString(),
    }

    // Return success (không trả về password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        message: "Account has been created successfully",
        user: userWithoutPassword,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "An internal server error occurred" }, { status: 500 })
  }
}
