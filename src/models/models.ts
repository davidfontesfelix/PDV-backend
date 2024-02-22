import { z } from "zod";

const UserParamsSchema = z.object({
  id: z.string(),
  name: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  password: z.string()
})


const ProductParamsSchema = z.object({
  code: z.number().min(13),
  name: z.string(),
  category: z.string(),
  price: z.number(),
  amount: z.number()
})

const CategoryParamsSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string()
})

export {UserParamsSchema, ProductParamsSchema, CategoryParamsSchema}