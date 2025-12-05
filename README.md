Dưới đây là phiên bản `README.md` được **nâng cấp toàn diện**, chi tiết và chuyên nghiệp nhất dành cho dự án **HaTriDusChain** của bạn. Nó bao gồm sơ đồ kiến trúc, giải thích chuyên sâu, hướng dẫn cấu hình môi trường (env) và các lưu ý kỹ thuật quan trọng.

Bạn hãy copy toàn bộ nội dung trong khối mã dưới đây và lưu đè vào file `README.md` ở thư mục gốc dự án.


http://googleusercontent.com/immersive_entry_chip/0
✅ **Thành công:** Màn hình hiện:
> `🚀 Server TypeScript đang chạy tại http://localhost:3000`
> `☘️ Connected to MongoDB successfully`

### 3️⃣ Terminal 3: Khởi chạy Frontend
Giao diện người dùng.

* **Phương pháp chuẩn (VS Code):**
    1.  Cài Extension **"Live Server"**.
    2.  Chuột phải vào file `front/index.html`.
    3.  Chọn **"Open with Live Server"**.
* **Phương pháp thủ công:** Mở trực tiếp file `front/index.html` bằng trình duyệt (Chrome/Edge).

---

## ✨ Các Tính Năng Nổi Bật

### 🔐 Hệ thống Xác thực & Ví (Auth & Wallet)
* **Đăng ký thông minh:** Người dùng chỉ cần đăng ký tài khoản (User/Pass/Email), hệ thống tự động sinh ra một **Ví Blockchain** (Address & Private Key) duy nhất cho họ.
* **Bảo mật:** Mật khẩu được mã hóa, phiên đăng nhập quản lý bằng JWT.

### 💸 Giao dịch & Quyên góp (Donation)
* **Real-time:** Giao dịch quyên góp được gửi từ Frontend -> Backend -> Blockchain Core ngay lập tức.
* **Minh bạch:** Mọi giao dịch đều có Hash riêng, có thể tra cứu lịch sử.

### 🏆 Bảng Vàng (Rich List Algorithm)
* **Bộ lọc thông minh:** Hệ thống tự động tính toán tổng tiền đóng góp.
* **Anti-Spam:** Tự động loại bỏ các giao dịch từ "Khách vãng lai" (người dùng chưa đăng ký) hoặc các địa chỉ ví rác khỏi Top 5 để vinh danh đúng người thật.
* **Thống kê thực:** Đếm chính xác số lượng **người dùng thực tế** tham gia (thay vì chỉ đếm số lượt giao dịch).

### 🛡️ Thanh Tra Hệ Thống (Audit)
* **Kiểm tra toàn vẹn:** Tính năng cho phép quét lại toàn bộ chuỗi khối từ Genesis Block đến hiện tại. Nếu có bất kỳ block nào bị sửa đổi dữ liệu trái phép, hệ thống sẽ cảnh báo đỏ ngay lập tức.

---

## 🔌 API Documentation (Backend Endpoints)

| Method | Endpoint | Yêu cầu Body | Mô tả |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/register` | `{username, password, email}` | Tạo tài khoản & Ví mới |
| `POST` | `/api/login` | `{username, password}` | Đăng nhập hệ thống |
| `POST` | `/api/donate` | `{privateKey, amount}` | Thực hiện quyên góp tiền |
| `GET` | `/api/history` | - | Lấy 10 giao dịch mới nhất |
| `GET` | `/api/rich-list` | - | Lấy BXH Top 5 (Đã lọc rác) |
| `GET` | `/api/check-integrity`| - | Kiểm tra bảo mật chuỗi |

---

## ❓ Khắc Phục Sự Cố (Troubleshooting)

**Q1: Tại sao tôi không thể Đăng ký/Đăng nhập?**
> **A:** Kiểm tra lại kết nối MongoDB. Đảm bảo IP máy bạn đã được Whitelist trên MongoDB Atlas. Xem file `src/services/database.services.ts`.

**Q2: Tại sao gửi tiền cứ xoay mãi (Loading...) không xong?**
> **A:** Rất có thể **Blockchain Core (Terminal 1)** chưa chạy hoặc bị tắt. Backend cần Core hoạt động để ghi Block.

**Q3: Tại sao cài `npm install` bị lỗi?**
> **A:** Thử xóa thư mục `node_modules` và file `package-lock.json` rồi chạy lại `npm install`.

**Q4: Lỗi CORS khi gọi API?**
> **A:** Backend đã được tích hợp sẵn gói `cors`. Hãy đảm bảo bạn truy cập Frontend qua `localhost` hoặc `127.0.0.1`.

---

**© 2025 HaTriDusChain Project.**
*Developed with ❤️ for Education & Community.*
```
