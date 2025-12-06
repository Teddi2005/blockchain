import { Request, Response } from 'express'
import usersService from '../services/users.services'

export const registerController = async (req: Request, res: Response) => {
  try {
    const result = await usersService.register(req.body)
    res.json({ status: 'success', data: result })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const loginController = async (req: Request, res: Response) => {
  try {
    const result = await usersService.login(req.body)
    res.json({ status: 'success', ...result })
  } catch (error: any) {
    res.status(401).json({ error: error.message })
  }
}

export const donateController = async (req: Request, res: Response) => {
  try {
    const result = await usersService.donate(req.body)
    res.json({ status: 'success', ...result })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ error: 'Lỗi kết nối Blockchain hoặc Private Key sai' })
  }
}

export const getHistoryController = async (req: Request, res: Response) => {
  try {
    const data = await usersService.getHistory()
    res.json({ data })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getRichListController = async (req: Request, res: Response) => {
  try {
    const data = await usersService.getRichList()
    res.json({ data })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const checkIntegrityController = async (req: Request, res: Response) => {
  try {
    const data = await usersService.checkIntegrity()
    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: 'Lỗi kết nối Blockchain Node' })
  }
}
