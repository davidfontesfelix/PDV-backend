import { Request, Response, NextFunction } from "express";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase-config";
import jwt, { Secret } from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY


interface UserId {
  id: string
}

interface DecodedToken {
  email: string;
  user: UserId
}

export async function checkAdmin(request: Request, response: Response, next: NextFunction) {
  const authHeader = request.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  const usersCollection = collection(db, 'users')

  if (!token) {
    return response.status(401).json({ error: 'Token não fornecido'});
  }

  jwt.verify(token, secretKey as Secret, async (err, decoded) => {
    if (err) {
      return response.status(403).json({ error: 'Token inválido' })
    } else {

      const q = query(usersCollection, where('id', '==', (decoded as DecodedToken).user.id), where('isAdmin', '==', true));

      const querySnapshot = await getDocs(q)
      if (querySnapshot.size === 0) {
        return response.status(403).json({ error: 'Acesso negado. Sem permissão para acessar essa rota' })
      }
      next()
    }
  })
}