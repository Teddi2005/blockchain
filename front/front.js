const API_URL = "http://localhost:3000/api";
let currentUser = null;
let chartInstance = null;

// Khởi tạo/Tải dữ liệu người dùng khi trang Dashboard được tải
document.addEventListener("DOMContentLoaded", () => {
  // 1. Khôi phục thông tin người dùng từ Local Storage
  const storedUser = localStorage.getItem("currentUser");
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    // Chỉ chạy initDashboard nếu đang ở trang dashboard (Kiểm tra URL)
    // Nếu không có bước kiểm tra này, nó sẽ chạy vô tận
    if (
      window.location.pathname.endsWith("dashboard.html") ||
      window.location.pathname === "/"
    ) {
      initDashboard();
    }
  } else {
    // Nếu không có người dùng và đang ở dashboard, chuyển về trang đăng nhập
    if (window.location.pathname.endsWith("dashboard.html")) {
      window.location.href = "login.html";
    }
  }
});

// --- HELPER FUNCTIONS ---

const formatCurrency = (val) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);

function showToast(title, msg, type = "info") {
  const toast = document.getElementById("toast");
  const icon = document.getElementById("toast-icon");
  const titleEl = document.getElementById("toast-title");
  const msgEl = document.getElementById("toast-msg");

  if (!toast) return; // Bảo vệ nếu toast không tồn tại (như ở trang Auth)

  titleEl.innerText = title;
  msgEl.innerText = msg;

  // Đặt lại border
  toast.classList.remove(
    "border-blue-500",
    "border-green-500",
    "border-red-500"
  );

  if (type === "success") {
    toast.classList.add("border-green-500");
    icon.innerHTML =
      '<i class="fa-solid fa-circle-check text-green-500 text-xl"></i>';
  } else if (type === "error") {
    toast.classList.add("border-red-500");
    icon.innerHTML =
      '<i class="fa-solid fa-circle-exclamation text-red-500 text-xl"></i>';
  } else {
    toast.classList.add("border-blue-500");
    icon.innerHTML =
      '<i class="fa-solid fa-circle-info text-blue-500 text-xl"></i>';
  }

  toast.classList.remove("translate-x-full");
  setTimeout(() => toast.classList.add("translate-x-full"), 3000);
}

// --- AUTH HANDLERS (SỬ DỤNG CHUYỂN HƯỚNG HTML) ---

// Hàm này không cần nữa vì đã dùng thẻ <a> để chuyển giữa login/register
// function toggleAuth(screen) { ... }

async function handleLogin() {
  const u = document.getElementById("login-user").value;
  const p = document.getElementById("login-pass").value;
  if (!u || !p)
    return showToast("Lỗi", "Vui lòng nhập đầy đủ thông tin", "error");

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: u, password: p }),
    });
    const data = await res.json();

    if (data.status === "success") {
      // LƯU THÔNG TIN NGƯỜI DÙNG
      currentUser = data;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      // LƯU THÔNG BÁO CHÀO MỪNG để hiển thị trên Dashboard
      const welcomeMsg = {
        title: "Xin chào",
        msg: `Chào mừng ${data.username} quay trở lại!`,
        type: "success",
      };
      localStorage.setItem("toastMessage", JSON.stringify(welcomeMsg)); // CHUYỂN HƯỚNG đến trang dashboard

      window.location.href = "dashboard.html";
    } else {
      showToast("Đăng nhập thất bại", data.error, "error");
    }
  } catch (e) {
    showToast("Lỗi", "Không thể kết nối Server", "error");
  }
}
async function handleRegister() {
  const u = document.getElementById("reg-user").value;
  const p = document.getElementById("reg-pass").value;
  if (!u || !p)
    return showToast("Lỗi", "Vui lòng nhập đầy đủ thông tin", "error");

  try {
    // ... (Gọi API) ...
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: u, password: p }),
    });
    const data = await res.json();

    if (data.status === "success") {
      showToast("Thành công", "Đăng ký thành công! Hãy đăng nhập.", "success");

      // 💡 THÊM ĐỘ TRỄ TRƯỚC KHI CHUYỂN HƯỚNG
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500); // Đợi 1.5 giây để Toast hiển thị
    } else {
      showToast("Lỗi", data.error, "error");
    }
  } catch (e) {
    showToast("Lỗi", "Không thể kết nối Server", "error");
  }
}
function handleLogout() {
  // XÓA THÔNG TIN NGƯỜI DÙNG VÀ CHUYỂN TRANG
  currentUser = null;
  localStorage.removeItem("currentUser");
  // Chuyển hướng về trang đăng nhập
  window.location.href = "login.html";
}

// --- DASHBOARD LOGIC (SỬA LẠI ĐỂ CHỈ CHẠY KHI DASHBOARD TẢI) ---

function initDashboard() {
  if (!currentUser) return; // Bảo vệ // Hiển thị thông tin người dùng

  document.getElementById("dash-username").innerText = currentUser.username; // Cắt bớt địa chỉ ví
  const address = currentUser.address;
  document.getElementById("dash-address").innerText = `${address.substring(
    0,
    6
  )}...${address.substring(address.length - 4)}`; // 💡 HIỂN THỊ TOAST CHÀO MỪNG (Sau khi chuyển hướng thành công)

  const storedToast = localStorage.getItem("toastMessage");
  if (storedToast) {
    const toastData = JSON.parse(storedToast);
    showToast(toastData.title, toastData.msg, toastData.type); // Xóa thông báo khỏi Local Storage để nó không hiển thị lại khi reload
    localStorage.removeItem("toastMessage");
  }

  loadData();
}

// Các hàm khác giữ nguyên vì chúng xử lý logic bên trong dashboard
async function loadData() {
  // ... (logic giữ nguyên) ...
  Promise.all([
    fetch(`${API_URL}/rich-list`).then((r) => r.json()),
    fetch(`${API_URL}/history`).then((r) => r.json()),
  ])
    .then(([richData, historyData]) => {
      processRichListData(richData.data);
      renderHistory(historyData.data);
    })
    .catch((err) =>
      showToast(
        "Lỗi tải dữ liệu",
        "Không thể tải dữ liệu quỹ từ Server.",
        "error"
      )
    );
}

function processRichListData(data) {
  // ... (logic giữ nguyên) ...
  // 1. Tính tổng quỹ
  let totalMoney = 0;
  data.forEach((i) => (totalMoney += i.total));
  document.getElementById("total-fund").innerText = formatCurrency(totalMoney);

  // 2. Lọc danh sách hiển thị
  let activeUsers = data.filter((i) => {
    const name = i.name || "";
    return (
      name !== "Genesis" &&
      name !== "Khách vãng lai" &&
      name !== "Khách lạ" &&
      name !== "unknown" &&
      !name.startsWith("0x") &&
      i.total > 0
    );
  });

  // 3. ĐẾM SỐ NGƯỜI GÓP
  document.getElementById("total-people").innerText = activeUsers.length;

  // 4. Sắp xếp giảm dần
  activeUsers.sort((a, b) => b.total - a.total);

  let displayList = [];

  // 5. Logic Top 5 + Others
  if (activeUsers.length <= 5) {
    displayList = activeUsers;
  } else {
    const top5 = activeUsers.slice(0, 5);
    const others = activeUsers.slice(5);

    // Tính tổng nhóm others
    const othersTotal = others.reduce((sum, item) => sum + item.total, 0);

    displayList = [...top5];
    if (othersTotal > 0) {
      displayList.push({
        name: `Các mạnh thường quân khác (${others.length})`,
        total: othersTotal,
        isGroup: true,
      });
    }
  }

  renderRichList(displayList);
  updateChart(displayList);
}

function renderRichList(list) {
  const container = document.getElementById("rich-list-container");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML =
      '<div class="text-center text-gray-400 mt-4 italic text-sm">Chưa có thành viên chính thức nào đóng góp.</div>';
    return;
  }

  list.forEach((item, index) => {
    const icon =
      index === 0
        ? "🥇"
        : index === 1
        ? "🥈"
        : index === 2
        ? "🥉"
        : `#${index + 1}`;
    const bgClass = item.isGroup
      ? "bg-gray-50 border-gray-200"
      : "bg-white border-slate-100";
    const textClass = item.isGroup
      ? "text-gray-500 italic"
      : "text-slate-800 font-medium";

    const html = `
                <div class="flex items-center justify-between p-3 mb-2 rounded-lg border ${bgClass} hover:shadow-sm transition">
                    <div class="flex items-center gap-3">
                        <span class="w-8 text-center font-bold text-slate-400 text-sm">${
                          item.isGroup ? "..." : icon
                        }</span>
                        <span class="${textClass}">${item.name}</span>
                    </div>
                    <span class="font-bold text-slate-700">${formatCurrency(
                      item.total
                    )}</span>
                </div>
            `;
    container.innerHTML += html;
  });
}

function renderHistory(list) {
  const container = document.getElementById("history-container");
  container.innerHTML = "";

  list.forEach((item) => {
    if (item.name === "Genesis") return;
    const html = `
                <div class="flex justify-between items-start border-b border-gray-100 pb-2 last:border-0">
                    <div>
                        <div class="font-medium text-slate-700 text-sm">${
                          item.name
                        }</div>
                        <div class="text-xs text-slate-400">${item.time}</div>
                    </div>
                    <div class="text-green-600 font-bold text-sm">+${formatCurrency(
                      item.value
                    )}</div>
                </div>
            `;
    container.innerHTML += html;
  });
}

function updateChart(data) {
  const ctx = document.getElementById("donationChart").getContext("2d");
  const labels = data.map((i) => i.name);
  const values = data.map((i) => i.total);
  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#94a3b8",
  ];

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
          labels: { boxWidth: 12, font: { size: 11 } },
        },
      },
    },
  });
}

async function handleDonate() {
  const amt = document.getElementById("donate-amount").value;
  const btn = document.getElementById("btn-donate");
  const spinner = btn.querySelector(".loading-spinner");

  if (!amt || amt <= 0)
    return showToast("Lỗi", "Số tiền không hợp lệ", "error");
  if (!currentUser || !currentUser.private_key)
    return showToast(
      "Lỗi",
      "Không tìm thấy khóa cá nhân. Vui lòng đăng nhập lại.",
      "error"
    );

  btn.disabled = true;
  spinner.classList.remove("hidden");

  try {
    const res = await fetch(`${API_URL}/donate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        privateKey: currentUser.private_key,
        amount: amt,
      }),
    });
    const data = await res.json();

    if (data.status === "success") {
      showToast("Thành công", "Quyên góp thành công!", "success");
      document.getElementById("donate-amount").value = "";
      loadData();
    } else {
      showToast("Lỗi", data.error, "error");
    }
  } catch (e) {
    showToast("Lỗi", "Không thể kết nối", "error");
  }

  btn.disabled = false;
  spinner.classList.add("hidden");
}

async function checkIntegrity() {
  showToast("Đang kiểm tra...", "Đang quét toàn bộ Blockchain...", "info");
  try {
    const res = await fetch(`${API_URL}/check-integrity`);
    const data = await res.json();
    if (data.status.includes("AN TOÀN") || data.message.includes("hợp lệ")) {
      showToast("Blockchain An Toàn", data.message, "success");
    } else {
      showToast("CẢNH BÁO", data.message, "error");
    }
  } catch (e) {
    showToast("Lỗi", "Không kết nối được Node", "error");
  }
}
