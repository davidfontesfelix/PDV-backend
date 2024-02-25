import express from 'express'
import { ZodError, z } from 'zod'
import { createSale, deleteSale, getAllSalesDay} from '../controllers/sales-controller'
import { collectionSize } from '../utils/collection-size'
const salesRoutes = express.Router()

const SalesSchema = z.object({
  charge: z.number().positive(),
  paid: z.number().positive(),
  paymentMethod: z.string(),
})

salesRoutes.get("/sales/today", async (request, response) => {
  const salesList = await getAllSalesDay()
  response.status(200).json(salesList)
})

salesRoutes.post("/sales/create", async (request, response) => {
  try {
    const {charge, paid, paymentMethod} = SalesSchema.parse(request.body)
    const timestamp = new Date()

    const change = paid - charge
    const salesDocsSize = await collectionSize('sales')
    
    await createSale({id: salesDocsSize + 1, charge, paid, change, paymentMethod, timestamp})
    
    response.status(201).json({message: "Venda feita com sucesso"})
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({ error: 'Erro de validação dos dados' })
    } else {
      response.status(503).json({ error: 'O servidor não conseguiu receber os dados' })
      console.error(error)
    }
  }
})

salesRoutes.delete('/sales/delete/:id', async (request, response) => {
  try {
    const id = request.params.id
    const deleteResponse = await deleteSale(parseInt(id))

    if (!deleteResponse) {
      return response.status(404).json({error: 'Id não encontrado'})
    } else {
      return response.status(200).json({message: "Excluído com sucesso"})
    }

  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({ error: 'Erro de validação dos dados' })
    } else {
      response.status(503).json({ error: 'O servidor não conseguiu receber os dados' })
      console.error(error)
    }
  }
})

export {salesRoutes}