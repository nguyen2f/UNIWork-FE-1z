# 🚀 UNIWork Frontend - Nền Tảng Quản Lý Dự Án Doanh Nghiệp (Enterprise Project Management UI)

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![CI Status](https://img.shields.io/badge/CI-Passing-brightgreen?style=for-the-badge&logo=githubactions)](.github/workflows/ci.yml)

**UNIWork Frontend** (ProManage Enterprise) là giao diện người dùng hiện đại, được xây dựng trên nền tảng **Next.js 14 App Router** và **TypeScript**, cung cấp giải pháp quản lý dự án trực quan, thời gian thực và đạt chuẩn hiệu năng cao dành cho môi trường doanh nghiệp.

---

## ⚡ Điểm Nhấn Kỹ Thuật & Tối Ưu Hóa (Engineering Highlights)

1. **Triệt tiêu Waterfall Network (Zero Client Waterfall)**:
   - Tối ưu hóa luồng tải dữ liệu trang chi tiết dự án (`/projects/[id]`). Thay thế việc lặp tuần tự từng stage/task để fetch dữ liệu ($O(N+M)$ requests) bằng cơ chế truy vấn song song bất đồng bộ (`Promise.allSettled`), kết hợp gom nhóm dữ liệu ngay tại Client State.
   - Giảm thiểu số lượng HTTP request từ hơn 25 requests xuống chỉ còn **1 lần gọi song song (3 endpoints)**, giúp giảm thời gian Time-To-Interactive (TTI) đáng kể.

2. **Tái cấu trúc Kiến trúc Component (Clean Component Architecture)**:
   - Tách biệt hoàn toàn các "God Component" cồng kềnh (>1.000 dòng code) thành các sub-components độc lập, tuân thủ nguyên lý Single Responsibility Principle (SRP):
     - `ProjectDetailHero`: Quản lý header, trạng thái dự án, tiến độ tổng quan và các action thao tác.
     - `ProjectStageViews`: Xử lý hiển thị đa chế độ (Agile Sprint Cards, Waterfall Timeline Pipeline, Standard List).
     - `ProjectTaskIssueTable`: Quản lý danh sách công việc/sự cố, bộ lọc đa chiều (Status, Priority, Assignee) và tính năng xuất file CSV.

3. **Bảo mật & Điều hướng Tuyến (Route Protection & SSR-Safe Auth)**:
   - Tích hợp Next.js Edge `middleware.ts` kiểm tra trạng thái xác thực người dùng dựa trên cookie `auth_token` trước khi render trang.
   - Xử lý đồng bộ an toàn giữa `localStorage` và `document.cookie` với kiểm tra `typeof window !== "undefined"`, ngăn chặn hoàn toàn lỗi hydration mismatch và SSR crashes.
   - Tự động bắt mã lỗi `401 Unauthorized` tại Axios Interceptor để dọn dẹp phiên đăng nhập hết hạn và chuyển hướng người dùng an toàn.

4. **Type-Safety & Build Tuyệt Đối**:
   - Loại bỏ hoàn toàn cờ bỏ qua lỗi (`ignoreBuildErrors`, `ignoreDuringBuilds`).
   - 100% mã nguồn vượt qua kiểm tra tĩnh nghiêm ngặt của TypeScript (`npx tsc --noEmit` đạt 0 lỗi).
   - Build production Next.js thành công 22 routes tĩnh/động.

5. **Giao tiếp Thời Gian Thực (Real-time WebSocket/STOMP)**:
   - Kết nối hai chiều với Spring Boot WebSocket qua thư viện `@stomp/stompjs` và `sockjs-client`.
   - Cấu hình URL WebSocket động thông qua biến môi trường `NEXT_PUBLIC_WS_URL`.

6. **Tự Động Hóa CI/CD (GitHub Actions)**:
   - Tích hợp pipeline CI tự động kiểm tra cú pháp, Type-check và Build dự án trên mỗi pull request và push vào branch `develop`/`main`.

---

## ✨ Tính Năng Chính

- **📊 Bảng Điều Khiển (Dashboard):** Tổng quan tiến độ dự án, biểu đồ phân tích hiệu suất và công việc sắp đến hạn.
- **📂 Đa Chế Độ Xem Dự Án:**
  - **Cards View:** Hiển thị trực quan theo Sprints (Agile) hoặc Phases (Waterfall).
  - **Kanban Board:** Kéo thả và theo dõi trạng thái nhiệm vụ (To Do, In Progress, Reviewing, Done).
  - **Spreadsheet View:** Bảng tính inline editing tương tự Notion/Airtable giúp chỉnh sửa nhanh.
- **📑 Quản Lý Nhiệm Vụ & Sự Cố (Tasks & Issues):** Phân công thành viên, thiết lập deadline, gắn nhãn độ ưu tiên, đính kèm tài liệu và trao đổi bình luận.
- **👥 Quản Lý Thành Viên & Phân Quyền (RBAC):** Quản trị vai trò (Owner, Manager, Member) trong từng dự án.
- **📅 Lịch Làm Việc (Calendar):** Quản lý mốc sự kiện quan trọng và hạn chót dự án.
- **💬 Chat Trực Tiếp (Real-time Chat):** Kênh nhắn tin nội bộ tức thời theo thời gian thực.
- **📥 Xuất Dữ Liệu CSV:** Hỗ trợ xuất dữ liệu công việc ra file CSV chuẩn UTF-8 tương thích tốt với Microsoft Excel.

---

## 🛠️ Công Nghệ Sử Dụng

- **Framework:** Next.js 14.2 (App Router), React 18
- **Ngôn ngữ:** TypeScript 5
- **Styling:** Tailwind CSS, Radix UI Primitives, Lucide Icons
- **UI Components:** Shadcn/UI, Ant Design
- **Data Fetching:** Axios (kèm Interceptors & Cookie Sync)
- **Real-time:** StompJS, SockJS-Client
- **Charts:** Recharts
- **Form & Validation:** React Hook Form, Zod
- **Build & Package Manager:** pnpm, Node.js 18+

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Local

### 1. Điều Kiện Tiên Quyết
- Node.js 18.x trở lên
- Trình quản lý gói `pnpm` (khuyến nghị) hoặc `npm`

### 2. Thiết Lập Biến Môi Trường

Tạo file `.env.local` tại thư mục gốc dựa theo `.env.example`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=http://localhost:8080/ws
```

### 3. Cài Đặt Dependencies & Chạy Dev

```bash
# Cài đặt thư viện
pnpm install

# Kiểm tra TypeScript type-check
pnpm run type-check   # hoặc: npx tsc --noEmit

# Khởi chạy môi trường phát triển
pnpm run dev
```

Mở trình duyệt tại: `http://localhost:3000`

### 4. Build Production

```bash
pnpm run build
pnpm run start
```

---

## 📁 Cấu Trúc Thư Mục

```text
UNIWork-FE-1z/
├── app/                     # Next.js App Router (Pages, Layouts & Route Handlers)
│   ├── auth/                # Đăng nhập, đăng ký, đăng nhập admin
│   ├── dashboard/           # Bảng điều khiển chính
│   ├── projects/            # Danh sách & chi tiết dự án ([id])
│   ├── tasks/               # Quản lý task cá nhân & chi tiết task
│   ├── issues/              # Quản lý sự cố
│   ├── messages/            # Chat thời gian thực
│   └── calendar/            # Lịch làm việc
├── components/              # Reusable UI components
│   ├── layout/              # Sidebar, Header, Navigation
│   ├── project/             # ProjectHero, StageViews, TaskIssueTable, Kanban, Spreadsheet
│   ├── task/                # Create/Edit task dialogs, attachments
│   └── ui/                  # Shadcn & Radix primitive components
├── hooks/                   # Custom React hooks (useAuth, useSocket,...)
├── services/                # API client & domain services (project, task, issue,...)
├── types/                   # TypeScript interfaces & domain types
├── middleware.ts            # Route protection Edge middleware
└── public/                  # Static assets & images
```

---
*© 2026 UNIWork. Developed by Nguyen.*
