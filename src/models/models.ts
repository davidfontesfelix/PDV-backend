import { z } from "zod";

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  password: z.string()
})


const ProductSchema = z.object({
  code: z.number().min(13),
  name: z.string(),
  category: z.string(),
  price: z.number(),
  amount: z.number()
})

const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string()
})


const SalesSchema = z.object({
  id: z.number(),
  charge: z.number().positive(),
  paid: z.number().positive(),
  change: z.number().positive(),
  paymentMethod: z.string(),
  timestamp: z.date()
})


export {UserSchema, ProductSchema, CategorySchema, SalesSchema}