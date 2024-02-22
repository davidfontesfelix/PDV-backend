import express from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerFile from './swagger.json'
import '../config/dotenv.config'
import cors from 'cors'
import { userRoutes } from './routes/user-routes'
import { productRoutes } from './routes/product-routes'

const app = express()

app.use(cors());
app.use(express.json())

app.use(userRoutes)
app.use(productRoutes)

const port = process.env.PORT ?? 3001

const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.6.0/swagger-ui.min.css";

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, {customCssUrl: CSS_URL}))

app.listen(port, () => { console.log('O servidor está rodando na porta' + port) })
