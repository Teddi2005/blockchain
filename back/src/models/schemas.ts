import { ObjectId } from 'mongodb'

export interface User {
  _id?: ObjectId
  username: string
  password: string
  email: string
  address: string
  private_key: string
  created_at?: string
}

export interface Block {
  _id?: ObjectId
  index: number
  timestamp: string
  prev_hash: string
  hash: string
  data: {
    user: string // Địa chỉ ví người gửi
    value: number // Số tiền
    time: string
  }
  // Blockchain Go của bạn có thể lưu phẳng các trường này ra ngoài data,
  // nhưng ở đây tôi define theo cấu trúc MongoDB bạn đã dùng ở JS cũ:
  // Nếu DB cũ lưu thẳng user, value, address ở root document thì dùng interface dưới:
  user?: string
  address?: string // Đôi khi lưu là address
  value?: number
  time?: string
  name?: string // Tên hiển thị (nếu có)
}
