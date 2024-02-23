import express from 'express'
import { ZodError } from 'zod'
const salesRoutes = express.Router()

salesRoutes.get

salesRoutes.post("/sales/create", async (request, response) => {
  try {
    console.log('ls')
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({ error: 'Erro de validação dos dados' })
    } else {
      response.status(503).json({ error: 'O servidor não conseguiu receber os dados' })
    }
  }
})

export {salesRoutes}