import express from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerFile from './swagger.json'
import '../config/dotenv.config'
import cors from 'cors'
import { userRoutes } from './routes/user-routes'
import { productRoutes } from './routes/product-routes'
import { categoriesRoutes } from './routes/categories-routes'
import { salesRoutes } from './routes/sales-routes'
import cron from 'node-cron'
import { deleteSalesPreviousMonth } from './scripts/delete-sales-previous-month'
import { excludeResultsFromPreviousMonth } from './scripts/exclude-results-from-previous-months'
import { dashboardDataRoutes } from './routes/dashboard-data-routes'

const app = express()

app.use(cors());
app.use(express.json())

app.use(userRoutes)
app.use(productRoutes)
app.use(categoriesRoutes)
app.use(salesRoutes)
app.use(dashboardDataRoutes)

let port: string | number

if(process.env.NODE_ENV == 'test') {
  port = 0
} else {
  port = process.env.PORT ?? 3001
}

const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css";

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, {customCssUrl: CSS_URL}))

const server = app.listen(port, () => { console.log('O servidor está rodando na porta' + port) })

process.on('SIGTERM', () => {
  console.info('Recebido sinal de encerramento. Encerrando servidor...')
  server.close(() => {
    console.log('Servidor encerrado com sucesso')
    process.exit(0)
  })
})

cron.schedule('59 23 28-31 * *', async () => deleteSalesPreviousMonth())
cron.schedule('0 0 1 1 * ', async () => excludeResultsFromPreviousMonth())

export default app