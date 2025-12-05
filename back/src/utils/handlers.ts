import { NextFunction, Request, RequestHandler, Response } from 'express'

// hàm nhận cào cotroller | hoặc middlewares async
//  và biến chúng nó thành controller và middleware có cấu trúc try catch next
export const wrapAsync = (func: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
      // chạy hàm đã đưa trong cấu trúc try catch
    } catch (error) {
      next(error)
    }
  }
}
