import request from "supertest";
import app from "../app";

describe('GET /sales/today', () => {
  it('should return an array', async () => {
    const response = await request(app).get('/sales/today')

    expect(Array.isArray(response.body)).toBe(true)
  })
})

describe('POST /sales/create', () => {
  it('should return the error: "Erro de validação de dados"', async () => {
    const newSalesInvalid = {charge: 'invalid', paid: 20, paymentMethod: 'dinheiro'}
    const response = await request(app).post('/sales/create').send(newSalesInvalid) 

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ error: 'Erro de validação dos dados' })
  })
})

describe('DELETE /sales/delete/:id', () => {
  it('should return the error: "Id não encontrado"', async () => {
    const response = await request(app).delete('/sales/delete/testid')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({ error: 'Id não encontrado'})
  })
})