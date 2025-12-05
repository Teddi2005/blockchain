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
    user: string 
    value: number 
    time: string
  }

  user?: string
  address?: string 
  value?: number
  time?: string
  name?: string 
}

