import express from 'express'
import z, { ZodError } from 'zod'
import { createUser, getUsers } from '../firebase/firebase'
const router = express.Router()
import { v4 as uuidv4 } from 'uuid'



router.get('/users', async (request, response) => {
  const data = await getUsers()
  return response.status(200).json(data) 
})

router.post('/register', async (request, response) => {
  try {
    const createRegisterSchema = z.object({
      name: z.string(),
      lastname: z.string(),
      email: z.string().email(),
      password: z.string().min(8)
    })
    const id = uuidv4()

    const { name, lastname, email, password } = createRegisterSchema.parse(request.body)

    const data = {
      id,
      name,
      lastname,
      email,
      password
    }
    console.log(data)
    await createUser(data)

    response.status(201).json({ message: 'Usuario criado' })
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({ error: 'Erro de validação dos dados' })
    } else {
      response.status(503).json({ error: 'O servidor não conseguiu receber os dados' })
    }
  }
})

export { router }
