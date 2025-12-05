// js/main.js
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  // Kiểm tra xem có phải đang ở trang Dashboard không
  // Lưu ý: path === "/" áp dụng nếu chạy server mà trang chủ là dashboard
  const isDashboard = path.endsWith("dashboard.html") || path === "/";

  //BẢO VỆ DASHBOARD (Bắt buộc đăng nhập)
  if (isDashboard) {
    if (currentUser) {
      // Nếu có user -> Cho phép chạy Dashboard
      initDashboard();
    } else {
      // Nếu chưa có user -> Đá về trang Login ngay lập tức
      window.location.href = "login.html";
    }
  }
});

