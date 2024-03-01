import request from 'supertest'
import app from '../app'


describe('GET /products', () => {
  it('should return an array', async () => {
    const response = await request(app).get('/products')

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })
})

describe('GET /products/:code', () => {
  it('should return the error: "Erro de validação dos dados"', async () => {
    const response = await request(app).get('/products/012345')

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('error', "Erro de validação dos dados")
  })
  it('should return the error: "Código não encontrado"', async () => {
    const response = await request(app).get('/products/0123456789012')

    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty('error', 'Código não encontrado')
  })  
})

describe('POST /products/register', () => { 
  
  it('create a new product', async () => {
  const newProduct = { code: "invalid", name: "Biscoito vitarella treloso chocolate", price: 2.99, category: "biscoitos", amount: 1}
  const response = await request(app).post('/products/register').send(newProduct)
  


    expect(response.status).toBe(401)
    expect(response.body).toEqual({ error: 'Token não fornecido' })
  })
})

describe('PUT /products/edit/:code', () => {
  it('should return the error: "Produto não encontrado"', async () => {
    const newData = {name: 'teste', price: 4, category: 'jest', amount: 2}
    const response = await request(app).put('/products/edit/0123456789012').send(newData)

    expect(response.status).toBe(401)
    expect(response.body).toEqual({ error: 'Token não fornecido' })
  })
})

describe('DELETE /products/delete/:code', () => {
  it('should return the error: "Id não foi encontrado"', async () => {
    const response = await request(app).delete('/products/delete/0123456789012')

    expect(response.status).toBe(401)
    expect(response.body).toEqual({ error: 'Token não fornecido' })
  })
})