import { initializeApp } from 'firebase/app'
import { addDoc, arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from 'firebase/firestore'
import { z } from 'zod'
import '../../config/dotenv.config';

const apiKeyEnv = process.env.API_KEY
const authDomainEnv = process.env.AUTH_DOMAIN
const projectIdEnv = process.env.PROJECT_ID

const firebaseConfig = {
  apiKey: apiKeyEnv,
  authDomain: authDomainEnv,
  projectId: projectIdEnv
}



const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const CreateUserParamsSchema = z.object({
  authenticated: z.boolean(),
  id: z.string(),
  name: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  password: z.string()
})

type CreateUserParams = z.infer<typeof CreateUserParamsSchema>
const createUser = async (user: CreateUserParams) => {
  const usersCollection = doc(db, 'users', 'userDocs' )
  await updateDoc(usersCollection, {
    users: arrayUnion(user)
  })
}

type CredentialParams = z.infer<typeof CreateUserParamsSchema>

const updateAuthenticationToTrue = async (userCredential: CredentialParams) => {
  const userRef = doc(db, 'users', 'userDocs')
  
  await updateDoc(userRef, {
    users: arrayUnion({ name: userCredential.name, id: userCredential.id, email: userCredential.email, lastname: userCredential.lastname, password: userCredential.password, authenticated: true })}
  )
  if (userCredential.authenticated === false) {
    updateDoc(userRef, {
      users: arrayRemove(userCredential)
    })
  }
}

// const loginUser = async () => {
//   const usersCollection = collection(db, 'users')
//   const data = await getDocs(usersCollection)
//   const usersList = data.docs.map((doc) => doc.data())
//   return usersList[0]
// }

const getUsers = async () => {
  const usersCollection = collection(db, 'users')
  const data = await getDocs(usersCollection)
  const usersList = data.docs.map((doc) => doc.data())
  return usersList[0].users
}

export { createUser, getUsers, updateAuthenticationToTrue }
