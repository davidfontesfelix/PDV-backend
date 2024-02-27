import { Request, Response, NextFunction } from "express";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase-config";

export async function checkAdmin(request: Request, response: Response, next: NextFunction) {
  const usersCollection = collection(db, 'users')
  const idHeader = request.headers['user-id']
  
  if (idHeader) {
    const q = query(usersCollection, where('id', '==', idHeader), where('isAdmin', '==', true));
    const querySnapshot = await getDocs(q)

    if (querySnapshot.size === 0) {
      return response.status(403).json({ error: 'Acesso negado. Sem permissão para acessar essa rota' })
    }
  } else {
    return response.status(403).json({ error: 'Acesso negado. Id não encontrado' })
  }

  
  next()
}