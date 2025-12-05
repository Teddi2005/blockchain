// js/dashboard.js
let chartInstance = null;

function initDashboard() {
  if (!currentUser) return; // currentUser lấy từ auth.js

  const usernameEl = document.getElementById("dash-username");
  const addressEl = document.getElementById("dash-address");

  if (usernameEl) usernameEl.innerText = currentUser.username;
  if (addressEl) {
    const address = currentUser.address;
    addressEl.innerText = `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  }

  const storedToast = localStorage.getItem("toastMessage");
  if (storedToast) {
    const t = JSON.parse(storedToast);
    showToast(t.title, t.msg, t.type); // showToast lấy từ utils.js
    localStorage.removeItem("toastMessage");
  }

  loadData();
}

async function loadData() {
  // Chỉ chạy nếu có container hiển thị lịch sử
  if (!document.getElementById("history-container")) return;

  // showToast lấy từ utils.js
  showToast("Đang tải", "Đang tải dữ liệu...", "info");

  try {
    const [richRes, historyRes] = await Promise.all([
      fetch(`${API_URL}/rich-list`),
      fetch(`${API_URL}/history`),
    ]);

    const richData = await richRes.json();
    const historyData = await historyRes.json();

    processRichListData(richData.data);
    renderHistory(historyData.data);
    showToast("Thành công", "Tải dữ liệu hoàn tất.", "success");
  } catch (err) {
    showToast("Lỗi tải dữ liệu", "Không thể tải dữ liệu.", "error");
  }
}

function processRichListData(data) {
  let totalMoney = 0;
  data.forEach((i) => (totalMoney += i.total));
  const totalFundEl = document.getElementById("total-fund");
  if (totalFundEl) totalFundEl.innerText = formatCurrency(totalMoney); // formatCurrency từ utils.js

  let activeUsers = data.filter((i) => {
    const name = i.name || "";
    return name !== "Genesis" && !name.startsWith("0x") && i.total > 0;
  });

  const totalPeopleEl = document.getElementById("total-people");
  if (totalPeopleEl) totalPeopleEl.innerText = activeUsers.length;

  activeUsers.sort((a, b) => b.total - a.total);

  let displayList = [];
  if (activeUsers.length <= 5) {
    displayList = activeUsers;
  } else {
    const top5 = activeUsers.slice(0, 5);
    const others = activeUsers.slice(5);
    const othersTotal = others.reduce((sum, item) => sum + item.total, 0);
    displayList = [...top5];
    if (othersTotal > 0) {
      displayList.push({
        name: `Khác (${others.length})`,
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
  if (!container) return;
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML =
      '<div class="text-center text-gray-400 mt-4 text-sm">Chưa có dữ liệu.</div>';
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

  if (chartInstance) chartInstance.destroy();

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

async function handleDonate() {
  const amt = document.getElementById("donate-amount").value;
  const btn = document.getElementById("btn-donate");

  if (!amt || amt <= 0)
    return showToast("Lỗi", "Số tiền không hợp lệ", "error");
  if (!currentUser) return showToast("Lỗi", "Vui lòng đăng nhập lại.", "error");

  if (btn) btn.disabled = true;

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
    showToast("Lỗi", "Lỗi kết nối", "error");
  }
  if (btn) btn.disabled = false;
}

async function checkIntegrity() {
  showToast("Đang quét...", "Đang kiểm tra Blockchain...", "info");
  try {
    const res = await fetch(`${API_URL}/check-integrity`);
    const data = await res.json();
    if (data.status.includes("AN TOÀN") || data.message.includes("hợp lệ")) {
      showToast("An Toàn", data.message, "success");
    } else {
      showToast("Cảnh Báo", data.message, "error");
    }
  } catch (e) {
    showToast("Lỗi", "Không thể kết nối", "error");
  }
}
