import express from 'express'
import { router } from './routes/routes'
import swaggerUi from 'swagger-ui-express'
import swaggerFile from './swagger.json'
import '../config/dotenv.config';
import cors from 'cors'

const app = express()
app.use(cors());
const port = process.env.PORT ?? 3001

const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css";

app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, {customCssUrl: CSS_URL}))

app.use(router)

app.listen(port, () => { console.log('O servidor está rodando na porta' + port) })
