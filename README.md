Dưới đây là file `README.md` đầy đủ và chi tiết dựa trên cấu trúc source code bạn đã cung cấp (gồm 3 phần: `process`, `src`, `front`).

Bạn hãy tạo một file tên là **`README.md`** ở thư mục gốc của dự án và dán nội dung dưới đây vào:

````markdown
# Blockchain System Fullstack Project

Dự án này là một hệ thống Blockchain Fullstack bao gồm 3 thành phần chính hoạt động cùng nhau:
1.  **Core Blockchain (`process`)**: Xử lý logic blockchain nền tảng (viết bằng Go).
2.  **Backend API (`src`)**: API Server quản lý người dùng và dữ liệu (viết bằng TypeScript/Node.js).
3.  **Frontend (`front`)**: Giao diện người dùng Dashboard (viết bằng HTML/CSS/JS thuần).

---

## 📂 Cấu trúc Dự án

```text
root/
├── process/           # Blockchain Core Services (Golang)
│   ├── blockchain/    # Định nghĩa Block và logic xử lý
│   ├── main.go        # Điểm khởi chạy của Core service
│   ├── go.mod         # Quản lý dependencies Go
│   └── ...
│
├── src/               # Backend Server (TypeScript/Node.js)
│   ├── controllers/   # Xử lý logic request (Users)
│   ├── models/        # Định nghĩa Schema (Database)
│   ├── routes/        # Định nghĩa API routes
│   ├── services/      # Logic nghiệp vụ & Database connection
│   ├── utils/         # Tiện ích: Crypto, JWT, Validation
│   └── index.ts       # Điểm khởi chạy của Backend server
│
└── front/             # User Interface (Static Files)
    ├── html/          # Các trang: Login, Register, Dashboard
    ├── css/           # Stylesheet cho giao diện
    ├── js/            # Logic frontend & Config API call
    └── ...
````

-----

## 🚀 Yêu cầu hệ thống (Prerequisites)

Để chạy được toàn bộ dự án, máy tính cần cài đặt:

  * [cite_start]**Go (Golang)**: Phiên bản 1.18 trở lên (để chạy folder `process`)[cite: 47].
  * [cite_start]**Node.js & npm**: Phiên bản 16+ (để chạy folder `src`)[cite: 70].
  * [cite_start]**Cơ sở dữ liệu**: MongoDB (Dựa trên cấu hình trong `src/services/database.services.ts`)[cite: 72].

-----

## 🛠️ Hướng dẫn Cài đặt & Khởi chạy

Bạn cần mở 3 terminal riêng biệt để chạy đồng thời cả 3 dịch vụ.

### 1\. Khởi chạy Core Blockchain (`process`)

Dịch vụ này xử lý các logic cốt lõi của blockchain như tạo block.

```bash
# Di chuyển vào thư mục process
cd process

# Tải các thư viện cần thiết
go mod tidy

# Chạy dịch vụ
go run main.go
```

### 2\. Khởi chạy Backend API (`src`)

Server này cung cấp API cho Frontend và xử lý xác thực người dùng.

```bash
# Di chuyển vào thư mục src
cd src

# Cài đặt dependencies
npm install

# Chạy server (Dev mode)
# Lưu ý: Lệnh này phụ thuộc vào script trong package.json, thường là:
npm run dev
# Hoặc chạy trực tiếp bằng ts-node:
npx ts-node src/index.ts
```

> [cite_start]**Lưu ý:** Backend cần chạy ở cổng **3000** để khớp với cấu hình mặc định của frontend[cite: 93].

### 3\. Khởi chạy Frontend (`front`)

Frontend là web tĩnh, bạn có thể chạy bằng cách mở file trực tiếp hoặc dùng Live Server.

  * [cite_start]**Cách đơn giản:** Vào thư mục `front/html` và mở file `login.html` bằng trình duyệt web[cite: 86].
  * **Cách khuyến nghị (VS Code):** Cài extension "Live Server", chuột phải vào `front/html/login.html` và chọn "Open with Live Server".

Cấu hình kết nối API mặc định nằm tại `front/js/config.js`:

```javascript
const API_URL = "http://localhost:3000/api";
```

-----

## ✨ Tính năng chính

### Blockchain Core (Go)

  * [cite_start]Xây dựng cấu trúc Block và Blockchain[cite: 46].
  * Xử lý logic mining hoặc xử lý giao dịch nền (Core processing).

### Backend (TypeScript)

  * [cite_start]**Authentication:** Đăng ký, Đăng nhập bảo mật với JWT (JSON Web Token)[cite: 79].
  * [cite_start]**Security:** Mã hóa dữ liệu người dùng (`utils/crypto.ts`)[cite: 77].
  * [cite_start]**Database:** Tương tác với MongoDB thông qua Services pattern[cite: 72].
  * [cite_start]**Validation:** Kiểm tra dữ liệu đầu vào chặt chẽ[cite: 79].

### Frontend

  * [cite_start]**Auth UI:** Giao diện Đăng nhập & Đăng ký hoàn chỉnh[cite: 86, 89].
  * [cite_start]**Dashboard:** Bảng điều khiển quản lý thông tin sau khi đăng nhập thành công[cite: 82].
  * [cite_start]**API Integration:** Tự động gọi API backend thông qua `fetch` trong `js/utils.js` và `js/auth.js`[cite: 91, 101].

-----

## 📝 Configuration (Biến môi trường)

Trong thư mục `src`, bạn có thể cần tạo file `.env` để cấu hình các biến sau (dựa trên code `utils/jwt.ts` và database):

```env
PORT=3000
DB_URI=mongodb://localhost:27017/your_db_name
JWT_SECRET=your_secret_key_here
```

-----

## 🤝 Đóng góp

1.  Fork dự án.
2.  Tạo branch tính năng (`git checkout -b feature/NewFeature`).
3.  Commit thay đổi (`git commit -m 'Add NewFeature'`).
4.  Push lên branch (`git push origin feature/NewFeature`).
5.  Mở Pull Request.

<!-- end list -->

```
```
