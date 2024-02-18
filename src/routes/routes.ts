import express from 'express'
import z, { ZodError } from 'zod'
import { createUser, getUsers, updateAuthenticationToTrue } from '../firebase/firebase'
const router = express.Router()
import { v4 as uuidv4 } from 'uuid'


 
router.get('/users', async (request, response) => {
  const data = await getUsers()
  return response.status(200).json(data) 
})

router.post('/login', async (request, response) => {
  try {
    const loginSchema = z.object({
      email: z.string().email(),
      password: z.string().min(8)
    })

    const {email, password} = loginSchema.parse(request.body)

    const data = await getUsers()
    const userReturn = data.find((user: { email: string; password: string }) => user.email === email && user.password === password)

    if(userReturn) {
      await updateAuthenticationToTrue(userReturn)
      return response.status(200).json({message: "Autorizado"})
    } else {
      return response.status(400).json({ error: "Usuario não encontrado"})
    }
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({ error: 'Erro de validação dos dados' })
    } else {
      response.status(503).json({ error: 'O servidor não conseguiu receber os dados' })
    }
  }
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
    const authenticated = false

    const { name, lastname, email, password } = createRegisterSchema.parse(request.body)

    const data = {
      id,
      authenticated,
      name,
      lastname,
      email,
      password
    }
    const dataUsers = await getUsers()
    const checkEmail = dataUsers.some((user: { email: string }) => user.email === email)

    if(checkEmail) {
      return response.status(400).json({error: 'Email já está em uso'})
    } else {
      createUser(data)
    }

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
