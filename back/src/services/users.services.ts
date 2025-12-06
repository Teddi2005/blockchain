import { Wallet } from "ethers";
import axios from "axios";
import databaseService from "./database.services";
import { User } from "../models/schemas";
import dotenv from "dotenv";
dotenv.config();

const GO_URL = "http://localhost:8080";

const GO_SECRET_KEY = process.env.SECRET_API_KEY;

class UsersService {
  // MAP ADDRESS -> USERNAME
  private async getAddressMap() {
    const users = await databaseService.users.find({}).toArray();
    const map: Record<string, string> = {};
    users.forEach((u) => {
      if (u.address) {
        map[u.address.toLowerCase()] = u.username;
      }
    });
    return map;
  }

  async register(payload: any) {
    const { username, password, email } = payload;

    // Check trùng
    const exist = await databaseService.users.findOne({
      $or: [{ username }, { email }],
    });

    if (exist) {
      throw new Error("Tên tài khoản hoặc Email đã tồn tại!");
    }

    // Tạo ví Blockchain
    const wallet = Wallet.createRandom();

    const newUser: User = {
      username,
      password,
      email,
      address: wallet.address,
      private_key: wallet.privateKey,
      created_at: new Date().toLocaleString(),
    };

    await databaseService.users.insertOne(newUser);
    return { ...newUser, message: "Tạo tài khoản thành công!" };
  }

  async login(payload: any) {
    const { username, password } = payload;
    const user = await databaseService.users.findOne({ username, password });

    if (!user) {
      throw new Error("Sai tên hoặc mật khẩu!");
    }

    return user;
  }

  async donate(payload: any) {
    const { privateKey, amount } = payload;
    const currentTime = new Date().toLocaleString();

    // Validate private key
    if (!privateKey) throw new Error("Thiếu Private Key");

    const wallet = new Wallet(privateKey);
    const senderAddress = wallet.address;

    console.log(`💸 [DONATE] ${senderAddress} sending ${amount}...`);

    // Gọi sang Go Blockchain
    const response = await axios.post(
      `${GO_URL}/add-block`,
      {
        user: senderAddress,
        value: parseInt(amount),
        time: currentTime,
      },
      { headers: { "X-API-Key": GO_SECRET_KEY } }
    );

    return {
      hash: response.data.hash,
      sender: senderAddress,
    };
  }

  async getHistory() {
    const history = await databaseService.blocks
      .find({})
      .sort({ index: -1 })
      .limit(10)
      .project({ _id: 0, prehash: 0 })
      .toArray();

    const userMap = await this.getAddressMap();

    // Map tên hiển thị
    const prettyHistory = history.map((block: any) => {
      const rawAddr = block.address || block.user || "";
      const lookupKey = rawAddr.toLowerCase();
      const displayName = userMap[lookupKey] || rawAddr || "Ẩn danh";

      return {
        ...block,
        name: displayName,
        address: rawAddr,
      };
    });

    return prettyHistory;
  }

  async getRichList() {
    const richList = await databaseService.blocks
      .aggregate([
        {
          $group: {
            _id: "$address", // Gom theo địa chỉ ví
            total: { $sum: "$value" },
          },
        },
        { $sort: { total: -1 } },
      ])
      .toArray();

    const userMap = await this.getAddressMap();

    const prettyList = richList.map((item: any) => {
      let rawAddress = item._id || "unknown";
      const lookupKey = rawAddress.toString().toLowerCase();
      let finalName = userMap[lookupKey];

      // Lọc khách vãng lai
      if (!finalName) {
        finalName = "Khách vãng lai";
      }

      return {
        name: finalName,
        total: item.total,
      };
    });

    return prettyList;
  }

  async checkIntegrity() {
    const response = await axios.get(`${GO_URL}/check-integrity`);
    return response.data;
  }
}

const usersService = new UsersService();
export default usersService;
