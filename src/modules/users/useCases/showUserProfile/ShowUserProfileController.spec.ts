import request from  'supertest'
import {Connection} from 'typeorm'
import { app } from '../../../../app'
import createConnection from '../../../../database'
import {v4 as uuidV4} from 'uuid'
import { hash } from 'bcryptjs'

let connection: Connection

describe("Show User Profile",()=>{

  beforeAll(async()=>{
    connection = await createConnection()
    await connection.runMigrations()
    const id = uuidV4();
    const password = await hash("123456", 8);

      await connection.query(
         `INSERT INTO users(id, name, email, password, created_at, updated_at)
          VALUES('${id}','test','email@test.com.br', '${password}', 'now()', 'now()')`
      );
  })

  afterAll(async()=>{
   await connection.dropDatabase()
   await connection.close()
  })

  it("should be able to show user profile", async()=>{

    const responseToken =  await request(app).post("/api/v1/sessions").send({
      email: 'email@test.com.br',
      password: '123456'
    })
    const { token } = responseToken.body
    const response = await request(app).get("/api/v1/profile").set({
      Authorization: `Bearer ${token}`
    })

    expect(response.body).toHaveProperty("id")
  })

  it("should not be able to show profile user nonexist", async()=>{

    const responseToken =  await request(app).post("/api/v1/sessions").send({
      email: 'email2@test.com.br',
      password: '123456'
    })
    const { token } = responseToken.body
    const response = await request(app).get("/api/v1/profile").set({
      Authorization: `Bearer ${token}`
    })

    expect(response.body.message).toEqual("JWT invalid token!")
  })

})
