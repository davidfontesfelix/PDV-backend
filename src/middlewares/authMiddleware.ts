import { Request, Response, NextFunction } from 'express'
import jwt, { Secret } from 'jsonwebtoken'

const secretKey = process.env.SECRET_KEY

interface RequestWithUsername extends Request {
  email?: string;
}



export function verifyToken(request: RequestWithUsername, response: Response, next: NextFunction) {
  const authHeader = request.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return response.status(401).json({ error: 'Token não fornecido'});
  }

  jwt.verify(token, secretKey as Secret, (err) => {
    if (err) {
      return response.status(403).json({ error: 'Token inválido' })
    } else {

      next()
    }
  })

}