Dự Án API Xác Thực và Quản Lý Người Dùng
API cho phép người dùng thực hiện các thao tác như đăng ký, đăng nhập, xác thực email, thay đổi mật khẩu và đăng xuất.

Table of Contents
Cài Đặt

Cấu Trúc API

Đăng Ký

Xác Thực Email

Đăng Nhập

Quên Mật Khẩu

Đặt Lại Mật Khẩu

Thay Đổi Mật Khẩu

Đăng Xuất

Cấu Hình

Các Tệp Quan Trọng

Cài Đặt
1. Cài Đặt Dự Án
Để cài đặt dự án, bạn cần clone repository và cài đặt các dependencies.

git clone https://github.com/your-repo/project.git
cd project
npm install

2. Cấu Hình Môi Trường
Tạo tệp .env trong thư mục gốc của dự án và điền vào các giá trị sau:

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

3. Chạy Dự Án
Chạy server bằng lệnh:

npm run dev


-- Phân quyền bằng Hasrole['admin']... Xác thực Verify 
-- 
