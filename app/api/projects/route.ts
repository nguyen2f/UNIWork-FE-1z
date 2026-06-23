import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session: any = null // await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Trong thực tế sẽ lấy từ database
    const projects = [
      {
        id: "1",
        name: "Website Redesign",
        description: "Redesign company website with modern UI/UX",
        status: "active",
        priority: "high",
        startDate: "2024-02-01",
        endDate: "2024-04-30",
        budget: 50000,
        progress: 65,
        createdBy: session.user.id,
        createdAt: "2024-02-01T00:00:00Z",
        updatedAt: "2024-02-15T00:00:00Z",
      },
    ]

    return NextResponse.json({ projects })
  } catch (error) {
    console.error("Get projects error:", error)
    return NextResponse.json({ message: "An internal server error occurred" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session: any = null // await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { name, description, status, priority, budget, startDate, endDate } = await request.json()

    // Validate input
    if (!name || !description) {
      return NextResponse.json({ message: "Please fill in all required fields" }, { status: 400 })
    }

    // Create project (trong thực tế sẽ lưu vào database)
    const project = {
      id: Date.now().toString(),
      name,
      description,
      status: status || "planning",
      priority: priority || "medium",
      budget: budget || 0,
      startDate,
      endDate,
      progress: 0,
      createdBy: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(
      {
        message: "Project has been created successfully",
        project,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create project error:", error)
    return NextResponse.json({ message: "An internal server error occurred" }, { status: 500 })
  }
}
