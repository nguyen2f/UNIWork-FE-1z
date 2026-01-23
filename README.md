# UNIWork - Nền Tảng Quản Lý Dự Án Doanh Nghiệp

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Ant Design](https://img.shields.io/badge/Ant_Design-latest-0170FE?style=for-the-badge&logo=ant-design)](https://ant.design/)

**UNIWork** (ProManage Enterprise) là một giải pháp quản lý dự án hiện đại, được thiết kế để tối ưu hóa quy trình làm việc, tăng cường sự cộng tác và theo dõi tiến độ dự án một cách hiệu quả.

## 🚀 Tính Năng Chính

- **Bảng Điều Khiển (Dashboard):** Tổng quan về tiến độ dự án, các nhiệm vụ sắp tới và thống kê hiệu suất.
- **Quản Lý Dự Án:** Tạo, chỉnh sửa và theo dõi các dự án với các trạng thái và ưu tiên khác nhau.
- **Quản Lý Nhiệm Vụ (Task Management):** Phân công công việc, thiết lập thời hạn, đính kèm tệp tin và bình luận trực tiếp trên từng nhiệm vụ.
- **Quản Lý Nhóm (Team Management):** Quản lý thành viên, vai trò và phân quyền trong hệ thống.
- **Lịch Giao Việc (Calendar):** Theo dõi các sự kiện, hạn chót nhiệm vụ một cách trực quan.
- **Hệ Thống Tin Nhắn (Real-time Messaging):** Trao đổi trực tiếp giữa các thành viên qua WebSockets.
- **Báo Cáo & Phân Tích:** Biểu đồ thống kê hiệu suất dự án và nhiệm vụ qua Recharts.
- **Thông Báo:** Nhận thông báo thời gian thực về các cập nhật quan trọng.

## 🛠️ Công Nghệ Sử Dụng

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript.
- **Styling:** Tailwind CSS, Ant Design, Radix UI.
- **State Management & Data Fetching:** Axios, React Hooks.
- **Authentication:** NextAuth.js.
- **Real-time:** StompJS, SockJS (WebSocket).
- **Icons & Visualization:** Lucide React, Recharts.
- **UI Components:** Shadcn/UI.

## 💻 Cài Đặt và Chạy Dự Án

### Điều kiện tiên quyết
- Node.js 18.x trở lên.
- Đã cài đặt `npm` hoặc `pnpm`.

### Các bước thực hiện

1. **Clone repository:**
   ```bash
   git clone <repository_url>
   cd UNIWork-FE-1z
   ```

2. **Cài đặt dependencies:**
   ```bash
   npm install
   # hoặc nếu dùng pnpm
   pnpm install
   ```

3. **Cấu hình biến môi trường:**
   Tạo file `.env.local` ở thư mục gốc và cấu hình các biến sau:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://your-api-url:port
   ```

4. **Chạy môi trường phát triển:**
   ```bash
   npm run dev
   ```
   Ứng dụng sẽ chạy tại: [http://localhost:3000](http://localhost:3000)

## 📁 Cấu Trúc Thư Mục

- `app/`: Chứa các trang (pages), layout và các route API (Next.js App Router).
- `components/`: Các thành phần giao diện dùng chung (UI components).
- `services/`: Các lớp xử lý gọi API và logic nghiệp vụ.
- `hooks/`: Các custom React hooks.
- `lib/`: Các thư viện và cấu hình dùng chung (utils, axios instance...).
- `types/`: Định nghĩa các kiểu dữ liệu TypeScript.
- `public/`: Chứa các tài nguyên tĩnh như hình ảnh, icons.

## 📜 Các Lệnh Scripts

- `npm run dev`: Chạy dự án ở chế độ phát triển.
- `npm run build`: Xây dựng phiên bản production cho dự án.
- `npm run start`: Chạy phiên bản production sau khi build.
- `npm run lint`: Kiểm tra lỗi coding convention với ESLint.

---

Thiết kế bởi **Nguyễn Phúc Nguyên** (v0.dev/nguyen-phuc-nguyen)
