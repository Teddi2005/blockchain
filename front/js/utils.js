// js/utils.js
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

  if (!toast) return;

  titleEl.innerText = title;
  msgEl.innerText = msg;

  // Reset classes
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
