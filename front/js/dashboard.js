// js/dashboard.js
let chartInstance = null;

function initDashboard() {
  if (!currentUser) return; // currentUser lấy từ auth.js

  const usernameEl = document.getElementById("dash-username");
  const addressEl = document.getElementById("dash-address");

  if (usernameEl) usernameEl.innerText = currentUser.username;
  if (addressEl) {
    const address = currentUser.address;
    //Format địa chỉ
    addressEl.innerText = `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  }

  //Lấy thông báo từ Local Storage
  const storedToast = localStorage.getItem("toastMessage");
  if (storedToast) {
    const t = JSON.parse(storedToast);
    showToast(t.title, t.msg, t.type); // showToast lấy từ utils.js
    localStorage.removeItem("toastMessage"); // Xóa đi để không hiện lại khi f5
  }

  // Bắt đầu tải dữ liệu bảng và biểu đồ
  loadData();
}

async function loadData() {
  // Chỉ chạy nếu có container hiển thị lịch sử
  if (!document.getElementById("history-container")) return;

  // showToast lấy từ utils.js
  showToast("Đang tải", "Đang tải dữ liệu...", "info");

  try {
    //Gọi cả 2 API (Danh sách giàu & Lịch sử)
    const [richRes, historyRes] = await Promise.all([
      fetch(`${API_URL}/rich-list`),
      fetch(`${API_URL}/history`),
    ]);

    const richData = await richRes.json();
    const historyData = await historyRes.json();

    //// Sau khi có dữ liệu, gọi các hàm xử lý hiển thị
    processRichListData(richData.data);
    renderHistory(historyData.data);
    showToast("Thành công", "Tải dữ liệu hoàn tất.", "success");
  } catch (err) {
    showToast("Lỗi tải dữ liệu", "Không thể tải dữ liệu.", "error");
  }
}

function processRichListData(data) {
  //tính Tổng Quỹ
  let totalMoney = 0;
  data.forEach((i) => (totalMoney += i.total));
  const totalFundEl = document.getElementById("total-fund");
  if (totalFundEl) totalFundEl.innerText = formatCurrency(totalMoney); // formatCurrency từ utils.js

  //lọc danh sách người dùng thực
  // Loại bỏ: Genesis (tài khoản gốc), Khách vãng lai, và các tài khoản hệ thống (bắt đầu bằng 0x nếu chưa đặt tên)
  let activeUsers = data.filter((i) => {
    const name = i.name || "";
    return name !== "Genesis" && !name.startsWith("0x") && i.total > 0;
  });

  //cập nhật số người đóng góp
  const totalPeopleEl = document.getElementById("total-people");
  if (totalPeopleEl) totalPeopleEl.innerText = activeUsers.length;

  //sắp xếp giảm dần theo số tiền
  activeUsers.sort((a, b) => b.total - a.total);

  //chia nhóm hiển thị (Top 5 + Nhóm "Khác")
  let displayList = [];
  if (activeUsers.length <= 5) {
    displayList = activeUsers;
  } else {
    const top5 = activeUsers.slice(0, 5); // Lấy 5 người đầu
    const others = activeUsers.slice(5); // Lấy phần còn lại
    // tính tổng tiền của nhóm "Khác"
    const othersTotal = others.reduce((sum, item) => sum + item.total, 0);
    displayList = [...top5];
    if (othersTotal > 0) {
      //thêm một mục đại diện cho nhóm còn lại
      displayList.push({
        name: `Khác (${others.length})`,
        total: othersTotal,
        isGroup: true, // Cờ đánh dấu để render giao diện khác đi
      });
    }
  }

  // Gọi hàm render ra HTML và vẽ biểu đồ
  renderRichList(displayList);
  updateChart(displayList);
}

// Hàm render HTML danh sách Bảng Vàng
function renderRichList(list) {
  const container = document.getElementById("rich-list-container");
  if (!container) return;
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML =
      '<div class="text-center text-gray-400 mt-4 text-sm">Chưa có dữ liệu.</div>';
    return;
  }

  list.forEach((item, index) => {
    //tạo icon huy chương cho Top 3
    const icon =
      index === 0
        ? "🥇"
        : index === 1
        ? "🥈"
        : index === 2
        ? "🥉"
        : `#${index + 1}`;
    const bgClass = item.isGroup ? "bg-gray-50" : "bg-white";
    const html = `
        <div class="flex justify-between p-3 mb-2 rounded border ${bgClass}">
            <div class="flex gap-3">
                <span class="font-bold text-slate-400 w-6 text-center">${
                  item.isGroup ? "..." : icon
                }</span>
                <span class="font-medium">${item.name}</span>
            </div>
            <span class="font-bold text-slate-700">${formatCurrency(
              item.total
            )}</span>
        </div>`;
    container.innerHTML += html;
  });
}
// Hàm render HTML Lịch sử giao dịch
function renderHistory(list) {
  const container = document.getElementById("history-container");
  if (!container) return;
  container.innerHTML = "";

  list.forEach((item) => {
    if (item.name === "Genesis") return;
    const html = `
        <div class="flex justify-between border-b pb-2 mb-2">
            <div>
                <div class="font-medium text-sm">${item.name}</div>
                <div class="text-xs text-gray-400">${item.time}</div>
            </div>
            <div class="text-green-600 font-bold">+${formatCurrency(
              item.value
            )}</div>
        </div>`;
    container.innerHTML += html;
  });
}

//chart
function updateChart(data) {
  const ctxEl = document.getElementById("donationChart");
  if (!ctxEl) return;
  const ctx = ctxEl.getContext("2d");

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
  //Hủy biểu đồ cũ nếu tồn tại để tránh lỗi hiển thị đè nhau
  if (chartInstance) chartInstance.destroy();
  // Tạo biểu đồ mới
  chartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [{ data: values, backgroundColor: colors, borderWidth: 0 }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "right", labels: { boxWidth: 12 } } },
    },
  });
}

//donate
async function handleDonate() {
  const amt = document.getElementById("donate-amount").value;
  const btn = document.getElementById("btn-donate");
  //Validate đầu vào
  if (!amt || amt <= 0)
    return showToast("Lỗi", "Số tiền không hợp lệ", "error");
  if (!currentUser) return showToast("Lỗi", "Vui lòng đăng nhập lại.", "error");
  //Disable nút để tránh spam click
  if (btn) btn.disabled = true;

  try {
    //call Api
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
      //Tải lại dữ liệu ngay lập tức để cập nhật giao diện
      loadData();
    } else {
      showToast("Lỗi", data.error, "error");
    }
  } catch (e) {
    showToast("Lỗi", "Lỗi kết nối", "error");
  }
  // Mở lại nút sau khi xử lý xong
  if (btn) btn.disabled = false;
}

async function checkIntegrity() {
  showToast("Đang quét...", "Đang kiểm tra Blockchain...", "info");
  try {
    const res = await fetch(`${API_URL}/check-integrity`);
    const data = await res.json();
    // Kiểm tra kết quả trả về từ server
    if (data.status.includes("AN TOÀN") || data.message.includes("hợp lệ")) {
      showToast("An Toàn", data.message, "success");
    } else {
      showToast("Cảnh Báo", data.message, "error");
    }
  } catch (e) {
    showToast("Lỗi", "Không thể kết nối", "error");
  }
}
