// js/auth.js

//1. quản lý trạng thái người dùng
//khi tải trang, thử lấy thông tin từ Local Storage nếu không có thì là null (chưa đăng nhập).
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

function setCurrentUser(userData) {
  currentUser = userData;
  if (userData) {
    // nếu có user -> Lưu vào bộ nhớ trình duyệt
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  } else {
    // nếu không có user (đăng xuất) -> Xóa khỏi bộ nhớ
    localStorage.removeItem("currentUser");
  }
}

//2. đăng nhập
async function handleLogin() {
  //lấy dữ liệu từ form
  const u = document.getElementById("login-user").value;
  const p = document.getElementById("login-pass").value;
  //validation: Không được để trống
  if (!u || !p)
    return showToast("Lỗi", "Vui lòng nhập đầy đủ thông tin", "error");

  try {
    // call Api
    // API_URL lấy từ config.js
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: u, password: p }),
    });
    const data = await res.json();

    // xử lý status
    if (data.status === "success") {
      //lưu thông tin user vào Local Storage
      setCurrentUser(data);
      //tạo thông báo chào mừng
      const welcomeMsg = {
        title: "Xin chào",
        msg: `Chào mừng ${data.username} quay trở lại!`,
        type: "success",
      };
      localStorage.setItem("toastMessage", JSON.stringify(welcomeMsg));
      //chuyển hướng sang trang Dashboard
      window.location.href = "dashboard.html";
    } else {
      //đăng nhập thất bại (sai pass/user)
      showToast("Đăng nhập thất bại", data.error, "error");
    }
  } catch (e) {
    // Lỗi mạng hoặc lỗi server
    showToast("Lỗi", "Không thể kết nối Server", "error");
  }
}

//3. đăng ký
async function handleRegister() {
  const u = document.getElementById("reg-user").value.trim();
  const e = document.getElementById("reg-email").value.trim();
  const p = document.getElementById("reg-pass").value;
  const cp = document.getElementById("reg-confirm-pass").value;

  //kiểm tra để trống
  if (!u || !e || !p || !cp)
    return showToast("Lỗi", "Vui lòng nhập đủ thông tin.", "error");

  //kiểm tra định dạng Email bằng Regex
  //email có dạng: chuỗi@chuỗi.chuỗi
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(e)) {
    document.getElementById("reg-email").focus(); // Đưa con trỏ chuột về ô email
    return showToast(
      "Lỗi",
      "Email không hợp lệ. Vui lòng kiểm tra lại (ví dụ: abc@domain.com)",
      "error"
    );
  }

  //kiểm tra khớp mật khẩu
  if (p !== cp) {
    document.getElementById("reg-pass").focus();
    return showToast("Lỗi", "Mật khẩu không khớp.", "error");
  }

  try {
    //call api
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
//4.đăng xuất
function handleLogout() {
  //xóa user khỏi bộ nhớ và chuyển về trang Login
  setCurrentUser(null);
  window.location.href = "login.html";
}
