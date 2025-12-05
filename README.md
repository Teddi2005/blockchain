🌐 Blockchain System Fullstack Project

Một hệ thống Blockchain toàn diện (Fullstack) mô phỏng quy trình giao dịch tiền tệ kỹ thuật số, bao gồm Core Blockchain, API Server và Dashboard quản lý.

📖 Giới thiệu

Dự án này được thiết kế theo kiến trúc Microservices đơn giản, tách biệt hoàn toàn giữa lớp xử lý Blockchain (Core) và lớp quản lý người dùng (Backend App). Điều này giúp hệ thống mô phỏng sát thực tế cách các ứng dụng ví điện tử (Wallet App) tương tác với mạng lưới Blockchain.

Hệ thống gồm 3 thành phần chính:

Blockchain Core (/process): "Trái tim" của hệ thống. Chạy một node blockchain đơn giản bằng Go, chịu trách nhiệm tạo block (mining), xác thực và lưu trữ chuỗi vào sổ cái.

Backend Server (/src): Cầu nối giữa người dùng và Blockchain. Viết bằng TypeScript/Express, xử lý xác thực (JWT), quản lý thông tin cá nhân và gửi lệnh giao dịch xuống Core.

Client Dashboard (/front): Giao diện người dùng viết bằng HTML/CSS/JS thuần, giúp người dùng dễ dàng thao tác mà không cần dùng dòng lệnh.

📂 Cấu trúc Thư mục

Dưới đây là sơ đồ tổ chức mã nguồn chi tiết:

root/
├── process/                # [CORE] Dịch vụ Blockchain nền tảng
│   ├── blockchain/         # Logic chính: Block, Hash, Proof of Work
│   ├── main.go             # Entry point: Khởi chạy node (Port 8080)
│   ├── go.mod              # Quản lý thư viện Go
│   └── ...
│
├── src/                    # [BACKEND] API Server & User Management
│   ├── controllers/        # Xử lý logic đầu vào từ request
│   │   └── users.controllers.ts
│   ├── models/             # Định nghĩa Schema MongoDB & Types
│   │   ├── User.schema.ts
│   │   └── Chain.schema.ts
│   ├── routes/             # Định tuyến API (Endpoints)
│   ├── services/           # Logic nghiệp vụ & Gọi database
│   │   ├── database.services.ts  # Kết nối MongoDB
│   │   └── users.services.ts     # Logic user & gọi sang Core Go
│   ├── utils/              # Các hàm tiện ích (Hash, JWT, Validate)
│   ├── index.ts            # Entry point: Khởi chạy server (Port 3000)
│   └── ...
│
└── front/                  # [FRONTEND] Giao diện người dùng
    ├── html/               # Các trang: Login, Register, Dashboard
    ├── css/                # Stylesheet
    ├── js/                 # Logic gọi API (Fetch) & Xử lý DOM
    └── assets/             # Hình ảnh, icon (nếu có)


🚀 Yêu cầu Tiên quyết (Prerequisites)

Trước khi cài đặt, hãy đảm bảo máy tính của bạn đã có sẵn các môi trường sau:

Go (Golang): Phiên bản 1.18 trở lên. Tải tại đây.

Node.js: Phiên bản 16 LTS trở lên (kèm npm). Tải tại đây.

MongoDB:

Local: Cài đặt MongoDB Community Server.

Cloud: Tài khoản MongoDB Atlas (Lấy connection string).

Trình biên tập code: VS Code (Khuyên dùng).

🛠️ Hướng dẫn Cài đặt & Khởi chạy (Step-by-step)

Bạn cần mở 3 cửa sổ Terminal riêng biệt để chạy đồng thời 3 thành phần của hệ thống.

1️⃣ Bước 1: Khởi chạy Core Blockchain (process)

Đây là dịch vụ nền tảng, cần được chạy đầu tiên.

# Tại thư mục gốc, đi vào folder process
cd process

# Tải các thư viện Go cần thiết
go mod tidy

# Chạy Blockchain Node
go run main.go


✅ Thành công: Terminal hiển thị Listening on port 8080... (hoặc tương tự).

2️⃣ Bước 2: Khởi chạy Backend API (src)

Server này cần kết nối Database và gọi sang Core Blockchain.

# Mở Terminal thứ 2, đi vào folder src
cd src

# Tạo file môi trường (nếu chưa có) - Ví dụ cấu hình
# Bạn có thể copy file .env.example thành .env
echo "PORT=3000" >> .env
echo "DB_URI=mongodb://localhost:27017/blockchain_db" >> .env
echo "JWT_SECRET=mat_khau_bi_mat_cua_ban" >> .env

# Cài đặt thư viện Node.js
npm install

# Chạy server ở chế độ phát triển (tự động reload khi sửa code)
npm run dev


✅ Thành công: Terminal hiển thị Server is running on port 3000 và Connected to MongoDB.

3️⃣ Bước 3: Khởi chạy Frontend (front)

Giao diện người dùng để tương tác.

Cách đơn giản: Vào thư mục front/html và click đúp vào file login.html để mở trên trình duyệt.

Cách chuyên nghiệp (Khuyên dùng):

Mở VS Code tại thư mục root.

Cài Extension "Live Server".

Chuột phải vào front/html/login.html chọn "Open with Live Server".

ℹ️ Cấu hình API: Mặc định Frontend sẽ gọi về http://localhost:3000/api. Nếu bạn đổi port backend, hãy vào front/js/config.js (hoặc file tương ứng) để cập nhật.

🔌 API Documentation (Backend)

Backend cung cấp các endpoint chính sau (Prefix: /api):

Method

Endpoint

Mô tả

Yêu cầu Body / Header

POST

/users/register

Đăng ký tài khoản mới

{ username, password, email }

POST

/users/login

Đăng nhập hệ thống

{ username, password }

GET

/users/me

Lấy thông tin user hiện tại

Header: Authorization: Bearer <token>

POST

/chain/mine

Đào block mới (Giao dịch)

{ sender, receiver, amount }

GET

/chain

Lấy toàn bộ chuỗi khối

-

❓ Khắc phục sự cố (Troubleshooting)

1. Lỗi kết nối Database (MongoNetworkError)

Kiểm tra xem MongoDB đã chạy chưa (nếu dùng Local).

Kiểm tra chuỗi kết nối DB_URI trong file .env (hoặc database.services.ts) đã đúng username/password chưa.

Nếu dùng MongoDB Atlas, hãy đảm bảo bạn đã Whitelist IP hiện tại của máy.

2. Lỗi CORS (Frontend không gọi được API)

Backend đã được cấu hình cors chưa? Kiểm tra file src/index.ts:

import cors from 'cors';
app.use(cors()); // Cho phép tất cả domain
