import express, { response } from 'express'
import z, { ZodError } from 'zod'
import { createUser, getUsers} from '../firebase/firebase'
const router = express.Router()
import { v4 as uuidv4 } from 'uuid'
import jwt, { Secret } from 'jsonwebtoken'
import '../../config/dotenv.config';
import { verifyToken } from '../middlewares/authMiddleware'
 
router.get('/users', async (request, response) => {
  const data = await getUsers()
  return response.status(200).json(data) 
})

router.get('/user/:id', verifyToken, async (request, response) => {
  try {
    const id = request.params.id
  
    const data = await getUsers()
    const user = data.find((user: {id: string}) => user.id === id)

    if(user) {
      response.status(201).json({user})
    } else {
      response.status(401).json({ error: "Usuário não encontrado"})
    }
    
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(401).json({ error: 'Erro de validação dos dados' })
    } else {
      response.status(503).json({ error: 'Erro ao tentar encontrar o user' })
    }
  }

})

router.post('/login', async (request, response) => {
  
  try {
      const secretKey = process.env.SECRET_KEY

      const loginSchema = z.object({
        email: z.string().email(),
        password: z.string().min(8)
      })

      const {email, password} = loginSchema.parse(request.body)

      const data = await getUsers()

      const userReturn = data.find((user: { email: string; password: string }) => user.email === email && user.password === password)

      if(email === userReturn.email && password === userReturn.password) {
        const { password, ...user} = userReturn
        const token = jwt.sign({email, password}, secretKey as Secret)
        response.json({ message: 'Usuário autenticado com sucesso', token, user, })
      } else {
        response.status(401).json({message: 'Credential inválidas'})
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

    const { name, lastname, email, password } = createRegisterSchema.parse(request.body)

    const data = {
      id,
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
