import request from "supertest";
import app from "../app";

describe('GET /dashboard/today', () => {
  it('should return an object', async () => {
    const response = await request(app).get('/dashboard/today')

    expect(response.status).toBe(200)
    expect(typeof response.body).toBe('object')
  })
})

describe('GET /dashboard/month', () => {
  it('should return an object', async () => {
    const response = await request(app).get('/dashboard/month')

    expect(response.status).toBe(200)
    expect(typeof response.body).toBe('object')
  }) 
})

describe('GET /dashboard/month/:monthNumber', () => {
  it('should return the error: "Mês invalido"', async () => {
    const response = await request(app).get('/dashboard/month/13')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({ error: "Mês invalido"})
  }) 
})