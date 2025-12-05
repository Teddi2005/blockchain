Đây là nội dung file `README.md` được định dạng chuẩn Markdown. Bạn hãy tạo một file mới có tên là `README.md` trong thư mục gốc của dự án và dán toàn bộ nội dung trong khối mã bên dưới vào.


http://googleusercontent.com/immersive_entry_chip/0
✅ **Thành công:** Terminal báo `🚀 Server TypeScript đang chạy tại http://localhost:3000` và `Connected to MongoDB`.

### 3️⃣ Bước 3: Mở Frontend (Giao diện)
Giao diện để người dùng thao tác.

* **Cách 1 (Khuyên dùng):** Cài extension **Live Server** trên VS Code -> Chuột phải vào `front/index.html` -> Chọn **Open with Live Server**.
* **Cách 2:** Mở trực tiếp file `front/index.html` bằng trình duyệt Chrome/Edge.

---

## 📖 Hướng Dẫn Sử Dụng

1.  **Đăng Ký:**
    * Nhập *Tên đăng nhập*, *Email* và *Mật khẩu*.
    * Hệ thống sẽ tự động tạo một ví Blockchain (Address & Private Key) cho bạn.
2.  **Quyên Góp (Donate):**
    * Đăng nhập vào hệ thống.
    * Nhập số tiền và nhấn **Gửi**.
    * Giao dịch sẽ được đẩy xuống Blockchain Core để ghi nhận.
3.  **Bảng Vàng (Rich List):**
    * Xem Top 5 người đóng góp nhiều nhất.
    * **Lưu ý:** Hệ thống tự động lọc bỏ "Khách vãng lai" (những người chưa đăng ký tài khoản).
4.  **Kiểm Tra Tính Toàn Vẹn:**
    * Nhấn nút "Kiểm tra" để quét lại toàn bộ chuỗi khối xem có bị hack hay chỉnh sửa không.

---

## 🔌 Danh Sách API (Backend Endpoints)

| Method | Endpoint | Chức năng | Body Yêu Cầu |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/register` | Đăng ký tài khoản | `{ username, password, email }` |
| `POST` | `/api/login` | Đăng nhập | `{ username, password }` |
| `POST` | `/api/donate` | Quyên góp tiền | `{ privateKey, amount }` |
| `GET` | `/api/history` | Lấy lịch sử giao dịch | - |
| `GET` | `/api/rich-list` | Lấy bảng xếp hạng (Đã lọc) | - |
| `GET` | `/api/check-integrity` | Kiểm tra chuỗi khối | - |

---

## ❓ Khắc Phục Sự Cố (Troubleshooting)

**Q: Tại sao tôi không thể đăng ký?**
> **A:** Kiểm tra xem MongoDB đã bật chưa. Xem lại chuỗi kết nối trong `src/services/database.services.ts`.

**Q: Tại sao gửi tiền cứ xoay mãi (Loading)?**
> **A:** Kiểm tra xem cửa sổ **Blockchain Core (Go)** có đang chạy không. Nếu Core tắt, Backend không thể gửi giao dịch.

**Q: Lỗi CORS khi gọi API?**
> **A:** Đảm bảo Backend đã cài `cors`. Code hiện tại trong `src/index.ts` đã bật sẵn: `app.use(cors())`.

---

*© 2025 HaTriDusChain Project - Built with Passion.*
```
