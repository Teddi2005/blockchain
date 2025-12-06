import jwt from 'jsonwebtoken'

// payload: nội dung cần lưu
// privateKey: chữ ký bí mật của server
// options: chuẫn mã hoa ngày hết hạn
export const signToken = ({
  payload, //
  privateKey = process.env.JWT_SECRET as string,
  options = { algorithm: 'HS256' }
}: {
  payload: any
  privateKey?: string
  options?: jwt.SignOptions
}) => {
  return new Promise<String>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) throw reject(error)
      resolve(token as string)
    })
  })
}
