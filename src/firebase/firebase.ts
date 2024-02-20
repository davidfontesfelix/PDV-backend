import { initializeApp } from 'firebase/app'
import {addDoc, arrayUnion, collection, deleteDoc, doc, getDocs, getFirestore, query, updateDoc, where} from 'firebase/firestore'
import { z } from 'zod'
import '../../config/dotenv.config';
import { compare } from 'bcrypt';

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const CreateUserParamsSchema = z.object({
  id: z.string(),
  name: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  password: z.string()
})

type UserParams = z.infer<typeof CreateUserParamsSchema>
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
  } else {
    return false
  }
}

const checkUser = async (email: string, password: string) => {
  const q = query(usersCollection, where('email', '==', email));
  const querySnapshot = await getDocs(q);
  
 
  if (querySnapshot.size > 0) {
    const user = querySnapshot.docs[0].data()
    const check = await compare(password, user.password)
    if(check) {
      const {password, ...dataWithoutPassword} = user
      return dataWithoutPassword
    } else {
      return 'error'
    }
  } else {
    return 'error'
  }
}

const checkId = async (id: string) => {
  const q = query(usersCollection, where('id', '==', id));
  const querySnapshot = await getDocs(q);
  
  let user = null
  if (querySnapshot.size > 0) {
    querySnapshot.forEach((doc) => {
      user = doc.data()
    })
    return user
  } else {
    return 'error'
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
