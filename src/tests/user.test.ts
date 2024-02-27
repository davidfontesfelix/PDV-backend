import request from 'supertest'
import app from '../app'

describe('GET /users', () => {
  it('should return message: "Token não fornecido"', async () => {
    const response = await request(app).get('/users')
    expect(response.status).toBe(401)
    expect(response.body).toEqual({ error: 'Token não fornecido' })
  })
})

describe('GET /user/:id', () => {
  it('should return "Token não fornecido"', async () => {
    const response = await request(app).get('/user/idteste')

    expect(response.status).toBe(401)
    expect(response.body).toEqual({ error: 'Token não fornecido' })
  }) 
})

describe('POST /login', () => {
  it('should create a user', async () => {
    await request(app).post('/register').send({name: 'teste', lastname: 'jest', email:'email@valido.com', password: 'teste1234' })
  })

  it('should return the error: Usuário desativado', async () => {
    const response =  await request(app).post('/login').send({email:'email@valido.com', password: 'teste1234' })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({error: "Usuário desativado"})
  })
})

describe('POST /register', () => {
  it('should return the error "Email já está em uso"', async () => {
    const response = await request(app).post('/register').send({name: 'teste', lastname: 'jest', email:'emailInvalido.com', password: 'teste1234' })

    expect(response.body).toHaveProperty('error', 'Erro de validação dos dados')
  })
})

describe('PUT /edit/:id', () => {
  it('should return the error "Id não foi encontrado"', async () => {

    const response = await request(app).put('/edit/idtest').send({name: 'teste', lastname: 'jest', email:'emailvalido@gmail.com', password: 'teste1234'})

    expect(response.status).toBe(403)
    expect(response.body).toEqual({ error: 'Acesso negado. Id não encontrado' })
  })
})

describe('DELETE /delete/:id', () => {
  it('should return the error "Id não foi encontrado"', async () => {
    const response = await request(app).delete('/delete/idtest')
    expect(response.status).toBe(403)
    expect(response.body).toEqual({ error: 'Acesso negado. Id não encontrado' })
  })
})