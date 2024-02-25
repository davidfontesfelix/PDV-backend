import request from 'supertest'
import app from '../app'

describe('GET /cetegories', () => {
  it('should return an array', async () => {
    const response = await request(app).get('/categories')

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })
})

describe('POST /categories/register', () => {
  it('should return the error: "Erro de validação dos dados"', async () => {
    const response = await request(app).post('/categories/register').send({name: 3, description: "teste" })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({error: 'Erro de validação dos dados'})
  })
})

describe('PUT /categories/edit/:id', () => {
  it('should return the error: "Id não encontrado"', async () => {
    const newData = {name: 'teste', description: 'jest'}
    const response = await request(app).put('/categories/edit/testeid').send(newData)

    expect(response.status).toBe(404)
    expect(response.body).toEqual({ error: 'Id não encontrado'})
  })
})

describe('DELETE /categories/delete/:id', () => {
  it('should return the error: "Id não foi encontrado"', async () => {
    const response = await request(app).delete('/categories/delete/testid')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({ error: 'Id não encontrado' })
  })
})