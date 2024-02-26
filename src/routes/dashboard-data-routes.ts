import express from 'express'
import { getDashboardOfTheDay, getDashboardOfTheMonth, getDashboardOfTheMonthNumber } from '../controllers/dashboard-data-controller'
const dashboardDataRoutes = express.Router()

dashboardDataRoutes.get('/dashboard/today', async (request, response) => {
  try {
    const dashboardResponseOfTheDay = await getDashboardOfTheDay()
    
    response.status(200).json(dashboardResponseOfTheDay)
  } catch {
    response.status(503).json({ error: 'O servidor não conseguiu mandar os dados' })
  }
})

dashboardDataRoutes.get('/dashboard/month', async (request, response) => {
  try { 
    const dashboardResponseOfTheMonth = await getDashboardOfTheMonth()

    response.status(200).json(dashboardResponseOfTheMonth)
  } catch {
    response.status(503).json({ error: 'O servidor não conseguiu mandar os dados' })
  }
})

dashboardDataRoutes.get('/dashboard/month/:monthNumber', async (request, response) => {
  try {
    const monthNumber = request.params.monthNumber

    const dashboardResponseOfTheMonthNumber = await getDashboardOfTheMonthNumber(parseInt(monthNumber))

    if(parseInt(monthNumber) > 12) {
      return response.status(404).json({error: 'Mês invalido'})
    } 

    if (dashboardResponseOfTheMonthNumber === false) {
      return response.status(404).json({error: 'Mês não foi encontrado'})
    }

    return response.status(200).json(dashboardResponseOfTheMonthNumber)
  } catch {
    response.status(503).json({ error: 'O servidor não conseguiu mandar os dados' })
  }
})



export {dashboardDataRoutes}
