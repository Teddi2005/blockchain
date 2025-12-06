Dưới đây là file `README.md` được viết chi tiết và chuyên nghiệp bằng tiếng Việt, phù hợp với cấu trúc dự án Fullstack Blockchain của bạn. Bạn có thể copy toàn bộ nội dung trong khối code bên dưới và lưu thành file `README.md` tại thư mục gốc.

````markdown
# Blockchain Fullstack System

Dự án này là một hệ thống ứng dụng Blockchain hoàn chỉnh bao gồm 3 thành phần chính: lõi Blockchain xử lý dữ liệu (Go), Backend Server quản lý người dùng (TypeScript), và giao diện Frontend (HTML/JS).

---

## 🏗️ Kiến trúc Dự án

Hệ thống được chia thành 3 thư mục chính:

1.  **`process/` (Blockchain Core)**:
    * Được viết bằng **Go (Golang)**.
    * [cite_start]Chịu trách nhiệm khởi tạo blockchain, khai thác (mining) khối mới và duy trì tính toàn vẹn của chuỗi[cite: 80, 94].
    * Xử lý các logic tính toán nặng của hệ thống.

2.  **`src/` (Backend API)**:
    * [cite_start]Được viết bằng **TypeScript (Node.js)**[cite: 2].
    * Cung cấp RESTful API cho Frontend.
    * [cite_start]Quản lý xác thực người dùng (JWT), mã hóa mật khẩu và tương tác với cơ sở dữ liệu[cite: 3, 4, 10].

3.  **`front/` (Frontend)**:
    * [cite_start]Sử dụng **HTML5, CSS3, JavaScript (Vanilla)** thuần[cite: 13, 14, 22].
    * [cite_start]Giao diện người dùng bao gồm: Đăng nhập, Đăng ký và Dashboard quản lý[cite: 14, 18, 20].
    * [cite_start]Kết nối với Backend thông qua API[cite: 25].

---

## 📂 Cấu trúc Thư mục

```text
root/
├── process/                # --- Lõi Blockchain (Go) ---
│   ├── blockchain/         # Logic xử lý Block và Chain
│   ├── main.go             # Điểm khởi chạy (Entry point)
│   ├── go.mod              # Quản lý thư viện Go
│   └── ...
│
├── src/                    # --- Backend API (TypeScript) ---
│   ├── controllers/        # Xử lý logic nghiệp vụ (Users)
│   ├── models/             # Định nghĩa cấu trúc dữ liệu (Schemas)
│   ├── routes/             # Định nghĩa các đường dẫn API
│   ├── services/           # Services (Database, Logic)
│   ├── utils/              # Tiện ích (Crypto, JWT, Validation)
│   ├── index.ts            # Điểm khởi chạy Server
│   └── ...
│
└── front/                  # --- Frontend (Static Web) ---
    ├── css/                # Stylesheets
    ├── html/               # Các trang giao diện (Login, Register, Dashboard)
    ├── js/                 # Logic JS và cấu hình API
    └── ...
````

-----

## 🚀 Hướng dẫn Cài đặt & Chạy

Để hệ thống hoạt động, bạn cần khởi chạy đồng thời cả 3 thành phần.

### Yêu cầu tiên quyết (Prerequisites)

  * **Go**: Phiên bản 1.18+
  * **Node.js**: Phiên bản 16+
  * **MongoDB**: Cơ sở dữ liệu để lưu trữ thông tin người dùng.

### Bước 1: Cấu hình & Chạy Backend (`src`)

1.  Mở terminal và di chuyển vào thư mục `src`:
    ```bash
    cd src
    ```
2.  Cài đặt các thư viện:
    ```bash
    npm install
    ```
3.  Tạo file `.env` (nếu chưa có) để cấu hình kết nối Database và JWT secret.
4.  Khởi chạy server (mặc định port 3000):
    ```bash
    npm run dev
    # Hoặc chạy trực tiếp:
    npx ts-node index.ts
    ```
    *Backend sẽ chạy tại `http://localhost:3000`.*

### Bước 2: Chạy Blockchain Node (`process`)

1.  Mở một terminal **mới** và di chuyển vào thư mục `process`:
    ```bash
    cd process
    ```
2.  Tải các module cần thiết:
    ```bash
    go mod tidy
    ```
3.  Chạy node blockchain:
    ```bash
    go run main.go
    ```

### Bước 3: Chạy Frontend (`front`)

1.  [cite_start]Kiểm tra cấu hình API tại `front/js/config.js`[cite: 25]:

    ```javascript
    const API_URL = "http://localhost:3000/api";
    ```

    *Đảm bảo port này khớp với port Backend đang chạy.*

2.  Mở giao diện web:

      * **Cách 1 (Khuyên dùng):** Sử dụng **Live Server** trên VS Code để mở file `front/html/login.html`.
      * **Cách 2:** Mở trực tiếp file `front/html/login.html` bằng trình duyệt.

-----

## ✨ Tính năng Chính

  * **Quản lý người dùng**:
      * [cite_start]Đăng ký tài khoản mới (mã hóa mật khẩu an toàn)[cite: 20, 8].
      * [cite_start]Đăng nhập lấy Token (JWT Authentication)[cite: 18, 10].
  * **Blockchain**:
      * [cite_start]Khởi tạo khối (Block creation) và chuỗi (Chain management)[cite: 80].
  * **Giao diện Dashboard**:
      * [cite_start]Hiển thị thông tin tổng quan và trạng thái hệ thống[cite: 14, 26].

-----

## 🔧 Công nghệ sử dụng

  * **Backend**: Node.js, Express (implied), TypeScript, MongoDB.
  * **Blockchain**: Go (Golang).
  * **Frontend**: HTML, CSS, Tailwind CSS, JavaScript.
  * **Bảo mật**: JWT (JSON Web Tokens), SHA256 Hashing.

<!-- end list -->

```
```
