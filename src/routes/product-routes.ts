import express from "express";
import { checkCode, createProduct, deleteProduct, getAllProducts, getProductByCode, updateAmount, updateProduct } from "../controllers/product-controller";
import { ZodError, z } from "zod";
import { verifyToken } from "../middlewares/authMiddleware";
const productRoutes = express.Router()

const ProductParams = z.object({
  code: z.number().min(12),
  name: z.string(),
  category: z.string(),
  price: z.number(),
  amount: z.number()
})

const ProductParamsNoCode = z.object({
  name: z.string(),
  category: z.string(),
  price: z.number(),
  amount: z.number()
})

productRoutes.get("/products", async (request, response) => {
  try {
    const routerResponse = await getAllProducts()
    response.status(200).json(routerResponse)
  } catch {
    response.status(503).json({ error: 'O servidor não conseguiu receber os dados' })
  }
})

productRoutes.get("/products/:code", async (request, response) => {
  try {
    const paramSchema = z.object({
      code: z.string().min(12)
    })
    const { code } = paramSchema.parse({  code: request.params.code})
    const productByCodeResponse = await getProductByCode(parseInt(code))

    if(!productByCodeResponse) {
      return response.status(404).json({error: 'Código não encontrado'})
    } 

    return response.status(200).json(productByCodeResponse)
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({ error: 'Erro de validação dos dados' })
    } else {
      response.status(503).json({ error: 'O servidor não conseguiu receber os dados' })
    }
  }
})

productRoutes.post("/products/register", verifyToken, async (request, response) => {
  try {
    const {code, name, category, price, amount} = ProductParams.parse(request.body)

    const codeExists = await checkCode(code)

    if (codeExists) {
      await updateAmount(code, amount);
      return response.status(200).json({ message: "A quantidade do produto foi alterada" });
    } else {
      await createProduct({ code, name, category, price, amount });
      return response.status(201).json({ message: "Produto criado com sucesso" });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({ error: 'Erro de validação dos dados' })
    } else {
      response.status(503).json({ error: 'O servidor não conseguiu receber os dados' })
    }
  }
})

productRoutes.put("/products/edit/:code", verifyToken, async (request, response) => {
  try {
    const paramSchema = z.object({
      code: z.string().min(12)
    })
    
    const { code } = paramSchema.parse({  code: request.params.code})
    const codeInt = parseInt(code)

    const codeExists = await checkCode(codeInt)
    const {name, price, category, amount} = ProductParamsNoCode.parse(request.body)

    if(codeExists) {
      await updateProduct({code: codeInt, name, category, price, amount}, codeInt)
      response.status(200).json({message: "Editado com sucesso"})
    } else {
      response.status(400).json({ error: 'Produto não encontrado' })
    }

  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({ error: 'Erro de validação dos dados' })
    } else {
      response.status(503).json({ error: 'O servidor não conseguiu receber os dados' })
    }
  }

})

productRoutes.delete("/products/delete/:code", verifyToken, async (request, response) => {
  try {
    const paramSchema = z.object({
      code: z.string().min(12)
    })

    const { code } = paramSchema.parse({  code: request.params.code})
    const codeInt = parseInt(code)

    const deleteProductResponse = await deleteProduct(codeInt)
  
    if (!deleteProductResponse) {
      return response.status(404).json({error: 'Id não foi encontrado'})
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
export {productRoutes}