import { Request, Response, NextFunction } from 'express'
import jwt, { Secret } from 'jsonwebtoken'
import '../../config/dotenv.config';

const secretKey = process.env.SECRET_KEY

interface RequestWithUsername extends Request {
  username?: string;
}

export function verifyToken(request: RequestWithUsername, response: Response, next: NextFunction) {
  const authHeader = request.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return response.status(401).json({ message: 'Token não fornecido'});
  }

  jwt.verify(token, secretKey as Secret, (err, decoded) => {
    if (err) {
      return response.status(403).json({ message: 'Token inválido' })
    }

    request.username = (decoded as any).username
    next()
  })

}