import { MongoClient, Db, Collection } from 'mongodb'
import dotenv from 'dotenv'
import { User, Block } from '../models/schemas'

dotenv.config()

const uri = process.env.MONGO_URI || 'mongodb+srv://hoavt2005:namsaulayvo@block.i0hqtna.mongodb.net/?appName=Block'

class DatabaseService {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db('account') // Default DB
  }

  async connect() {
    try {
      await this.client.connect()
      console.log('☘️  Connected to MongoDB successfully')
      this.db = this.client.db('account') 
    } catch (error) {
      console.error('Error connecting to MongoDB:', error)
    }
  }

  // Collection chứa Tài khoản
  get users(): Collection<User> {
    return this.client.db('account').collection('accounts')
  }

  // Collection chứa Blockchain Blocks 
  get blocks(): Collection<Block> {
    return this.client.db('blockchain').collection('blocks')
  }
}

const databaseService = new DatabaseService()
export default databaseService

