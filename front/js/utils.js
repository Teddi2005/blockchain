// js/utils.js

//định dạng số thành tiền tệ Việt Nam
const formatCurrency = (val) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);

//message
function showToast(title, msg, type = "info") {
  //lấy các phần tử HTML của Toast
  const toast = document.getElementById("toast");
  const icon = document.getElementById("toast-icon");
  const titleEl = document.getElementById("toast-title");
  const msgEl = document.getElementById("toast-msg");

  if (!toast) return;

  //cập nhật nội dung văn bản
  titleEl.innerText = title;
  msgEl.innerText = msg;

  // Xử lý màu sắc và icon
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
    // Màu đỏ + Icon chấm than
    toast.classList.add("border-red-500");
    icon.innerHTML =
      '<i class="fa-solid fa-circle-exclamation text-red-500 text-xl"></i>';
  } else {
    // Màu xanh dương (mặc định) + Icon chữ i
    toast.classList.add("border-blue-500");
    icon.innerHTML =
      '<i class="fa-solid fa-circle-info text-blue-500 text-xl"></i>';
  }

  // Xóa class 'translate-x-full' để Toast trượt từ phải vào màn hình
  toast.classList.remove("translate-x-full");
  setTimeout(() => toast.classList.add("translate-x-full"), 3000);
}
