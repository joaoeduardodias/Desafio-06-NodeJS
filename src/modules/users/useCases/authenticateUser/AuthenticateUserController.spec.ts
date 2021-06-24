import request from 'supertest'
import {Connection} from 'typeorm'
import createConnection from '../../../../database'
import { app } from '../../../../app'


let connection: Connection

describe("Authenticate User", ()=>{

  beforeAll(async()=>{
    connection = await createConnection()
    await connection.runMigrations()

})

  afterAll(async()=>{
    await connection.dropDatabase()
    await connection.close()
  })

  it("should be able authenticate user", async()=>{
    await request(app).post("/api/v1/users").send({
      name: "User test",
      email: "test@email.com.br",
      password: "123456"
    })
    const response = await request(app).post("/api/v1/sessions").send({
      email: "test@email.com.br",
      password: "123456"
   })
    expect(response.status).toBe(200)
  })

  it("should not  be able authenticate nonexist user", async()=>{

    const response = await request(app).post("/api/v1/sessions").send({
      email: "test2@email.com.br",
      password: "12345622"
   })
    expect(response.body.message).toEqual('Incorrect email or password')
    expect(response.status).toBe(401)
  })
  it("should not  be able authenticate user incorrect password", async()=>{

    const response = await request(app).post("/api/v1/sessions").send({
      email: "test@email.com.br",
      password: "1234"
   })
    expect(response.body.message).toEqual('Incorrect email or password')
    expect(response.status).toBe(401)
  })


})
