import express from 'express'
import {checkNameExists, createCategory, deleteCategory, getALlCategories, updateCategory } from '../controllers/category-controller'
import { ZodError, z } from 'zod'
const categoriesRoutes = express.Router()
import { v4 as uuidv4} from 'uuid'
import { verifyToken } from '../middlewares/authMiddleware'

const CategorySchema = z.object({
  name: z.string(),
  description: z.string()
})

categoriesRoutes.get("/categories", async (request, response) => {
  try {
    const list = await getALlCategories()

    response.status(200).json(list)
  } catch (error) {
    response.status(404).json({ error: "Erro ao tentar receber a lista"})
  }

})
categoriesRoutes.post("/categories/register", verifyToken, async (request, response) => {
  try {
    const {name, description} = CategorySchema.parse(request.body)

    const nameExists = await checkNameExists(name)

    if (nameExists) {
      response.status(400).json({ error: 'A categoria já existe'})
    } else {  
      await createCategory({id: uuidv4(), name, description})
      response.status(201).json({ message: 'Categoria criada com sucesso'})
    }

  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({ error: 'Erro de validação dos dados' })
    } else {
      response.status(503).json({ error: 'O servidor não conseguiu receber os dados' })
    }
  }
})
categoriesRoutes.put("/categories/edit/:id", verifyToken, async (request, response) => {
  try {
    const id = request.params.id
    const {name, description} = CategorySchema.parse(request.body)

    const idExists = await updateCategory({id, name, description}, id)

    if (idExists) {
      response.status(200).json({ message: 'Alterado com sucesso'})
    } else {
      response.status(404).json({ error: 'Id não encontrado'})
      
    }
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({ error: 'Erro de validação dos dados' })
    } else {
      response.status(503).json({ error: 'O servidor não conseguiu receber os dados' })
    }
  }
})
categoriesRoutes.delete("/categories/delete/:id", verifyToken, async (request, response) => {
  try {
    const id = request.params.id

    const deleteCategoryResponse = await deleteCategory(id)

    if (!deleteCategoryResponse) {
      return response.status(404).json({error: 'Id não encontrado'})
    } else {
      return response.status(200).json({message: "Excluído com sucesso"})
    }
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({ error: 'Erro de validação dos dados' })
    } else {
      response.status(503).json({ error: 'O servidor não conseguiu receber os dados' })
    }
  }
})


export {categoriesRoutes}