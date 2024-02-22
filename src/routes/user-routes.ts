import express from 'express'
import z, { ZodError } from 'zod'
import { checkEmail, checkId, checkUser, createUser, deleteUser, getUsers, updateUser} from '../controllers/user-controller'
const userRoutes = express.Router()
import { v4 as uuidv4 } from 'uuid'
import jwt, { Secret } from 'jsonwebtoken'
import '../../config/dotenv.config';
import { verifyToken } from '../middlewares/authMiddleware'
import { hash } from 'bcrypt'
import { randomInt } from 'node:crypto'

const userSchema = z.object({
  name: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  password: z.string().min(8)
})
 
userRoutes.get('/users', verifyToken, async (request, response) => {
  const data = await getUsers()
  return response.status(200).json(data) 
})

userRoutes.get('/user/:id', verifyToken, async (request, response) => {
  try {
    const id = request.params.id
    const user = await checkId(id)

    if(user) {
      response.status(201).json({user})
    } else {
      response.status(401).json({ error: "Id não foi encontrado"})
    }
    
  } catch (error) {
    response.status(503).json({ error: 'Erro ao tentar encontrar o user' }) 
  }
})

userRoutes.post('/login', async (request, response) => {
  try {
      const secretKey = process.env.SECRET_KEY

      const loginSchema = z.object({
        email: z.string().email(),
        password: z.string().min(8)
      })

      const {email, password} = loginSchema.parse(request.body)

      const user = await checkUser(email, password)

      
      if (!user) {
        return response.status(400).json({error: "Usuário não encontrado"})
      }

      const token = jwt.sign({email}, secretKey as Secret)
      return response.status(201).json({ message: 'Usuário autenticado com sucesso', token, user, })
      

  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({ error: 'Erro de validação dos dados' })
    } else {
      response.status(503).json({ error: 'O servidor não conseguiu receber os dados' })
    }
  }
})

userRoutes.post('/register', async (request, response) => {
  try {
    const id = uuidv4()

    const { name, lastname, email, password } = userSchema.parse(request.body)

    const toCheck = await checkEmail(email)
    
    if(toCheck) {
      return response.status(400).json({error: 'Email já está em uso'})
    } else {
      const randomSalt = randomInt(10, 16) 
      const passwordHash = await hash(password, randomSalt)
  
  
      const data = {
        id,
        name,
        lastname,
        email,
        password: passwordHash
      }
      createUser(data)
    }

    response.status(201).json({ message: "Usuário criado com sucesso" })
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({ error: 'Erro de validação dos dados' })
    } else {
      response.status(503).json({ error: 'O servidor não conseguiu receber os dados' })
    }
  }
})

userRoutes.put('/edit/:id', async (request, response) => {
  try {
   const id = request.params.id

   const { name, lastname, email, password } = userSchema.parse(request.body)

   const randomSalt = randomInt(10, 16) 
   const passwordHash = await hash(password, randomSalt)

   const data = {
     id,
     name,
     lastname,
     email,
     password: passwordHash
   }

   const updateUserReturn = await updateUser(data)
 
   if (!updateUserReturn) {
     return response.status(404).json({error: 'Id não foi encontrado'})
   } else {
     return response.status(201).json({message: "Editado com sucesso"})
   }

 } catch (error) {
   if (error instanceof ZodError) {
     response.status(400).json({ error: 'Erro de validação dos dados' })
   } else {
     response.status(503).json({ error: 'O servidor não conseguiu receber os dados' })
   }
 }
})

userRoutes.delete('/delete/:id', async (request, response) => {
  try {
    const id = request.params.id
  
    const responseDeleteUser = await deleteUser(id)
  
    if (!responseDeleteUser) {
      return response.status(404).json({error: 'Id não foi encontrado'})
    } else {
      return response.status(201).json({message: "Excluído com sucesso"})
    }
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({ error: 'Erro de validação dos dados' })
    } else {
      response.status(503).json({ error: 'O servidor não conseguiu receber os dados' })
    }
  }
})


export { userRoutes }
