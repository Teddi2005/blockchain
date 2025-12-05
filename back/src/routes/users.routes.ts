import { Router } from 'express'
import {
  checkIntegrityController,
  donateController,
  getHistoryController,
  getRichListController,
  loginController,
  registerController
} from '../controllers/users.controllers'

const usersRouter = Router()

usersRouter.post('/register', registerController)
usersRouter.post('/login', loginController)
usersRouter.post('/donate', donateController)
usersRouter.get('/history', getHistoryController)
usersRouter.get('/rich-list', getRichListController)
usersRouter.get('/check-integrity', checkIntegrityController)

export default usersRouter
