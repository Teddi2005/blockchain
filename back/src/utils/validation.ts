//  một hàm nhận vào checkSchema
// chạy checkSchema
// tự báo lỗi
// tự response lỗi lun
// giúp giảm tải công việc ở controller

import { NextFunction, Request, Response } from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'

// giúp giảm tải công việc ở controller
// hàm nhận vào validation(kq của checkSchma) sau đó trả ra middleware
// middleware: check validation, khưi lỗi, res lỗi
export const validate =
  (validation: RunnableValidationChains<ValidationChain>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    // check lỗi bằng validation
    await validation.run(req) // kiểm tra validation và lưu lỗi vào req
    // khưi lỗi
    const error = validationResult(req) // lấy lỗi từ req ra
    // if else
    if (error.isEmpty()) {
      return next()
    }
    // nếu có lỗi thì response lỗi
    return res.status(400).json({
      error: error.mapped()
    })
  }
