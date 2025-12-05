const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const { Wallet } = require("ethers");

const app = express();
app.use(cors());
app.use(express.json());

// --- CẤU HÌNH ---
// Đảm bảo Blockchain Go đang chạy port 8080
const GO_URL = "http://localhost:8080";
const GO_SECRET_KEY = "8047468c59139613d5d07b7102148f3fa79cc16586cf398439d7637b53915bc5 ";

const MONGO_URI =
  "mongodb+srv://hoavt2005:namsaulayvo@block.i0hqtna.mongodb.net/?appName=Block";

const DB_BLOCKCHAIN = "blockchain";
const DB_ACCOUNT = "account";
const COLL_ACCOUNTS = "accounts";
const COLL_BLOCKS = "blocks";

// --- HÀM PHỤ: TẠO BẢN ĐỒ (ADDRESS -> USERNAME) ---
// [FIX]: Đưa hết về chữ thường để so sánh chính xác
async function getAddressMap(client) {
  const db = client.db(DB_ACCOUNT);
  const accounts = await db.collection(COLL_ACCOUNTS).find({}).toArray();
  const map = {};
  accounts.forEach((acc) => {
    if (acc.address) {
      // Lưu key là address viết thường
      map[acc.address.toLowerCase()] = acc.username;
    }
  });
  console.log("User Map Loaded:", Object.keys(map).length, "users");
  return map;
}

// --- API 1: ĐĂNG KÝ ---
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db(DB_ACCOUNT);
    const accounts = db.collection(COLL_ACCOUNTS);

    const exist = await accounts.findOne({ username });
    if (exist) {
      return res.status(400).json({ error: "Tên tài khoản đã tồn tại!" });
    }

    const wallet = Wallet.createRandom();
    const newAccount = {
      username: username,
      password: password,
      address: wallet.address,
      private_key: wallet.privateKey,
      created_at: new Date().toLocaleString(),
    };

    await accounts.insertOne(newAccount);
    console.log(`🆕 Đã tạo: ${username} | Addr: ${wallet.address}`);
    res.json({ status: "success", message: "Tạo tài khoản thành công!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi Server" });
  } finally {
    await client.close();
  }
});

// --- API 2: ĐĂNG NHẬP ---
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db(DB_ACCOUNT);
    const user = await db
      .collection(COLL_ACCOUNTS)
      .findOne({ username, password });

    if (!user) return res.status(401).json({ error: "Sai tên hoặc mật khẩu!" });

    console.log(`User ${username} đã đăng nhập.`);
    res.json({
      status: "success",
      username: user.username,
      address: user.address,
      private_key: user.private_key,
    });
  } catch (err) {
    res.status(500).json({ error: "Lỗi đăng nhập" });
  } finally {
    await client.close();
  }
});

// --- API 3: QUYÊN GÓP ---
app.post("/api/donate", async (req, res) => {
  const { privateKey, amount } = req.body;
  const currentTime = new Date().toLocaleString();

  try {
    const wallet = new Wallet(privateKey);
    const senderAddress = wallet.address;

    console.log(`💸 [DONATE] ${senderAddress} đang gửi ${amount}...`);

    const response = await axios.post(
      `${GO_URL}/add-block`,
      {
        user: senderAddress,
        value: parseInt(amount),
        time: currentTime,
      },
      { headers: { "X-API-Key": GO_SECRET_KEY } }
    );

    res.json({
      status: "success",
      hash: response.data.hash,
      sender: senderAddress,
    });
  } catch (err) {
    console.error("Lỗi Donate:", err.message);
    res.status(500).json({ error: "Private Key sai hoặc Blockchain lỗi!" });
  }
});

// --- API 4: LẤY LỊCH SỬ ---
app.get("/api/history", async (req, res) => {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();

    const history = await client
      .db(DB_BLOCKCHAIN)
      .collection(COLL_BLOCKS)
      .find({})
      .sort({ index: -1 })
      .limit(10)
      .project({ _id: 0, prehash: 0 })
      .toArray();

    const userMap = await getAddressMap(client);

    const prettyHistory = history.map((block) => {
      // [FIX] Chuẩn hóa address về chữ thường để tra cứu chính xác
      const lookupKey = (block.address || "").toLowerCase();

      const displayName = userMap[lookupKey] || block.address || "Ẩn danh";
      return {
        ...block,
        name: displayName,
        address: block.address,
      };
    });

    res.json({ data: prettyHistory });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Lỗi DB" });
  } finally {
    await client.close();
  }
});

// --- API 5: THANH TRA ---
app.get("/api/check-integrity", async (req, res) => {
  try {
    const response = await axios.get(`${GO_URL}/check-integrity`);
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Lỗi kết nối Blockchain Node" });
  }
});

// --- API 6: BẢNG XẾP HẠNG (RICH LIST - ĐÃ FIX) ---
app.get("/api/rich-list", async (req, res) => {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db(DB_BLOCKCHAIN);

    // [BƯỚC 1]: Group theo 'address' thay vì 'name'
    // Sửa lỗi: gom tất cả về null do block không có trường name
    const richList = await db
      .collection(COLL_BLOCKS)
      .aggregate([
        {
          $group: {
            _id: "$address", // <--- QUAN TRỌNG: Sửa $name thành $address
            total: { $sum: "$value" },
          },
        },
        { $sort: { total: -1 } },
        // Bỏ limit để Frontend tự lọc
      ])
      .toArray();

    // [BƯỚC 2]: Lấy map tên người dùng
    const userMap = await getAddressMap(client);

    // [BƯỚC 3]: Ghép tên vào kết quả
    const prettyList = richList.map((item) => {
      let rawAddress = item._id;
      if (!rawAddress) rawAddress = "unknown";

      const lookupKey = rawAddress.toString().toLowerCase();
      let finalName = userMap[lookupKey];

      // Nếu không có tên đăng ký, đánh dấu là khách vãng lai
      if (!finalName) {
        if (rawAddress.length > 10) {
          // Đánh dấu để frontend lọc
          finalName = "Khách vãng lai";
        } else {
          finalName = "Khách vãng lai";
        }
      }

      return {
        name: finalName,
        total: item.total,
      };
    });

    res.json({ data: prettyList });
  } catch (e) {
    console.error("Lỗi Rich List:", e);
    res.status(500).json({ error: "Lỗi tính toán Rich List" });
  } finally {
    await client.close();
  }
});

app.listen(3000, () => {
  console.log("Backend Mall chạy tại http://localhost:3000");
});

