// js/auth.js

//Khi tải trang, thử lấy thông tin từ Local Storage. Nếu không có thì là null (chưa đăng nhập).
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

function setCurrentUser(userData) {
  currentUser = userData;
  if (userData) {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  } else {
    localStorage.removeItem("currentUser");
  }
}

async function handleLogin() {
  const u = document.getElementById("login-user").value;
  const p = document.getElementById("login-pass").value;
  if (!u || !p)
    return showToast("Lỗi", "Vui lòng nhập đầy đủ thông tin", "error");

  try {
    // API_URL lấy từ config.js
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: u, password: p }),
    });
    const data = await res.json();

    if (data.status === "success") {
      setCurrentUser(data);
      const welcomeMsg = {
        title: "Xin chào",
        msg: `Chào mừng ${data.username} quay trở lại!`,
        type: "success",
      };
      localStorage.setItem("toastMessage", JSON.stringify(welcomeMsg));
      window.location.href = "dashboard.html";
    } else {
      showToast("Đăng nhập thất bại", data.error, "error");
    }
  } catch (e) {
    showToast("Lỗi", "Không thể kết nối Server", "error");
  }
}

async function handleRegister() {
  const u = document.getElementById("reg-user").value.trim();
  const e = document.getElementById("reg-email").value.trim();
  const p = document.getElementById("reg-pass").value;
  const cp = document.getElementById("reg-confirm-pass").value;

  // 1. Kiểm tra để trống
  if (!u || !e || !p || !cp)
    return showToast("Lỗi", "Vui lòng nhập đủ thông tin.", "error");

  // 2. [MỚI] Kiểm tra định dạng Email bằng Regex
  // Regex này yêu cầu: không khoảng trắng @ không khoảng trắng . không khoảng trắng
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(e)) {
    document.getElementById("reg-email").focus(); // Đưa con trỏ chuột về ô email
    return showToast(
      "Lỗi",
      "Email không hợp lệ. Vui lòng kiểm tra lại (ví dụ: abc@domain.com)",
      "error"
    );
  }

  // 3. Kiểm tra khớp mật khẩu
  if (p !== cp) {
    document.getElementById("reg-pass").focus();
    return showToast("Lỗi", "Mật khẩu không khớp.", "error");
  }

  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: u, email: e, password: p }),
    });
    const data = await res.json();

    if (res.ok && data.status === "success") {
      showToast("Thành công", "Đăng ký thành công!", "success");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    } else {
      showToast("Lỗi", data.error, "error");
    }
  } catch (e) {
    showToast("Lỗi", "Không thể kết nối Server", "error");
  }
}

function handleLogout() {
  setCurrentUser(null);
  window.location.href = "login.html";
}
