import {addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where} from 'firebase/firestore'
import { z } from 'zod'
import { compare } from 'bcrypt';
import { db } from '../config/firebase-config';
import { UserParamsSchema } from '../models/models';



type UserParams = z.infer<typeof UserParamsSchema>
const usersCollection = collection(db, 'users')

const getUsers = async () => {
  const data = await getDocs(usersCollection)
  const usersList = data.docs.map((doc) => ({...doc.data()}))
  return usersList
}

const checkEmail = async (email: string) => {
  const q = query(usersCollection, where('email', '==', email));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.size > 0) {
    return true
  }

  return false
}

const checkUser = async (email: string, password: string) => {
  const q = query(usersCollection, where('email', '==', email));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return false
  }

  const user = querySnapshot.docs[0].data()
  const check = await compare(password, user.password)

  if (check) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password, ...dataWithoutPassword} = user
    return dataWithoutPassword
  }

  return false
}

const checkId = async (id: string) => {
  const q = query(usersCollection, where('id', '==', id));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return false
  } else {
    return querySnapshot.docs[0].data()
  }
}

const createUser = async (user: UserParams) => {
  await addDoc(usersCollection, user)
}

const updateUser = async (user: UserParams) => {
  const q = query(usersCollection, where('id', '==', user.id))
  const querySnapshot = await getDocs(q);

  if (querySnapshot.size > 0) {
    const docId = querySnapshot.docs[0].id;
    const docRef = doc(db, 'users', docId)
    await updateDoc(docRef, user)
    return true
  } else {
    return false 
  }
  
}

const deleteUser = async (id: string) => {
  const q = query(usersCollection, where('id', '==', id))
  const querySnapshot = await getDocs(q);

  if (querySnapshot.size > 0) {
    const docId = querySnapshot.docs[0].id;
    const docRef = doc(db, 'users', docId)
    await deleteDoc(docRef)
    return true
  } else {
    return false 
  }
}

export { createUser, getUsers, checkEmail, checkUser, checkId, updateUser, deleteUser }
